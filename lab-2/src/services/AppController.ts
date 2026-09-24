import { Book } from '../models/Book';
import { User, MAX_BORROWED_BOOKS } from '../models/User';
import { IBook } from '../models/interfaces/IBook';
import { IUser } from '../models/interfaces/IUser';
import { Library } from './Library';
import { Storage } from './Storage';
import { NotificationService } from './NotificationService';
import { Validation } from '../utils/validators';
import { generateId } from '../utils/idGenerator';
import { FormResult, OperationResult, PaginatedResult } from '../types';

const BOOKS_KEY = 'library_books';
const USERS_KEY = 'library_users';
const PAGE_SIZE = 5;

/**
 * Центральний контролер стану застосунку: тримає обидві колекції (Library<Book>,
 * Library<User>), відповідає за валідацію, збереження в LocalStorage та бізнес-логіку
 * позичання/повернення книг. Нічого не знає про DOM — після кожної зміни викликає
 * onUpdate(), на яку підписується UI-шар (ui/render.ts), щоб перемалювати сторінку.
 */
export class AppController {
  readonly bookLibrary: Library<Book>;
  readonly userLibrary: Library<User>;

  onUpdate: (() => void) | null = null;

  searchTerm = '';
  bookPage = 1;
  userPage = 1;

  constructor() {
    const savedBooks = Storage.load<IBook[]>(BOOKS_KEY) ?? [];
    const savedUsers = Storage.load<IUser[]>(USERS_KEY) ?? [];

    this.bookLibrary = new Library<Book>(savedBooks.map((b) => Book.fromPlain(b)));
    this.userLibrary = new Library<User>(savedUsers.map((u) => User.fromPlain(u)));
  }

  private persist(): void {
    Storage.save(
      BOOKS_KEY,
      this.bookLibrary.getAll().map((b) => b.toJSON()),
    );
    Storage.save(
      USERS_KEY,
      this.userLibrary.getAll().map((u) => u.toJSON()),
    );
  }

  private notifyChange(): void {
    this.onUpdate?.();
  }

  // ---------- Книги ----------

  addBook(title: string, author: string, year: string): FormResult {
    const errors: Record<string, string> = {};

    const titleCheck = Validation.required(title, 'Назва книги');
    if (!titleCheck.valid) errors.title = titleCheck.message as string;

    const authorCheck = Validation.required(author, 'Автор');
    if (!authorCheck.valid) errors.author = authorCheck.message as string;

    const yearCheck = Validation.isYear(year);
    if (!yearCheck.valid) errors.year = yearCheck.message as string;

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const book = new Book(generateId(), title.trim(), author.trim(), Number(year));
    this.bookLibrary.add(book);
    this.persist();
    NotificationService.show(`Книгу «${book.title}» додано.`, 'success');
    this.notifyChange();

    return { success: true, errors: {} };
  }

  deleteBook(id: string): void {
    const book = this.bookLibrary.findById(id);
    if (book?.isBorrowed && book.borrowedBy) {
      const user = this.userLibrary.findById(book.borrowedBy);
      user?.removeBorrowedBook(id);
    }
    this.bookLibrary.remove(id);
    this.persist();
    NotificationService.show('Книгу видалено.', 'info');
    this.notifyChange();
  }

  borrowBook(bookId: string, userId: string): OperationResult {
    const idCheck = Validation.isUserId(userId);
    if (!idCheck.valid) {
      return { success: false, message: idCheck.message };
    }

    const book = this.bookLibrary.findById(bookId);
    const user = this.userLibrary.findById(userId.trim());

    if (!book) return { success: false, message: 'Книгу не знайдено.' };
    if (book.isBorrowed) return { success: false, message: 'Ця книга вже позичена.' };
    if (!user) return { success: false, message: 'Користувача з таким ID не знайдено.' };

    if (!user.canBorrowMore()) {
      return {
        success: false,
        message: `Користувач ${user.name} вже позичив максимальну кількість книг (${MAX_BORROWED_BOOKS}). Поверніть книгу, щоб позичити нову.`,
      };
    }

    book.borrow(user.id);
    user.addBorrowedBook(book.id);
    this.persist();
    this.notifyChange();

    return {
      success: true,
      message: `${book.toString()} has been borrowed by ${user.toString()}.`,
    };
  }

  returnBook(bookId: string): OperationResult {
    const book = this.bookLibrary.findById(bookId);
    if (!book) return { success: false, message: 'Книгу не знайдено.' };
    if (!book.isBorrowed) return { success: false, message: 'Ця книга не позичена.' };

    const user = book.borrowedBy ? this.userLibrary.findById(book.borrowedBy) : undefined;
    book.returnBook();
    user?.removeBorrowedBook(book.id);

    this.persist();
    this.notifyChange();

    return { success: true, message: `${book.toString()} has been returned.` };
  }

  setSearchTerm(term: string): void {
    this.searchTerm = term.trim().toLowerCase();
    this.bookPage = 1;
    this.notifyChange();
  }

  private getFilteredBooks(): Book[] {
    const all = this.bookLibrary.getAll();
    if (!this.searchTerm) return all;
    return all.filter(
      (b) =>
        b.title.toLowerCase().includes(this.searchTerm) ||
        b.author.toLowerCase().includes(this.searchTerm),
    );
  }

  getPaginatedBooks(): PaginatedResult<Book> {
    const filtered = this.getFilteredBooks();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    this.bookPage = Math.min(Math.max(1, this.bookPage), totalPages);
    const start = (this.bookPage - 1) * PAGE_SIZE;
    return {
      items: filtered.slice(start, start + PAGE_SIZE),
      totalPages,
      currentPage: this.bookPage,
    };
  }

  setBookPage(page: number): void {
    this.bookPage = page;
    this.notifyChange();
  }

  // ---------- Користувачі ----------

  addUser(name: string, email: string): FormResult {
    const errors: Record<string, string> = {};

    const nameCheck = Validation.required(name, "Ім'я");
    if (!nameCheck.valid) errors.name = nameCheck.message as string;

    const emailCheck = Validation.isEmail(email);
    if (!emailCheck.valid) errors.email = emailCheck.message as string;

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const user = new User(generateId(), name.trim(), email.trim());
    this.userLibrary.add(user);
    this.persist();
    NotificationService.show(`Користувача «${user.name}» додано.`, 'success');
    this.notifyChange();

    return { success: true, errors: {} };
  }

  deleteUser(id: string): void {
    const user = this.userLibrary.findById(id);
    if (user) {
      user.borrowedBookIds.forEach((bookId) => {
        const book = this.bookLibrary.findById(bookId);
        book?.returnBook();
      });
    }
    this.userLibrary.remove(id);
    this.persist();
    NotificationService.show('Користувача видалено.', 'info');
    this.notifyChange();
  }

  getPaginatedUsers(): PaginatedResult<User> {
    const all = this.userLibrary.getAll();
    const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    this.userPage = Math.min(Math.max(1, this.userPage), totalPages);
    const start = (this.userPage - 1) * PAGE_SIZE;
    return {
      items: all.slice(start, start + PAGE_SIZE),
      totalPages,
      currentPage: this.userPage,
    };
  }

  setUserPage(page: number): void {
    this.userPage = page;
    this.notifyChange();
  }
}

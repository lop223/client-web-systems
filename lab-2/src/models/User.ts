import { IUser } from './interfaces/IUser';

/** Максимальна кількість книг, які користувач може позичити одночасно. */
export const MAX_BORROWED_BOOKS = 3;

/**
 * Модель користувача. Як і Book, не знає про UI чи сховище.
 */
export class User implements IUser {
  private _id: string;
  private _name: string;
  private _email: string;
  private _borrowedBookIds: string[];

  constructor(id: string, name: string, email: string, borrowedBookIds: string[] = []) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._borrowedBookIds = [...borrowedBookIds];
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get borrowedBookIds(): string[] {
    return [...this._borrowedBookIds];
  }

  /** Чи може користувач позичити ще одну книгу (ліміт MAX_BORROWED_BOOKS). */
  canBorrowMore(): boolean {
    return this._borrowedBookIds.length < MAX_BORROWED_BOOKS;
  }

  addBorrowedBook(bookId: string): void {
    if (!this._borrowedBookIds.includes(bookId)) {
      this._borrowedBookIds.push(bookId);
    }
  }

  removeBorrowedBook(bookId: string): void {
    this._borrowedBookIds = this._borrowedBookIds.filter((id) => id !== bookId);
  }

  toString(): string {
    return `${this._id} ${this._name} (${this._email})`;
  }

  toJSON(): IUser {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      borrowedBookIds: [...this._borrowedBookIds],
    };
  }

  static fromPlain(plain: IUser): User {
    return new User(plain.id, plain.name, plain.email, plain.borrowedBookIds);
  }
}

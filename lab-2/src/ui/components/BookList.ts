import { AppController } from '../../services/AppController';
import { showPromptModal, showInfoModal, showConfirmModal } from './Modal';
import { renderPagination } from './Pagination';

/** Картка "Список Книг": пошук, пагінація, позичання/повернення/видалення. */
export function renderBookList(controller: AppController): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card shadow-sm mb-3';

  const body = document.createElement('div');
  body.className = 'card-body';

  const heading = document.createElement('h5');
  heading.className = 'card-title fw-bold mb-3';
  heading.textContent = 'Список Книг';
  body.appendChild(heading);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'form-control mb-3';
  searchInput.placeholder = 'Пошук за назвою або автором...';
  searchInput.value = controller.searchTerm;
  searchInput.addEventListener('input', () => controller.setSearchTerm(searchInput.value));
  body.appendChild(searchInput);

  const { items, totalPages, currentPage } = controller.getPaginatedBooks();

  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-muted mb-0';
    empty.textContent = 'Книг не знайдено.';
    body.appendChild(empty);
  } else {
    items.forEach((book) => {
      const row = document.createElement('div');
      row.className = 'd-flex justify-content-between align-items-center py-2 border-bottom';

      const label = document.createElement('span');
      label.textContent = book.toString();
      row.appendChild(label);

      const actions = document.createElement('div');
      actions.className = 'd-flex gap-2';

      if (book.isBorrowed) {
        const returnBtn = document.createElement('button');
        returnBtn.type = 'button';
        returnBtn.className = 'btn btn-warning btn-sm';
        returnBtn.textContent = 'Повернути';
        returnBtn.addEventListener('click', () => {
          const result = controller.returnBook(book.id);
          if (result.message)
            showInfoModal(result.message, result.success ? 'Закрити' : 'Зрозуміло!');
        });
        actions.appendChild(returnBtn);
      } else {
        const borrowBtn = document.createElement('button');
        borrowBtn.type = 'button';
        borrowBtn.className = 'btn btn-primary btn-sm';
        borrowBtn.textContent = 'Позичити';
        borrowBtn.addEventListener('click', () => {
          showPromptModal('Введіть ID користувача для позичення книги:', (userId) => {
            const result = controller.borrowBook(book.id, userId);
            if (result.message) showInfoModal(result.message, 'Зрозуміло!');
          });
        });
        actions.appendChild(borrowBtn);
      }

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-outline-danger btn-sm';
      deleteBtn.textContent = 'Видалити';
      deleteBtn.addEventListener('click', () => {
        showConfirmModal(`Видалити книгу «${book.title}»?`, () => controller.deleteBook(book.id));
      });
      actions.appendChild(deleteBtn);

      row.appendChild(actions);
      body.appendChild(row);
    });
  }

  body.appendChild(
    renderPagination(totalPages, currentPage, (page) => controller.setBookPage(page)),
  );

  card.appendChild(body);
  return card;
}

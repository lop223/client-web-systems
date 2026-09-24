import { AppController } from '../../services/AppController';
import { showConfirmModal } from './Modal';
import { renderPagination } from './Pagination';

/** Картка "Список Користувачів": пагінація, видалення. */
export function renderUserList(controller: AppController): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card shadow-sm mb-3';

  const body = document.createElement('div');
  body.className = 'card-body';

  const heading = document.createElement('h5');
  heading.className = 'card-title fw-bold mb-3';
  heading.textContent = 'Список Користувачів';
  body.appendChild(heading);

  const { items, totalPages, currentPage } = controller.getPaginatedUsers();

  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-muted mb-0';
    empty.textContent = 'Користувачів ще немає.';
    body.appendChild(empty);
  } else {
    items.forEach((user) => {
      const row = document.createElement('div');
      row.className = 'd-flex justify-content-between align-items-center py-2 border-bottom';

      const label = document.createElement('span');
      label.textContent = `${user.id} ${user.name} (${user.email})`;
      row.appendChild(label);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-outline-danger btn-sm';
      deleteBtn.textContent = 'Видалити';
      deleteBtn.addEventListener('click', () => {
        showConfirmModal(`Видалити користувача «${user.name}»?`, () =>
          controller.deleteUser(user.id),
        );
      });

      row.appendChild(deleteBtn);
      body.appendChild(row);
    });
  }

  body.appendChild(
    renderPagination(totalPages, currentPage, (page) => controller.setUserPage(page)),
  );

  card.appendChild(body);
  return card;
}

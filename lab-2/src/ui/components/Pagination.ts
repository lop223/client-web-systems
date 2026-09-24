/** Спільний компонент пагінації для списків книг і користувачів. */
export function renderPagination(
  totalPages: number,
  currentPage: number,
  onChange: (page: number) => void,
): HTMLElement {
  const nav = document.createElement('nav');

  if (totalPages <= 1) {
    nav.className = 'd-none';
    return nav;
  }

  nav.className = 'd-flex justify-content-center gap-1 mt-3';

  for (let page = 1; page <= totalPages; page += 1) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn btn-sm ${page === currentPage ? 'btn-dark' : 'btn-outline-secondary'}`;
    btn.textContent = String(page);
    btn.addEventListener('click', () => onChange(page));
    nav.appendChild(btn);
  }

  return nav;
}

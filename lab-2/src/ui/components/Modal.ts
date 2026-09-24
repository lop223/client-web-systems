/**
 * Легкі модальні вікна на чистому DOM API (без bootstrap.js/Popper),
 * стилізовані Bootstrap-класами, щоб відповідати наданому дизайну.
 */
function createOverlay(): { overlay: HTMLDivElement; dialog: HTMLDivElement } {
  const overlay = document.createElement('div');
  overlay.className =
    'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.55)';
  overlay.style.zIndex = '1050';

  const dialog = document.createElement('div');
  dialog.className = 'bg-white rounded shadow p-4';
  dialog.style.minWidth = '320px';
  dialog.style.maxWidth = '90%';
  dialog.style.width = '480px';

  overlay.appendChild(dialog);
  return { overlay, dialog };
}

/** Модальне вікно з полем вводу — використовується для запиту ID користувача при позиченні. */
export function showPromptModal(title: string, onConfirm: (value: string) => void): void {
  const { overlay, dialog } = createOverlay();

  const header = document.createElement('div');
  header.className = 'd-flex justify-content-between align-items-center mb-3';

  const heading = document.createElement('h5');
  heading.className = 'mb-0 fw-bold';
  heading.textContent = title;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn-close';
  closeBtn.setAttribute('aria-label', 'Закрити');
  closeBtn.addEventListener('click', () => overlay.remove());

  header.appendChild(heading);
  header.appendChild(closeBtn);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control mb-3';
  input.placeholder = 'ID';

  const footer = document.createElement('div');
  footer.className = 'd-flex justify-content-end gap-2';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = 'Скасувати';
  cancelBtn.addEventListener('click', () => overlay.remove());

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'btn btn-primary';
  saveBtn.textContent = 'Зберегти';
  const confirm = (): void => {
    onConfirm(input.value.trim());
    overlay.remove();
  };
  saveBtn.addEventListener('click', confirm);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirm();
  });

  footer.appendChild(cancelBtn);
  footer.appendChild(saveBtn);

  dialog.appendChild(header);
  dialog.appendChild(input);
  dialog.appendChild(footer);

  document.body.appendChild(overlay);
  input.focus();
}

/** Просте інформаційне модальне вікно з єдиною кнопкою закриття. */
export function showInfoModal(message: string, buttonLabel = 'Зрозуміло!'): void {
  const { overlay, dialog } = createOverlay();

  const text = document.createElement('p');
  text.className = 'mb-4';
  text.textContent = message;

  const footer = document.createElement('div');
  footer.className = 'd-flex justify-content-end';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn btn-primary';
  closeBtn.textContent = buttonLabel;
  closeBtn.addEventListener('click', () => overlay.remove());

  footer.appendChild(closeBtn);
  dialog.appendChild(text);
  dialog.appendChild(footer);

  document.body.appendChild(overlay);
  closeBtn.focus();
}

/** Модальне вікно підтвердження (наприклад, перед видаленням). */
export function showConfirmModal(message: string, onConfirm: () => void): void {
  const { overlay, dialog } = createOverlay();

  const text = document.createElement('p');
  text.className = 'mb-4';
  text.textContent = message;

  const footer = document.createElement('div');
  footer.className = 'd-flex justify-content-end gap-2';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = 'Скасувати';
  cancelBtn.addEventListener('click', () => overlay.remove());

  const confirmBtn = document.createElement('button');
  confirmBtn.type = 'button';
  confirmBtn.className = 'btn btn-danger';
  confirmBtn.textContent = 'Видалити';
  confirmBtn.addEventListener('click', () => {
    onConfirm();
    overlay.remove();
  });

  footer.appendChild(cancelBtn);
  footer.appendChild(confirmBtn);

  dialog.appendChild(text);
  dialog.appendChild(footer);

  document.body.appendChild(overlay);
}

import { AppController } from '../../services/AppController';

interface FieldGroup {
  wrapper: HTMLDivElement;
  input: HTMLInputElement;
  showError(message: string): void;
  clearError(): void;
}

function createFieldGroup(placeholder: string): FieldGroup {
  const wrapper = document.createElement('div');
  wrapper.className = 'mb-2';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control';
  input.placeholder = placeholder;

  const error = document.createElement('div');
  error.className = 'text-danger small mt-1 d-none';

  wrapper.appendChild(input);
  wrapper.appendChild(error);

  return {
    wrapper,
    input,
    showError(message: string) {
      error.textContent = message;
      error.classList.remove('d-none');
      input.classList.add('is-invalid');
    },
    clearError() {
      error.textContent = '';
      error.classList.add('d-none');
      input.classList.remove('is-invalid');
    },
  };
}

/** Картка "Додати Книгу": назва, автор, рік видання + inline-валідація. */
export function renderBookForm(controller: AppController): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card shadow-sm mb-3';

  const body = document.createElement('div');
  body.className = 'card-body';

  const heading = document.createElement('h5');
  heading.className = 'card-title fw-bold';
  heading.textContent = 'Додати Книгу';
  body.appendChild(heading);

  const form = document.createElement('form');
  form.noValidate = true;

  const titleGroup = createFieldGroup('Назва книги');
  const authorGroup = createFieldGroup('Автор');
  const yearGroup = createFieldGroup('Рік видання');

  form.appendChild(titleGroup.wrapper);
  form.appendChild(authorGroup.wrapper);
  form.appendChild(yearGroup.wrapper);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-success';
  submitBtn.textContent = 'Додати Книгу';
  form.appendChild(submitBtn);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    [titleGroup, authorGroup, yearGroup].forEach((g) => g.clearError());

    const result = controller.addBook(
      titleGroup.input.value,
      authorGroup.input.value,
      yearGroup.input.value,
    );

    if (!result.success) {
      if (result.errors.title) titleGroup.showError(result.errors.title);
      if (result.errors.author) authorGroup.showError(result.errors.author);
      if (result.errors.year) yearGroup.showError(result.errors.year);
    }
  });

  body.appendChild(form);
  card.appendChild(body);
  return card;
}

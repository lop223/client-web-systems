import { AppController } from '../../services/AppController';

interface FieldGroup {
  wrapper: HTMLDivElement;
  input: HTMLInputElement;
  showError(message: string): void;
  clearError(): void;
}

function createFieldGroup(placeholder: string, type: string): FieldGroup {
  const wrapper = document.createElement('div');
  wrapper.className = 'mb-2';

  const input = document.createElement('input');
  input.type = type;
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

/** Картка "Додати Користувача": ім'я, email + inline-валідація. ID генерується автоматично. */
export function renderUserForm(controller: AppController): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card shadow-sm mb-3';

  const body = document.createElement('div');
  body.className = 'card-body';

  const heading = document.createElement('h5');
  heading.className = 'card-title fw-bold';
  heading.textContent = 'Додати Користувача';
  body.appendChild(heading);

  const form = document.createElement('form');
  form.noValidate = true;

  const nameGroup = createFieldGroup("Ім'я", 'text');
  const emailGroup = createFieldGroup('Email', 'email');

  form.appendChild(nameGroup.wrapper);
  form.appendChild(emailGroup.wrapper);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-success';
  submitBtn.textContent = 'Додати Користувача';
  form.appendChild(submitBtn);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    [nameGroup, emailGroup].forEach((g) => g.clearError());

    const result = controller.addUser(nameGroup.input.value, emailGroup.input.value);

    if (!result.success) {
      if (result.errors.name) nameGroup.showError(result.errors.name);
      if (result.errors.email) emailGroup.showError(result.errors.email);
    }
  });

  body.appendChild(form);
  card.appendChild(body);
  return card;
}

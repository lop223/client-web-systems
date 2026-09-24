import { AppController } from '../services/AppController';
import { renderBookForm } from './components/BookForm';
import { renderUserForm } from './components/UserForm';
import { renderBookList } from './components/BookList';
import { renderUserList } from './components/UserList';

/**
 * Єдина точка, що працює з DOM напряму (крім модалок): очищає #app і перемальовує
 * весь інтерфейс на основі поточного стану AppController. Викликається один раз при
 * старті, а потім — щоразу як controller.onUpdate спрацьовує після зміни стану.
 */
export function renderApp(controller: AppController): void {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('#app не знайдено в DOM');
  }
  app.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'bg-light py-4 min-vh-100';

  const container = document.createElement('div');
  container.className = 'container';
  container.style.maxWidth = '760px';

  const title = document.createElement('h2');
  title.className = 'text-center fw-bold mb-4';
  title.textContent = 'Система Управління Бібліотекою';
  container.appendChild(title);

  container.appendChild(renderBookForm(controller));
  container.appendChild(renderUserForm(controller));
  container.appendChild(renderBookList(controller));
  container.appendChild(renderUserList(controller));

  page.appendChild(container);
  app.appendChild(page);
}

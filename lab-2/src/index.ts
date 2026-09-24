import 'bootstrap/dist/css/bootstrap.min.css';
import { AppController } from './services/AppController';
import { renderApp } from './ui/render';

function bootstrap(): void {
  const controller = new AppController();
  controller.onUpdate = () => renderApp(controller);
  renderApp(controller);
}

document.addEventListener('DOMContentLoaded', bootstrap);

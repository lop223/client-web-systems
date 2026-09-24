export type NotificationType = 'success' | 'info' | 'warning' | 'danger';

/**
 * Легкі toast-сповіщення (замінюють window.alert, використання якого заборонено умовою).
 * Використовуються для другорядних подій (додано/видалено), тоді як важливі результати
 * позичання/повернення книги показуються через модальне вікно (див. Modal.ts) —
 * саме так це виглядає на прикладах дизайну.
 */
export class NotificationService {
  private static containerId = 'notification-container';

  private static getContainer(): HTMLElement {
    let container = document.getElementById(NotificationService.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = NotificationService.containerId;
      container.style.position = 'fixed';
      container.style.top = '1rem';
      container.style.right = '1rem';
      container.style.zIndex = '1080';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '0.5rem';
      container.style.maxWidth = '320px';
      document.body.appendChild(container);
    }
    return container;
  }

  static show(message: string, type: NotificationType = 'info', duration = 3500): void {
    const container = NotificationService.getContainer();

    const toast = document.createElement('div');
    toast.className = `alert alert-${type} shadow-sm mb-0`;
    toast.setAttribute('role', 'alert');
    toast.textContent = message;

    container.appendChild(toast);

    window.setTimeout(() => {
      toast.remove();
    }, duration);
  }
}

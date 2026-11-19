import type { Task } from '../types/task';

interface TaskDetailsProps {
  task: Task | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

const priorityLabels = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

const TaskDetails = ({ task, isLoading, error, onClose }: TaskDetailsProps) => {
  if (isLoading) {
    return (
      <section role="status" className="status-panel">
        Завантаження деталей завдання...
      </section>
    );
  }

  if (error) {
    return (
      <section role="alert" className="status-panel status-panel--error">
        Не вдалося завантажити завдання: {error}
      </section>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <section className="task-details">
      <div className="task-details__header">
        <div>
          <p className="task-details__label">Деталі завдання</p>
          <h2 className="task-details__title">{task.title}</h2>
        </div>

        <button type="button" onClick={onClose} className="task-details__close">
          Закрити
        </button>
      </div>

      <dl className="task-details__content">
        <div>
          <dt>Опис</dt>
          <dd>{task.description || 'Опис відсутній'}</dd>
        </div>

        <div>
          <dt>Категорія</dt>
          <dd>{task.category}</dd>
        </div>

        <div>
          <dt>Пріоритет</dt>
          <dd>{priorityLabels[task.priority]}</dd>
        </div>

        <div>
          <dt>Статус</dt>
          <dd>{task.completed ? 'Виконано' : 'У процесі'}</dd>
        </div>
      </dl>
    </section>
  );
};

export default TaskDetails;

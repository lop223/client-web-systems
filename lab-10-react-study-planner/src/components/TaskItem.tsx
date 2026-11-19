import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
}

const TaskItem = ({ task, onToggle, onDelete, onSelect }: TaskItemProps) => {
  const priorityLabels = {
    low: 'Низький',
    medium: 'Середній',
    high: 'Високий',
  };

  return (
    <div className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      <div className="task-item__main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Позначити ${task.title} як ${task.completed ? 'не виконане' : 'виконане'}`}
          className="task-item__checkbox"
        />

        <div className="task-item__content">
          <div className="task-item__meta">
            <button
              type="button"
              onClick={() => onSelect(task.id)}
              className={`task-item__title ${task.completed ? 'task-item__title--completed' : ''}`}
            >
              {task.title}
            </button>
            <span className="badge badge--category">{task.category}</span>
            <span className={`badge badge--${task.priority}`}>{priorityLabels[task.priority]}</span>
          </div>

          {task.description && (
            <p
              className={`task-item__description ${
                task.completed ? 'task-item__description--completed' : ''
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`task-item__button ${
            task.completed ? 'task-item__button--restore' : 'task-item__button--complete'
          }`}
        >
          {task.completed ? 'Повернути' : 'Виконано'}
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="task-item__button task-item__button--delete"
        >
          Видалити
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

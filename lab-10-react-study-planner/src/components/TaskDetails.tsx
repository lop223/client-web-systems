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
      <section
        role="status"
        className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600"
      >
        Завантаження деталей завдання...
      </section>
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700"
      >
        Не вдалося завантажити завдання: {error}
      </section>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50 p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Деталі завдання
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-800">{task.title}</h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-white hover:text-slate-800"
        >
          Закрити
        </button>
      </div>

      <dl className="space-y-2 text-sm text-slate-700">
        <div>
          <dt className="font-semibold">Опис</dt>
          <dd>{task.description || 'Опис відсутній'}</dd>
        </div>

        <div>
          <dt className="font-semibold">Категорія</dt>
          <dd>{task.category}</dd>
        </div>

        <div>
          <dt className="font-semibold">Пріоритет</dt>
          <dd>{priorityLabels[task.priority]}</dd>
        </div>

        <div>
          <dt className="font-semibold">Статус</dt>
          <dd>{task.completed ? 'Виконано' : 'У процесі'}</dd>
        </div>
      </dl>
    </section>
  );
};

export default TaskDetails;

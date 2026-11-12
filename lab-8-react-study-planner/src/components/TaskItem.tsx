import type { Task } from '../types/task';
import useTaskContext from '../hooks/useTaskContext';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { toggleTask, requestDelete, setEditingTask } = useTaskContext();
  const priorityStyles = {
    low: 'bg-slate-100 text-slate-700 border-slate-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const priorityLabels = {
    low: 'Низький',
    medium: 'Середній',
    high: 'Високий',
  };

  return (
    <div
      className={`group flex flex-col justify-between rounded-xl border p-4 transition-all sm:flex-row sm:items-center ${
        task.completed
          ? 'border-slate-200 bg-slate-50/70 text-slate-400'
          : 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          aria-label={`Позначити ${task.title} як ${task.completed ? 'не виконане' : 'виконане'}`}
          className="mt-1 h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-base font-semibold ${
                task.completed ? 'line-through text-slate-400' : 'text-slate-800'
              }`}
            >
              {task.title}
            </h3>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {task.category}
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-xs font-medium ${priorityStyles[task.priority]}`}
            >
              {priorityLabels[task.priority]}
            </span>
          </div>

          {task.description && (
            <p
              className={`mt-1 text-sm ${
                task.completed ? 'line-through text-slate-400' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 sm:mt-0 sm:border-t-0 sm:pt-0">
        <button
          type="button"
          onClick={() => toggleTask(task.id)}
          className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
            task.completed
              ? 'text-slate-600 hover:bg-slate-200'
              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
          }`}
        >
          {task.completed ? 'Повернути' : 'Виконано'}
        </button>

        <button
          type="button"
          onClick={() => setEditingTask(task)}
          className="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Редагувати
        </button>
        <button
          type="button"
          onClick={() => requestDelete(task.id)}
          aria-label={`Видалити ${task.title}`}
          className="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          Видалити
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

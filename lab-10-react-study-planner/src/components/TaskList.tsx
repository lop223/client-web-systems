import type { Task } from '../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Array<Task>;
  totalTasksCount: number;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList = ({ tasks, totalTasksCount, onToggleTask, onDeleteTask }: TaskListProps) => {
  if (totalTasksCount === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-white/50">
        <p className="text-base font-semibold text-slate-700">Завдань поки немає.</p>
        <p className="mt-1 text-sm text-slate-500">Додайте перше навчальне завдання вище.</p>
      </div>
    );
  }

  // Умова 2: За поточним фільтром результатів не знайдено
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 p-8 text-center bg-white shadow-xs">
        <p className="text-sm font-medium text-slate-600">За цим фільтром завдань немає.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} />
      ))}
    </div>
  );
};

export default TaskList;

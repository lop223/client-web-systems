import useTaskContext from '../hooks/useTaskContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const { tasks, filter } = useTaskContext();
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-white/50">
        <p className="text-base font-semibold text-slate-700">Завдань поки немає.</p>
        <p className="mt-1 text-sm text-slate-500">Додайте перше навчальне завдання вище.</p>
      </div>
    );
  }

  // Умова 2: За поточним фільтром результатів не знайдено
  if (filteredTasks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 p-8 text-center bg-white shadow-xs">
        <p className="text-sm font-medium text-slate-600">За цим фільтром завдань немає.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;

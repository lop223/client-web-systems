import type { Task } from '../types/task';

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats = ({ tasks }: TaskStatsProps) => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;

  return (
    <div className="grid grid-cols-3 gap-3 rounded-xl bg-white p-4 shadow-xs border border-slate-200">
      <div className="text-center">
        <span className="block text-2xl font-bold text-slate-800">{total}</span>
        <span className="text-xs font-medium text-slate-500">Всього</span>
      </div>
      <div className="text-center border-x border-slate-100">
        <span className="block text-2xl font-bold text-emerald-600">{completed}</span>
        <span className="text-xs font-medium text-slate-500">Виконано</span>
      </div>
      <div className="text-center">
        <span className="block text-2xl font-bold text-amber-600">{active}</span>
        <span className="text-xs font-medium text-slate-500">В процесі</span>
      </div>
    </div>
  );
};

export default TaskStats;

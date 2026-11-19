import type { Task } from '../types/task';

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats = ({ tasks }: TaskStatsProps) => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;

  return (
    <div className="stats">
      <div className="stats__item">
        <span className="stats__value">{total}</span>
        <span className="stats__label">Всього</span>
      </div>
      <div className="stats__item">
        <span className="stats__value stats__value--success">{completed}</span>
        <span className="stats__label">Виконано</span>
      </div>
      <div className="stats__item">
        <span className="stats__value stats__value--warning">{active}</span>
        <span className="stats__label">В процесі</span>
      </div>
    </div>
  );
};

export default TaskStats;

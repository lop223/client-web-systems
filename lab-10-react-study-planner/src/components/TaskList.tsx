import type { Task } from '../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Array<Task>;
  totalTasksCount: number;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onSelectTask: (id: number) => void;
}

const TaskList = ({
  tasks,
  totalTasksCount,
  onToggleTask,
  onDeleteTask,
  onSelectTask,
}: TaskListProps) => {
  if (totalTasksCount === 0) {
    return (
      <div className="task-list__empty">
        <p className="task-list__empty-title">Завдань поки немає.</p>
        <p className="task-list__empty-text">Додайте перше навчальне завдання вище.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p className="task-list__empty-text">За цим фільтром завдань немає.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
          onSelect={onSelectTask}
        />
      ))}
    </div>
  );
};

export default TaskList;

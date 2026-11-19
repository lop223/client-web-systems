import { useState } from 'react';
import { data } from './data/data';
import type { Task, TaskFilter } from './types/task';
import Header from './components/Header';
import TaskStats from './components/TaskStats';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';

export default function App() {
  const [tasks, setTasks] = useState<Array<Task>>(data);
  const [filter, setFilter] = useState<TaskFilter>('all');

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>): void => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now(),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: number): void => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleDeleteTask = (id: number): void => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-2xl space-y-6">
        <Header />

        <TaskStats tasks={tasks} />

        <TaskForm onAddTask={handleAddTask} />

        <TaskFilters currentFilter={filter} onFilterChange={setFilter} />

        <TaskList
          tasks={filteredTasks}
          totalTasksCount={tasks.length}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      </main>
    </div>
  );
}

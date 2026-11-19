import { useState } from 'react';
import type { Task, TaskFilter } from './types/task';
import Header from './components/Header';
import TaskStats from './components/TaskStats';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const { state, createTask, toggleTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>('all');

  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    await createTask(newTaskData);
  };

  const handleToggleTask = async (id: number) => {
    await toggleTask(id);
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
  };

  const filteredTasks = state.tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed;
    }

    if (filter === 'active') {
      return !task.completed;
    }

    return true;
  });

  const isInitialLoading = state.status === 'loading' && state.tasks.length === 0;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-2xl space-y-6">
        <Header />

        {state.error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            Не вдалося виконати операцію: {state.error}
          </div>
        )}

        {isInitialLoading && (
          <div
            role="status"
            className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600"
          >
            Завантаження завдань...
          </div>
        )}

        {!isInitialLoading && (
          <>
            <TaskStats tasks={state.tasks} />

            <TaskForm onAddTask={handleAddTask} />

            <TaskFilters currentFilter={filter} onFilterChange={setFilter} />

            <TaskList
              tasks={filteredTasks}
              totalTasksCount={state.total}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          </>
        )}
      </main>
    </div>
  );
}

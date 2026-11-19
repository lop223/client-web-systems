import { useState } from 'react';
import type { Task, TaskFilter } from './types/task';
import Header from './components/Header';
import TaskStats from './components/TaskStats';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskDetails from './components/TaskDetails';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const { state, createTask, toggleTask, deleteTask, getTaskById } = useTasks();

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'completed'>): Promise<boolean> => {
    const createdTask = await createTask(newTaskData);

    if (!createdTask) {
      return false;
    }

    setFeedbackMessage('Завдання успішно додано');
    return true;
  };

  const handleToggleTask = async (id: number) => {
    const updatedTask = await toggleTask(id);

    if (updatedTask) {
      setFeedbackMessage('Статус завдання оновлено');
    }
  };

  const handleDeleteTask = async (id: number) => {
    const isDeleted = await deleteTask(id);

    if (isDeleted) {
      setFeedbackMessage('Завдання успішно видалено');
    }
  };

  const handleSelectTask = async (id: number) => {
    setIsDetailsVisible(true);
    await getTaskById(id);
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

        {feedbackMessage && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {feedbackMessage}
          </div>
        )}

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
            {isDetailsVisible && (
              <TaskDetails
                task={state.selectedTask}
                isLoading={state.selectedTaskStatus === 'loading'}
                error={state.selectedTaskError}
                onClose={() => setIsDetailsVisible(false)}
              />
            )}

            <TaskStats tasks={state.tasks} />

            <TaskForm onAddTask={handleAddTask} />

            <TaskFilters currentFilter={filter} onFilterChange={setFilter} />

            <TaskList
              tasks={filteredTasks}
              totalTasksCount={state.total}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onSelectTask={handleSelectTask}
            />
          </>
        )}
      </main>
    </div>
  );
}

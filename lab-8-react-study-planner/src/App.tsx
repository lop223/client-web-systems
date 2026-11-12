import { TaskProvider } from './context/TaskContext';
import useTaskContext from './hooks/useTaskContext';
import Header from './components/Header';
import TaskStats from './components/TaskStats';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import Toast from './components/Toast';

export default function App() {
  return (
    <TaskProvider>
      <TaskPlanner />
    </TaskProvider>
  );
}

const TaskPlanner = () => {
  const { toasts, editingTask } = useTaskContext();

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-2xl space-y-6">
        <Header />
        <TaskStats />
        <TaskForm key={editingTask?.id ?? 'new'} />
        <TaskFilters />
        <TaskList />
      </main>
      <div
        className="fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};

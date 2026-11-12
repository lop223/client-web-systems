import type { Task, TaskFilter } from '../types/task';

export interface PendingDelete {
  task: Task;
  index: number;
}

export interface ToastMessage {
  id: number;
  type: 'success' | 'info';
  message: string;
  undoTaskId?: number;
}

export interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  pendingDeletes: PendingDelete[];
  toasts: ToastMessage[];
}

export type TaskAction =
  | { type: 'add'; task: Task; toast: ToastMessage }
  | { type: 'toggle'; id: number }
  | { type: 'update'; task: Task; toast: ToastMessage }
  | { type: 'requestDelete'; id: number; toast: ToastMessage }
  | { type: 'confirmDelete'; id: number }
  | { type: 'undoDelete'; id: number; toast: ToastMessage }
  | { type: 'clearCompleted'; toast: ToastMessage }
  | { type: 'reset'; tasks: Task[]; toast: ToastMessage }
  | { type: 'setFilter'; filter: TaskFilter }
  | { type: 'dismissToast'; id: number };

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        tasks: [action.task, ...state.tasks],
        toasts: [...state.toasts, action.toast],
      };
    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'update':
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.task.id ? action.task : task)),
        toasts: [...state.toasts, action.toast],
      };
    case 'requestDelete': {
      const index = state.tasks.findIndex((task) => task.id === action.id);
      if (index === -1) return state;

      const task = state.tasks[index];
      if (!task) return state;

      return {
        ...state,
        tasks: state.tasks.filter((item) => item.id !== action.id),
        pendingDeletes: [...state.pendingDeletes, { task, index }],
        toasts: [...state.toasts, action.toast],
      };
    }
    case 'confirmDelete':
      return {
        ...state,
        pendingDeletes: state.pendingDeletes.filter((item) => item.task.id !== action.id),
        toasts: state.toasts.filter((toast) => toast.undoTaskId !== action.id),
      };
    case 'undoDelete': {
      const pending = state.pendingDeletes.find((item) => item.task.id === action.id);
      if (!pending) return state;

      const tasks = [...state.tasks];
      tasks.splice(Math.min(pending.index, tasks.length), 0, pending.task);

      return {
        ...state,
        tasks,
        pendingDeletes: state.pendingDeletes.filter((item) => item.task.id !== action.id),
        toasts: [...state.toasts.filter((toast) => toast.undoTaskId !== action.id), action.toast],
      };
    }
    case 'clearCompleted': {
      const tasks = state.tasks.filter((task) => !task.completed);
      if (tasks.length === state.tasks.length) return state;

      return {
        ...state,
        tasks,
        toasts: [...state.toasts, action.toast],
      };
    }
    case 'reset':
      return {
        tasks: action.tasks,
        filter: 'all',
        pendingDeletes: [],
        toasts: [action.toast],
      };
    case 'setFilter':
      return { ...state, filter: action.filter };
    case 'dismissToast':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.id),
      };
    default:
      return state;
  }
};

export default taskReducer;

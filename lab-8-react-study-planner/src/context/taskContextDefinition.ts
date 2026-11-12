import { createContext } from 'react';
import type { TaskState } from '../reducers/taskReducer';
import type { Task, TaskFilter } from '../types/task';

export type NewTask = Omit<Task, 'id' | 'completed'>;

export interface TaskContextValue extends TaskState {
  addTask: (task: NewTask) => void;
  updateTask: (task: Task) => void;
  toggleTask: (id: number) => void;
  requestDelete: (id: number) => void;
  undoDelete: (id: number) => void;
  clearCompleted: () => void;
  resetTasks: () => void;
  setFilter: (filter: TaskFilter) => void;
  dismissToast: (id: number) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
}

export const TaskContext = createContext<TaskContextValue | null>(null);

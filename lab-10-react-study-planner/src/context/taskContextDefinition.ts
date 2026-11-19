import { createContext } from 'react';
import type { Task, TaskInput, TaskUpdate } from '../types/task';

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface TaskState {
  tasks: Task[];
  total: number;
  skip: number;
  limit: number;
  status: RequestStatus;
  error: string | null;
  selectedTask: Task | null;
  selectedTaskStatus: RequestStatus;
  selectedTaskError: string | null;
}

export interface TaskContextValue {
  state: TaskState;
  loadTasks: (options?: { limit?: number; skip?: number }) => Promise<void>;
  getTaskById: (id: number) => Promise<Task | null>;
  createTask: (task: TaskInput) => Promise<Task | null>;
  updateTask: (id: number, task: TaskUpdate) => Promise<Task | null>;
  deleteTask: (id: number) => Promise<boolean>;
  toggleTask: (id: number) => Promise<Task | null>;
}

export const TaskContext = createContext<TaskContextValue | null>(null);

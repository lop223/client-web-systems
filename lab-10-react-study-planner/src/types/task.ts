export type Priority = 'low' | 'medium' | 'high';

export type TaskFilter = 'all' | 'completed' | 'active';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
}

export type TaskInput = Omit<Task, 'id' | 'completed'>;

export type TaskUpdate = Partial<
  Pick<Task, 'title' | 'description' | 'completed' | 'priority' | 'category'>
>;

export interface TaskPage {
  tasks: Task[];
  total: number;
  skip: number;
  limit: number;
}

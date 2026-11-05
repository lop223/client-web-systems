export type priority = 'low' | 'medium' | 'high';

export type TaskFilter = 'all' | 'completed' | 'active';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: priority;
  category: string;
}

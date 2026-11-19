import { httpClient } from '../api/httpClient';
import type { ApiTodo, TodosResponse } from '../types/api';
import type { Task, TaskInput, TaskUpdate, TaskPage } from '../types/task';

const DEFAULT_USER_ID = 1;

const toTask = (todo: ApiTodo, metadata?: Partial<TaskInput>): Task => ({
  id: todo.id,
  title: todo.todo,
  description: metadata?.description ?? '',
  completed: todo.completed,
  priority: metadata?.priority ?? 'medium',
  category: metadata?.category ?? 'General',
});

const toApiPayload = (task: TaskInput | TaskUpdate): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};

  if (task.title !== undefined) {
    payload.todo = task.title;
  }

  if ('completed' in task && task.completed !== undefined) {
    payload.completed = task.completed;
  }

  if (Object.keys(payload).length === 0) {
    throw new Error('Task update payload cannot be empty');
  }

  return payload;
};

export interface TaskRepository {
  getAll(options?: { limit?: number; skip?: number; signal?: AbortSignal }): Promise<TaskPage>;

  getById(id: number, signal?: AbortSignal): Promise<Task>;

  create(task: TaskInput, signal?: AbortSignal): Promise<Task>;

  update(id: number, task: TaskUpdate, signal?: AbortSignal): Promise<Task>;

  delete(id: number, signal?: AbortSignal): Promise<void>;
}

export const taskRepository: TaskRepository = {
  async getAll({ limit = 10, skip = 0, signal } = {}): Promise<TaskPage> {
    const params = new URLSearchParams({
      limit: String(limit),
      skip: String(skip),
    });

    const response = await httpClient.get<TodosResponse>(`/todos?${params.toString()}`, {
      signal,
    });

    return {
      tasks: response.todos.map((todo) => toTask(todo)),
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    };
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const response = await httpClient.get<ApiTodo>(`/todos/${id}`, {
      signal,
    });

    return toTask(response);
  },

  async create(task: TaskInput, signal?: AbortSignal): Promise<Task> {
    const response = await httpClient.post<ApiTodo>(
      '/todos/add',
      {
        todo: task.title,
        completed: false,
        userId: DEFAULT_USER_ID,
      },
      {
        signal,
      }
    );

    return toTask(response, task);
  },

  async update(id: number, task: TaskUpdate, signal?: AbortSignal): Promise<Task> {
    const response = await httpClient.put<ApiTodo>(`/todos/${id}`, toApiPayload(task), {
      signal,
    });

    return toTask(response, task);
  },

  async delete(id: number, signal?: AbortSignal): Promise<void> {
    await httpClient.delete<ApiTodo>(`/todos/${id}`, {
      signal,
    });
  },
};

export { toApiPayload, toTask };

import { afterEach, describe, expect, it, vi } from 'vitest';
import { httpClient } from '../api/httpClient';
import { taskRepository } from '../repositories/TaskRepository';
import type { ApiTodo, TodosResponse } from '../types/api';

describe('taskRepository', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('завантажує сторінку завдань і перетворює API-моделі на Task', async () => {
    const response: TodosResponse = {
      todos: [{ id: 7, todo: 'Read React docs', completed: false, userId: 1 }],
      total: 25,
      skip: 5,
      limit: 10,
    };

    vi.spyOn(httpClient, 'get').mockResolvedValue(response as never);

    await expect(taskRepository.getAll({ limit: 10, skip: 5 })).resolves.toEqual({
      tasks: [
        {
          id: 7,
          title: 'Read React docs',
          description: '',
          completed: false,
          priority: 'medium',
          category: 'General',
        },
      ],
      total: 25,
      skip: 5,
      limit: 10,
    });

    expect(httpClient.get).toHaveBeenCalledWith('/todos?limit=10&skip=5', {
      signal: undefined,
    });
  });

  it('передає дані для створення та зберігає client-only поля в результаті', async () => {
    const response: ApiTodo = {
      id: 101,
      todo: 'Build planner',
      completed: false,
      userId: 1,
    };

    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(response as never);

    await expect(
      taskRepository.create({
        title: 'Build planner',
        description: 'Finish the app',
        priority: 'high',
        category: 'React',
      })
    ).resolves.toEqual({
      id: 101,
      title: 'Build planner',
      description: 'Finish the app',
      completed: false,
      priority: 'high',
      category: 'React',
    });

    expect(postSpy).toHaveBeenCalledWith(
      '/todos/add',
      { todo: 'Build planner', completed: false, userId: 1 },
      { signal: undefined }
    );
  });

  it('передає completed під час оновлення та викликає DELETE', async () => {
    const updated: ApiTodo = {
      id: 7,
      todo: 'Read React docs',
      completed: true,
      userId: 1,
    };

    const putSpy = vi.spyOn(httpClient, 'put').mockResolvedValue(updated as never);
    const deleteSpy = vi.spyOn(httpClient, 'delete').mockResolvedValue(undefined as never);

    await taskRepository.update(7, { title: 'Read React docs', completed: true });
    await taskRepository.delete(7);

    expect(putSpy).toHaveBeenCalledWith(
      '/todos/7',
      { todo: 'Read React docs', completed: true },
      { signal: undefined }
    );
    expect(deleteSpy).toHaveBeenCalledWith('/todos/7', { signal: undefined });
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types/task';

vi.mock('../hooks/useTasks', () => ({
  useTasks: vi.fn(),
}));

const task: Task = {
  id: 1,
  title: 'React Components',
  description: 'Study components',
  completed: false,
  priority: 'high',
  category: 'React',
};

const createTasksApi = (): ReturnType<typeof useTasks> => ({
  state: {
    tasks: [task],
    total: 1,
    skip: 0,
    limit: 10,
    status: 'success',
    error: null,
    selectedTask: null,
    selectedTaskStatus: 'idle',
    selectedTaskError: null,
  },
  loadTasks: vi.fn(async () => {}),
  getTaskById: vi.fn(async () => task),
  createTask: vi.fn(async () => task),
  updateTask: vi.fn(async () => task),
  deleteTask: vi.fn(async () => true),
  toggleTask: vi.fn(async () => task),
});

describe('Study Planner', () => {
  let tasksApi: ReturnType<typeof createTasksApi>;

  beforeEach(() => {
    tasksApi = createTasksApi();
    vi.mocked(useTasks).mockReturnValue(tasksApi);
  });

  it('показує заголовок і завантажені завдання', () => {
    render(<App />);

    expect(screen.getByText('Study Planner')).toBeInTheDocument();
    expect(screen.getByText('React Components')).toBeInTheDocument();
  });

  it('фільтрує список виконаних завдань', () => {
    tasksApi.state.tasks = [task, { ...task, id: 2, title: 'TypeScript', completed: true }];

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Виконані' }));

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.queryByText('React Components')).not.toBeInTheDocument();
  });

  it('викликає API-метод для зміни статусу завдання', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Виконано' }));

    expect(tasksApi.toggleTask).toHaveBeenCalledWith(task.id);
  });

  it('завантажує деталі після вибору завдання', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'React Components' }));

    expect(tasksApi.getTaskById).toHaveBeenCalledWith(task.id);
  });

  it('показує стан початкового завантаження', () => {
    tasksApi.state.tasks = [];
    tasksApi.state.total = 0;
    tasksApi.state.status = 'loading';

    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Завантаження завдань...');
  });
});

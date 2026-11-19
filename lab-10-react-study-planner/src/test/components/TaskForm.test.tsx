import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TaskForm from '../../components/TaskForm';

describe('TaskForm', () => {
  it('не надсилає форму з порожньою назвою', async () => {
    const onAddTask = vi.fn().mockResolvedValue(true);

    render(<TaskForm onAddTask={onAddTask} />);
    fireEvent.click(screen.getByRole('button', { name: /додати завдання/i }));

    expect(await screen.findByText('Назва не може бути порожньою!')).toBeInTheDocument();
    expect(onAddTask).not.toHaveBeenCalled();
  });

  it('надсилає завдання та очищує форму після успіху', async () => {
    const onAddTask = vi.fn().mockResolvedValue(true);

    render(<TaskForm onAddTask={onAddTask} />);

    fireEvent.change(screen.getByPlaceholderText('Наприклад: Вивчити хук useState'), {
      target: { value: '  Вивчити React  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /додати завдання/i }));

    await waitFor(() => {
      expect(onAddTask).toHaveBeenCalledWith({
        title: 'Вивчити React',
        description: '',
        category: 'General',
        priority: 'low',
      });
    });

    expect(screen.getByPlaceholderText('Наприклад: Вивчити хук useState')).toHaveValue('');
  });

  it('не очищує поля, якщо створення не вдалося', async () => {
    const onAddTask = vi.fn().mockResolvedValue(false);

    render(<TaskForm onAddTask={onAddTask} />);

    const titleInput = screen.getByPlaceholderText('Наприклад: Вивчити хук useState');
    fireEvent.change(titleInput, { target: { value: 'Моє завдання' } });
    fireEvent.click(screen.getByRole('button', { name: /додати завдання/i }));

    await waitFor(() => expect(onAddTask).toHaveBeenCalled());
    expect(titleInput).toHaveValue('Моє завдання');
  });
});

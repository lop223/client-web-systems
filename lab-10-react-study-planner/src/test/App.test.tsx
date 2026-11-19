import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Study Planner (App)', () => {
  it('рендерить заголовок та початковий список завдань', () => {
    render(<App />);
    expect(screen.getByText('Study Planner')).toBeInTheDocument();
    expect(screen.getByText('React Components')).toBeInTheDocument();
  });

  it('дозволяє додати нове завдання у список', () => {
    render(<App />);

    const input = screen.getByPlaceholderText('Наприклад: Вивчити хук useState');
    const submitButton = screen.getByRole('button', { name: /додати завдання/i });

    fireEvent.change(input, { target: { value: 'Нове тестове завдання' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Нове тестове завдання')).toBeInTheDocument();
  });

  it('показує помилку валідації, якщо поле назви порожнє', () => {
    render(<App />);

    const submitButton = screen.getByRole('button', { name: /додати завдання/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Назва не може бути порожньою!')).toBeInTheDocument();
  });

  it('коректно перемикає фільтри завдань', () => {
    render(<App />);

    const completedFilterBtn = screen.getByRole('button', { name: 'Виконані' });
    fireEvent.click(completedFilterBtn);

    expect(screen.queryByText('React Components')).not.toBeInTheDocument();
    expect(screen.getByText('TypeScript Exercises')).toBeInTheDocument();
  });

  it('дозволяє видалити завдання зі списку', () => {
    render(<App />);

    const taskTitle = screen.getByText('Tailwind CSS Layout');
    expect(taskTitle).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: /видалити/i });
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText('Всього')).toBeInTheDocument();
  });
});

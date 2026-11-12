import { act, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import App from '../App';

describe('Study Planner (App)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

    fireEvent.click(screen.getByRole('button', { name: 'Видалити Tailwind CSS Layout' }));

    expect(screen.queryByText('Tailwind CSS Layout')).not.toBeInTheDocument();
    expect(screen.getByText('React Components')).toBeInTheDocument();
    expect(screen.getByText('Всього')).toBeInTheDocument();
  });

  it('дозволяє скасувати видалення протягом п’яти секунд', () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Видалити Tailwind CSS Layout' }));
    expect(screen.queryByText('Tailwind CSS Layout')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));

    expect(screen.getByText('Tailwind CSS Layout')).toBeInTheDocument();
  });

  it('підтверджує видалення після завершення п’яти секунд', () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Видалити Tailwind CSS Layout' }));
    act(() => vi.advanceTimersByTime(5000));

    expect(screen.queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('study-planner-tasks') ?? '[]')).toHaveLength(2);
  });

  it('зберігає зміни списку в localStorage', () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Позначити React Components як виконане' })
    );

    const storedTasks = JSON.parse(window.localStorage.getItem('study-planner-tasks') ?? '[]');
    expect(storedTasks[0].completed).toBe(true);
  });

  it('дозволяє редагувати завдання та показує сповіщення', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Редагувати' })[0]!);
    fireEvent.change(screen.getByPlaceholderText('Наприклад: Вивчити хук useState'), {
      target: { value: 'Оновлене завдання' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));

    expect(screen.getByText('Оновлене завдання')).toBeInTheDocument();
    expect(screen.getByText('Завдання оновлено')).toBeInTheDocument();
  });
});

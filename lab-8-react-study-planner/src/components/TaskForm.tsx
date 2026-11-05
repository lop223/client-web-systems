import { useState, type FormEvent } from 'react';
import type { Task, Priority } from '../types/task';

interface TaskFormProps {
  onAddTask: (newTask: Omit<Task, 'id' | 'completed'>) => void;
}

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('low');
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Назва не може бути порожньою!');
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'General',
      priority,
    });

    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
    setErrorMessage('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
    >
      <h2 className="mb-4 text-lg font-bold text-slate-800">Додати нове завдання</h2>

      {errorMessage && (
        <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-600 border border-rose-200">
          {errorMessage}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Назва <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Наприклад: Вивчити хук useState"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Опис
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Короткий опис або деталі завдання..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Категорія
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="React, Англійська, Бази даних..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Пріоритет
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="low">Низький (Low)</option>
              <option value="medium">Середній (Medium)</option>
              <option value="high">Високий (High)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-colors"
      >
        Додати завдання
      </button>
    </form>
  );
};

export default TaskForm;

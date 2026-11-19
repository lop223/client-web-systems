import { useState, type FormEvent } from 'react';
import type { Task, Priority } from '../types/task';

interface TaskFormProps {
  onAddTask: (newTask: Omit<Task, 'id' | 'completed'>) => Promise<boolean>;
}

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('low');
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Назва не може бути порожньою!');
      return;
    }

    const isCreated = await onAddTask({
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'General',
      priority,
    });

    if (!isCreated) {
      return;
    }

    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
    setErrorMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2 className="task-form__title">Додати нове завдання</h2>

      {errorMessage && <div className="form-error">{errorMessage}</div>}

      <div className="task-form__fields">
        <div className="field">
          <label className="field__label">
            Назва <span className="field__required">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Наприклад: Вивчити хук useState"
            className="field__input"
          />
        </div>

        <div className="field">
          <label className="field__label">Опис</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Короткий опис або деталі завдання..."
            className="field__textarea"
          />
        </div>

        <div className="task-form__row">
          <div className="field">
            <label className="field__label">Категорія</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="React, Англійська, Бази даних..."
              className="field__input"
            />
          </div>

          <div className="field">
            <label className="field__label">Пріоритет</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="field__select"
            >
              <option value="low">Низький (Low)</option>
              <option value="medium">Середній (Medium)</option>
              <option value="high">Високий (High)</option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit" className="task-form__submit">
        Додати завдання
      </button>
    </form>
  );
};

export default TaskForm;

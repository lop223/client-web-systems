import type { Task } from '../types/task';

export const data: Array<Task> = [
  {
    id: 1,
    title: 'React Components',
    description: 'Опрацювати базові принципи компонентів React',
    completed: false,
    priority: 'high',
    category: 'React',
  },
  {
    id: 2,
    title: 'TypeScript Exercises',
    description: 'Виконати практичні вправи',
    completed: true,
    priority: 'medium',
    category: 'TypeScript',
  },
  {
    id: 3,
    title: 'Tailwind CSS Layout',
    description: 'Стилізувати картки завдань та форму додавання',
    completed: false,
    priority: 'low',
    category: 'CSS',
  },
];

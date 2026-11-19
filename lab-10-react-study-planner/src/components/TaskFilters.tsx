import type { TaskFilter } from '../types/task';

interface TaskFiltersProps {
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

const TaskFilters = ({ currentFilter, onFilterChange }: TaskFiltersProps) => {
  const filterButtons: { label: string; value: TaskFilter }[] = [
    { label: 'Всі', value: 'all' },
    { label: 'Виконані', value: 'completed' },
    { label: 'Не виконані', value: 'active' },
  ];

  return (
    <div className="filters">
      {filterButtons.map(({ label, value }) => {
        const isActive = currentFilter === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value)}
            className={`filters__button ${isActive ? 'filters__button--active' : ''}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default TaskFilters;

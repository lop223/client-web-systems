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
    <div className="flex items-center justify-center gap-2 p-1 bg-slate-200/70 rounded-lg w-fit mx-auto">
      {filterButtons.map(({ label, value }) => {
        const isActive = currentFilter === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value)}
            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? 'bg-white text-blue-600 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default TaskFilters;

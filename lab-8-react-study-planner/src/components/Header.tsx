import useTaskContext from '../hooks/useTaskContext';

const Header = () => {
  const { theme, toggleTheme } = useTaskContext();
  const isDark = theme === 'dark';

  return (
    <header className="mb-8 text-center">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggleTheme}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            isDark
              ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          {isDark ? 'Світла тема' : 'Темна тема'}
        </button>
      </div>
      <div className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
        Навчальний трекер
      </div>
      <h1
        className={`mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          isDark ? 'text-slate-100' : 'text-slate-800'
        }`}
      >
        Study Planner
      </h1>
      <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
        Керуйте навчальними завданнями, дедлайнами та пріоритетами
      </p>
    </header>
  );
};

export default Header;

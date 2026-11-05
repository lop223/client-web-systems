const Header = () => {
  return (
    <header className="mb-8 text-center">
      <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
        Навчальний трекер
      </div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
        Study Planner
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Керуйте навчальними завданнями, дедлайнами та пріоритетами
      </p>
    </header>
  );
};

export default Header;

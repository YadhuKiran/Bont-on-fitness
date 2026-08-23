type TopbarProps = {
  onMenu?: () => void;
};

export function Topbar({ onMenu }: TopbarProps) {
  return (
    <header className="flex h-16 items-center gap-3 border-b border-slate-200 bg-[var(--surface)] px-4 md:px-6">
      <button
        type="button"
        className="rounded-md border border-slate-200 px-2 py-1 text-sm md:hidden"
        onClick={onMenu}
        aria-label="Open menu"
      >
        Menu
      </button>

      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-[var(--accent)] text-xs font-black text-[var(--accent-2)]">
          BT
        </div>
        <span className="hidden text-sm font-bold tracking-wide text-[var(--text)] sm:inline">Bon Ton</span>
      </div>

      <div className="mx-auto hidden w-full max-w-sm items-center md:flex">
        <label className="sr-only" htmlFor="topbar-search">
          Search
        </label>
        <input
          id="topbar-search"
          type="search"
          placeholder="Search members, plans, workouts"
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-lime-100"
        />
      </div>

      <button type="button" className="ml-auto rounded-md p-2 text-[var(--muted)] md:hidden" aria-label="Search">
        <span aria-hidden="true">Search</span>
      </button>

      <button type="button" className="rounded-md p-2 text-[var(--muted)]" aria-label="Notifications">
        <span aria-hidden="true">Bell</span>
      </button>

      <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white" aria-label="User avatar">
        VF
      </div>
    </header>
  );
}

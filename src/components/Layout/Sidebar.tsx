import { ReactNode } from "react";

type SidebarProps = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ children, open, onClose }: SidebarProps) {
  return (
    <>
      <aside
        className="app-shell__sidebar flex min-h-screen flex-col border-r border-slate-800 bg-slate-950 p-4 text-white"
        data-open={open}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-black tracking-wide">BON TON</p>
            <p className="text-xs text-slate-400">Fitness Club</p>
          </div>
          <button type="button" className="rounded-md p-2 text-slate-300 md:hidden" onClick={onClose} aria-label="Close menu">
            Close
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2">{children}</nav>

        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900 p-3">
          <p className="text-xs font-semibold text-slate-300">Club</p>
          <p className="mt-1 text-sm font-bold">HMT Layout</p>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/50 md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      ) : null}
    </>
  );
}

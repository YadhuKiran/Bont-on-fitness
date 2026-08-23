import { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <section className={`rounded-lg bg-surface p-5 shadow-sm ring-1 ring-slate-200 ${className}`}>
      {title ? <h2 className="mb-3 text-lg font-bold text-[var(--text)]">{title}</h2> : null}
      <div className="text-sm text-[var(--muted)]">{children}</div>
    </section>
  );
}

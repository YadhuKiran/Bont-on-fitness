import { useState } from "react";
import { Sidebar } from "../Layout/Sidebar";
import { Topbar } from "../Layout/Topbar";
import { Card } from "../ui/Card";

const navItems = ["Overview", "Workouts", "Attendance", "Progress"];

export function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        {navItems.map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-md px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            {item}
          </button>
        ))}
      </Sidebar>

      <main className="app-shell__main">
        <Topbar onMenu={() => setSidebarOpen(true)} />

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-8">
          <div>
            <p className="text-sm font-semibold text-[var(--accent-2)]">Member dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-[var(--text)]">Welcome back</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card title="This month">
              <p className="text-3xl font-black text-[var(--text)]">12 visits</p>
              <p className="mt-2">You are building a steady training rhythm.</p>
            </Card>

            <Card title="Next workout">
              <p className="text-lg font-bold text-[var(--text)]">Upper body strength</p>
              <p className="mt-2">Bench press, rows, shoulder work, and conditioning.</p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Sidebar } from "../Layout/Sidebar";
import { Topbar } from "../Layout/Topbar";
import { Card } from "../ui/Card";
import supabase, { getUser } from "../../lib/supabase";

type Profile = {
  id: string;
  full_name?: string;
  membership_expires?: string;
  current_weight?: number;
  goal?: string;
};

export function MemberDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attendanceCount, setAttendanceCount] = useState<number | null>(null);
  const [streak, setStreak] = useState<number | null>(null);
  const [lastSession, setLastSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const sessionRes: any = await getUser();
        const user = sessionRes?.data?.session?.user;
        if (!user) throw new Error("Not authenticated");
        const userId = user.id as string;

        // Fetch profile
        const { data: prof } = await supabase.from("profiles").select("id,full_name,membership_expires,current_weight,goal").eq("id", userId).maybeSingle();
        setProfile(prof || null);

        // Attendance this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
        const { data: monthAttendance } = await supabase
          .from("attendance")
          .select("check_in")
          .eq("member_id", userId)
          .gte("check_in", startOfMonth)
          .lt("check_in", startOfNextMonth);
        setAttendanceCount((monthAttendance as any[] | null)?.length ?? 0);

        // Last session
        const { data: last } = await supabase
          .from("attendance")
          .select("check_in,check_out,duration_minutes,branch_id")
          .eq("member_id", userId)
          .order("check_in", { ascending: false })
          .limit(1)
          .maybeSingle();
        setLastSession(last || null);

        // Streak: look back 14 days
        const lookback = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
        const { data: recent } = await supabase
          .from("attendance")
          .select("check_in")
          .eq("member_id", userId)
          .gte("check_in", lookback)
          .order("check_in", { ascending: false });
        const dates = new Set((recent as any[] | []).map((r) => new Date(r.check_in).toDateString()));
        let s = 0;
        for (let i = 0; i < 30; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          if (dates.has(d.toDateString())) s++; else break;
        }
        setStreak(s);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <button className="rounded-md px-3 py-2 text-left text-sm font-medium text-slate-300">Overview</button>
        <button className="rounded-md px-3 py-2 text-left text-sm font-medium text-slate-300">Attendance</button>
        <button className="rounded-md px-3 py-2 text-left text-sm font-medium text-slate-300">Workouts</button>
      </Sidebar>

      <main className="app-shell__main">
        <Topbar onMenu={() => setSidebarOpen(true)} />

        <section className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
          <div className="mb-4">
            <p className="text-sm font-semibold text-[var(--accent-2)]">Member dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-[var(--text)]">{profile?.full_name ?? "Member"}</h1>
          </div>

          {loading ? (
            <p>Loading…</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <Card title="This month">
                <div className="text-3xl font-black text-[var(--text)]">{attendanceCount ?? 0}</div>
                <div className="mt-2 text-sm">visits</div>
              </Card>

              <Card title="Current streak">
                <div className="text-3xl font-black text-[var(--text)]">{streak ?? 0}</div>
                <div className="mt-2 text-sm">consecutive days</div>
              </Card>

              <Card title="Last session">
                {lastSession ? (
                  <div>
                    <div className="font-semibold">{new Date(lastSession.check_in).toLocaleString()}</div>
                    <div className="mt-1 text-sm">{lastSession.duration_minutes ? `${lastSession.duration_minutes} min` : lastSession.check_out ? "Completed" : "In progress"}</div>
                  </div>
                ) : (
                  <div>No sessions yet</div>
                )}
              </Card>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Role = "member" | "trainer" | "staff" | "manager" | "admin";
type Page = "Overview" | "Attendance" | "Workouts" | "Progress" | "Members" | "Branches" | "Check-ins" | "Equipment" | "Plans" | "Profile";
type IconName = "arrow" | "bell" | "calendar" | "check" | "chevron" | "clock" | "dumbbell" | "grid" | "logout" | "map" | "menu" | "play" | "search" | "settings" | "shield" | "trend" | "user-plus" | "users" | "activity" | "x";

type Session = { name: string; role: Role; branch: string };

type IconProps = { name: IconName; size?: number; stroke?: number };

function Icon({ name, size = 18, stroke = 1.8 }: IconProps) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    calendar: <><rect x="3" y="4.5" width="18" height="17" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9.5h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 6 6 6-6 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    dumbbell: <><path d="M6 8v8M3.5 10v4M18 8v8M20.5 10v4M6 12h12" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    logout: <><path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M14 16l4-4-4-4M18 12H8" /></>,
    map: <><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    play: <path d="m9 6 9 6-9 6V6Z" />,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.5h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1h2.5V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.5h-.1a1.7 1.7 0 0 0-1.5 1.5Z" /></>,
    shield: <><path d="M12 21s8-3.6 8-10V5l-8-3-8 3v6c0 6.4 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    trend: <><path d="m4 16 5-5 4 3 7-8" /><path d="M15 6h5v5" /></>,
    "user-plus": <><circle cx="9" cy="8" r="3" /><path d="M3.5 20c.3-3.4 2.2-5 5.5-5s5.2 1.6 5.5 5M18 8v6M15 11h6" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20c.3-3.4 2.2-5 5.5-5s5.2 1.6 5.5 5M16 11a3 3 0 1 0 0-6M16 15c2.8.2 4.2 1.8 4.5 4" /></>,
    activity: <><path d="M3 12h4l2-7 4 14 2-7h6" /></>,
    x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const roleLabels: Record<Role, string> = { member: "Member", trainer: "Trainer", staff: "Branch staff", manager: "Branch manager", admin: "Super admin" };
const branches = [
  { name: "HMT Layout", area: "Bengaluru North", members: 238, checkedIn: 76, phone: "7022888883", accent: "lime" },
  { name: "Anjana Nagar", area: "Bengaluru West", members: 194, checkedIn: 61, phone: "9902445444", accent: "peach" },
  { name: "Laggere", area: "Bengaluru North", members: 167, checkedIn: 53, phone: "7353188199", accent: "ink" },
  { name: "Chikka Gollarahatti", area: "Bengaluru West", members: 143, checkedIn: 48, phone: "9740199177", accent: "blue" },
  { name: "Nelamangala", area: "Bengaluru Rural", members: 119, checkedIn: 39, phone: "9949994712", accent: "orange" },
];
const navByRole: Record<Role, { label: Page; icon: IconName }[]> = {
  member: [{ label: "Overview", icon: "grid" }, { label: "Attendance", icon: "calendar" }, { label: "Workouts", icon: "dumbbell" }, { label: "Progress", icon: "trend" }],
  trainer: [{ label: "Overview", icon: "grid" }, { label: "Members", icon: "users" }, { label: "Plans", icon: "calendar" }, { label: "Progress", icon: "trend" }],
  staff: [{ label: "Overview", icon: "grid" }, { label: "Check-ins", icon: "activity" }, { label: "Members", icon: "users" }, { label: "Attendance", icon: "calendar" }],
  manager: [{ label: "Overview", icon: "grid" }, { label: "Branches", icon: "map" }, { label: "Members", icon: "users" }, { label: "Equipment", icon: "dumbbell" }],
  admin: [{ label: "Overview", icon: "grid" }, { label: "Branches", icon: "map" }, { label: "Members", icon: "users" }, { label: "Equipment", icon: "dumbbell" }],
};
const workoutExercises = [
  { name: "Barbell bench press", sets: "4 sets · 8 reps", muscle: "Chest" },
  { name: "Incline dumbbell press", sets: "3 sets · 10 reps", muscle: "Chest" },
  { name: "Cable tricep pushdown", sets: "3 sets · 12 reps", muscle: "Triceps" },
  { name: "Dumbbell lateral raise", sets: "3 sets · 15 reps", muscle: "Shoulders" },
];
const attendanceDays = [1, 2, 5, 6, 8, 9, 12, 15, 16, 19, 21, 22, 23];

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [activePage, setActivePage] = useState<Page>("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let mounted = true;
    const loadSession = async () => {
      const { data } = await client.auth.getSession();
      if (mounted && data.session) setSession(await resolveSession(data.session));
      if (mounted) setAuthLoading(false);
    };
    loadSession();
    const { data: listener } = client.auth.onAuthStateChange((_event, authSession) => {
      if (!mounted) return;
      if (!authSession) {
        setSession(null);
        setAuthLoading(false);
        return;
      }
      resolveSession(authSession).then((value) => { if (mounted) { setSession(value); setAuthLoading(false); } });
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };
  const navigate = (page: Page) => { setActivePage(page); setMobileOpen(false); };
  const signOut = () => { supabase?.auth.signOut(); setSession(null); setActivePage("Overview"); };

  if (authLoading) return <div className="auth-loading"><Brand /><span>Loading your workspace…</span></div>;
  if (!session) return <Login onLogin={setSession} />;

  const operational = session.role !== "member";
  return <div className="app-shell">
    <Sidebar session={session} activePage={activePage} open={mobileOpen} onNavigate={navigate} onSignOut={signOut} onToast={notify} />
    {mobileOpen && <button className="scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-trigger" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Icon name="menu" size={21} /></button>
        <div className="crumb"><span>Workspace</span><Icon name="chevron" size={14} /><strong>{activePage}</strong></div>
        <div className="topbar-actions">
          <label className="top-search"><Icon name="search" size={16} /><input placeholder={operational ? "Search members" : "Search your journey"} aria-label="Search" /></label>
          <div className="notification-box"><button className="notification-button" aria-label="Open notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Icon name="bell" size={18} /><i /></button>{notificationsOpen && <div className="notification-menu"><strong>Notifications</strong><p>{operational ? "Three new member check-ins need attention." : "Your recommended workout is ready."}</p><small>Just now</small></div>}</div>
          <button className="profile-chip" onClick={() => navigate("Profile")}><span>{getInitials(session.name)}</span><b>{session.name.split(" ")[0]}</b><Icon name="chevron" size={14} /></button>
        </div>
      </header>
      <div className="page-content">
        {activePage === "Overview" && (operational ? <OperationsOverview role={session.role} branch={session.branch} onNavigate={navigate} onAddMember={() => setMemberModalOpen(true)} /> : <MemberOverview session={session} onNavigate={navigate} />)}
        {activePage === "Attendance" && <AttendancePage onToast={notify} />}
        {activePage === "Workouts" && <WorkoutPage onToast={notify} />}
        {activePage === "Progress" && <ProgressPage />}
        {activePage === "Profile" && <ProfilePage session={session} onToast={notify} />}
        {activePage === "Branches" && <BranchesPage onNavigate={navigate} />}
        {activePage === "Members" && <MembersPage onToast={notify} onAddMember={() => setMemberModalOpen(true)} />}
        {activePage === "Check-ins" && <CheckInsPage onToast={notify} />}
        {activePage === "Equipment" && <EquipmentPage onToast={notify} />}
        {activePage === "Plans" && <PlansPage onToast={notify} />}
      </div>
    </main>
    {memberModalOpen && <MemberModal onClose={() => setMemberModalOpen(false)} onSave={(name) => { setMemberModalOpen(false); notify(`${name} added to HMT Layout.`); }} />}
    {toast && <div className="toast" role="status"><Icon name="check" size={16} />{toast}</div>}
  </div>;
}

function Login({ onLogin }: { onLogin: (session: Session) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setLoading(true);
    if (supabase) {
      const result = mode === "login" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });
      if (result.error) { setError(result.error.message); setLoading(false); return; }
      if (!result.data.session) { setError("Account created. Check your email to confirm access before signing in."); setLoading(false); return; }
      onLogin(await resolveSession(result.data.session));
      setLoading(false);
      return;
    }
    window.setTimeout(() => { onLogin({ name: role === "member" ? "Arjun Kumar" : roleLabels[role], role, branch: role === "admin" ? "All Bon Ton clubs" : "HMT Layout" }); setLoading(false); }, 300);
  };
  return <div className="auth-page">
    <section className="auth-showcase">
      <div className="showcase-top"><Brand dark /><span className="showcase-label">MEMBER PLATFORM · 2026</span></div>
      <div className="showcase-copy"><p className="eyebrow lime">BON TON FITNESS</p><h1>Build the<br /><em>stronger</em> you.</h1><p>One place for your training, your people, and the habits that move you forward.</p></div>
      <div className="showcase-bottom"><div className="showcase-stat"><strong>05</strong><span>CLUBS ACROSS<br />BENGALURU</span></div><div className="showcase-stat"><strong>01</strong><span>COMMUNITY.<br />YOUR COMMUNITY.</span></div><div className="showcase-orbit"><span>SHOW<br />UP</span></div></div>
    </section>
    <section className="auth-panel"><div className="auth-mobile-brand"><Brand /></div><div className="auth-card">
      <div className="auth-intro"><p className="eyebrow">{mode === "login" ? "WELCOME BACK" : "NEW MEMBER"}</p><h2>{mode === "login" ? "Let's get to work." : "Start your journey."}</h2><p>{mode === "login" ? "Sign in to continue your fitness journey." : "Create your Bon Ton member account."}</p></div>
      <div className="auth-switch"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign in</button><button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button></div>
      <form onSubmit={submit} className="auth-form"><label>Email address<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label><label>Password<div className="password-input"><input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div></label>
        <div className="role-picker"><p><span className="eyebrow">PREVIEW A WORKSPACE</span><small>Choose a role to explore the product</small></p><select value={role} onChange={(e) => setRole(e.target.value as Role)} aria-label="Choose a demo role">{Object.entries(roleLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>
        {mode === "login" && <div className="form-row"><label className="remember"><input type="checkbox" /> Remember me</label><button type="button" className="text-link">Forgot password?</button></div>}
        {error && <p className="form-error">{error}</p>}<button className="auth-cta" disabled={loading}>{loading ? "Connecting…" : mode === "login" ? "Enter Bon Ton" : "Create account"}<Icon name="arrow" size={18} /></button>
      </form><p className="secure-note"><Icon name="shield" size={15} />{supabase ? "Secure Supabase member access" : "Demo mode · ready for Supabase"}</p>
    </div><p className="auth-legal">© 2026 Bon Ton Fitness · HMT Layout, Bengaluru</p></section>
  </div>;
}

async function resolveSession(authSession: NonNullable<Awaited<ReturnType<NonNullable<typeof supabase>["auth"]["getSession"]>>["data"]["session"]>): Promise<Session> {
  const fallback: Session = { name: authSession.user.user_metadata?.full_name ?? authSession.user.email?.split("@")[0] ?? "Bon Ton member", role: "member", branch: "HMT Layout" };
  if (!supabase) return fallback;
  const { data: profile } = await supabase.from("profiles").select("full_name, role, branch_id").eq("id", authSession.user.id).maybeSingle();
  if (!profile) return fallback;
  let branch = "HMT Layout";
  if (profile.branch_id) {
    const { data: branchRow } = await supabase.from("branches").select("name").eq("id", profile.branch_id).maybeSingle();
    branch = branchRow?.name ?? branch;
  }
  return { name: profile.full_name ?? fallback.name, role: (profile.role as Role) ?? "member", branch };
}

function Brand({ dark = false }: { dark?: boolean }) { return <div className={`brand ${dark ? "brand-dark" : ""}`}><span className="brand-symbol">BT</span><span><b>BON TON</b><small>FITNESS CLUB</small></span></div>; }
function Sidebar({ session, activePage, open, onNavigate, onSignOut, onToast }: { session: Session; activePage: Page; open: boolean; onNavigate: (page: Page) => void; onSignOut: () => void; onToast: (message: string) => void }) {
  return <aside className={`sidebar ${open ? "sidebar-open" : ""}`}><Brand dark /><div className="side-profile"><div className="avatar">{getInitials(session.name)}</div><div><b>{session.name}</b><span>{roleLabels[session.role]}</span></div><button onClick={() => onNavigate("Profile")} aria-label="Open profile"><Icon name="chevron" size={15} /></button></div><nav className="side-nav"><p>WORKSPACE</p>{navByRole[session.role].map((item) => <button key={item.label} className={activePage === item.label ? "active" : ""} onClick={() => onNavigate(item.label)}><Icon name={item.icon} /><span>{item.label}</span>{activePage === item.label && <i />}</button>)}<p className="nav-divider">ACCOUNT</p><button className={activePage === "Profile" ? "active" : ""} onClick={() => onNavigate("Profile")}><Icon name="users" /><span>My profile</span></button><button onClick={() => onToast("Settings are coming next.")}><Icon name="settings" /><span>Settings</span></button></nav><div className="side-footer"><div className="club-switcher"><Icon name="map" size={17} /><span><b>{session.branch}</b><small>{session.role === "admin" ? "Network view" : "Your club"}</small></span><Icon name="chevron" size={15} /></div><button className="signout" onClick={onSignOut}><Icon name="logout" /><span>Sign out</span></button></div></aside>;
}

function MemberOverview({ session, onNavigate }: { session: Session; onNavigate: (page: Page) => void }) {
  return <><PageHeader eyebrow="THURSDAY · 23 AUGUST 2026" title={`Good morning, ${session.name.split(" ")[0]}.`} body="Consistency is the key to your strongest self." action={<button className="dark-cta" onClick={() => onNavigate("Workouts")}><Icon name="play" size={16} /> Start a workout</button>} />
    <section className="member-hero"><div className="hero-copy"><span className="live-badge"><i /> YOU'RE CHECKED IN · HMT LAYOUT</span><h2>Make today<br /><em>count.</em></h2><p>Your recommended session is ready. Show up for yourself.</p><button className="lime-cta" onClick={() => onNavigate("Workouts")}>View today's workout <Icon name="arrow" size={17} /></button></div><div className="hero-art"><div className="hero-ring ring-a" /><div className="hero-ring ring-b" /><strong>04</strong><span>DAY<br />STREAK</span></div></section>
    <div className="section-intro"><div><p className="eyebrow">YOUR SNAPSHOT</p><h3>Keep the momentum</h3></div><button className="quiet-link" onClick={() => onNavigate("Progress")}>View progress <Icon name="arrow" size={15} /></button></div>
    <div className="stats-row"><Stat tone="lime" label="Attendance" value="12" detail="of 23 days" note="This month" icon="calendar" /><Stat tone="ink" label="Current streak" value="04" detail="days" note="Best: 12 days" icon="trend" /><Stat tone="plain" label="Current weight" value="74.8" detail="kg" note="+0.8 kg this month" icon="dumbbell" /><Stat tone="peach" label="Fitness goal" value="Muscle" detail="gain" note="On track" icon="trend" /></div>
    <div className="content-grid"><section className="surface workout-card"><CardTitle eyebrow="RECOMMENDED FOR YOU" title="Upper body strength" action={<span className="card-kebab">•••</span>} /><div className="workout-summary"><span><Icon name="clock" size={15} /> 52 min</span><span><Icon name="dumbbell" size={15} /> Intermediate</span><b>Chest + Triceps</b></div>{workoutExercises.slice(0, 3).map((item, i) => <ExerciseLine item={item} index={i} key={item.name} />)}<button className="dark-cta wide" onClick={() => onNavigate("Workouts")}>Open workout <Icon name="arrow" size={16} /></button></section><section className="surface goal-card"><CardTitle eyebrow="AUGUST 2026" title="Attendance rhythm" action={<button className="circle-cta" onClick={() => onNavigate("Attendance")}><Icon name="arrow" size={15} /></button>} /><MiniCalendar /><div className="calendar-key"><span><i className="day-dot filled" /> Attended</span><span><i className="day-dot" /> Rest day</span><b>13 visits</b></div></section></div>
    <div className="section-intro recent"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>You're building a habit</h3></div><button className="quiet-link" onClick={() => onNavigate("Attendance")}>See all activity <Icon name="arrow" size={15} /></button></div><div className="activity-feed"><Activity date="Today, 6:12 PM" title="Checked in at HMT Layout" detail="Session in progress" live /><Activity date="Yesterday, 7:04 AM" title="Upper body strength" detail="52 min · 4 exercises" /><Activity date="Tuesday, 6:48 PM" title="Checked out" detail="58 min session · Great work" /></div>
  </>;
}

function OperationsOverview({ role, branch, onNavigate, onAddMember }: { role: Role; branch: string; onNavigate: (page: Page) => void; onAddMember: () => void }) {
  const totalMembers = role === "admin" ? 861 : 238;
  return <><PageHeader eyebrow={`OPERATIONS · ${role === "admin" ? "ALL CLUBS" : branch.toUpperCase()}`} title="Good morning." body="Here’s what’s happening across your fitness floor today." action={<button className="dark-cta" onClick={onAddMember}><Icon name="user-plus" size={16} /> Add a member</button>} /><section className="ops-hero"><div><span className="live-badge"><i /> LIVE OPERATIONS</span><h2>{role === "admin" ? "Five clubs." : "Your club."}<br /><em>One rhythm.</em></h2><p>One clear view of attendance, people, and equipment keeps the floor moving.</p></div><div className="ops-number"><strong>89</strong><span>MEMBERS<br />IN CLUBS NOW</span></div></section><div className="section-intro"><div><p className="eyebrow">TODAY AT A GLANCE</p><h3>Keep the floor moving</h3></div></div><div className="stats-row"><Stat tone="lime" label="Active members" value={String(totalMembers)} detail="total" note="+18 this month" icon="users" /><Stat tone="ink" label="Checked in now" value="89" detail="members" note="Across operating hours" icon="activity" /><Stat tone="plain" label="New enquiries" value="16" detail="this week" note="5 awaiting follow-up" icon="users" /><Stat tone="peach" label="Equipment health" value="96" detail="% available" note="2 items in maintenance" icon="dumbbell" /></div><div className="content-grid ops-grid">{role === "admin" ? <BranchesPage compact onNavigate={onNavigate} /> : <><CheckInsPage compact onToast={() => undefined} /><MembersPage compact onToast={() => undefined} onAddMember={onAddMember} /></>}</div></>;
}

function AttendancePage({ onToast }: { onToast: (message: string) => void }) { const [selected, setSelected] = useState(23); return <><PageHeader eyebrow="MEMBER HISTORY" title="Attendance rhythm" body="A clear record of every visit, session, and streak." action={<button className="lime-cta" onClick={() => onToast("Attendance synced from the biometric feed.")}><Icon name="activity" size={16} /> Sync biometric feed</button>} /><div className="attendance-layout"><section className="surface attendance-large"><CardTitle eyebrow="AUGUST 2026" title="Every visit counts" action={<span className="pill">13 VISITS</span>} /><Calendar selected={selected} onSelect={setSelected} large /><div className="calendar-key"><span><i className="day-dot filled" /> Attended</span><span><i className="day-dot" /> Rest day</span><b>04 day streak</b></div></section><section className="surface session-detail"><p className="eyebrow lime">SELECTED DAY</p><h3>Wednesday, {selected} August</h3><DetailRow label="CHECK-IN" value={attendanceDays.includes(selected) ? "06:12 PM" : "—"} /><DetailRow label="CHECK-OUT" value={attendanceDays.includes(selected) ? "07:10 PM" : "Rest day"} /><DetailRow label="DURATION" value={attendanceDays.includes(selected) ? "58 minutes" : "—"} /><p className="verified"><Icon name="check" size={15} /> {attendanceDays.includes(selected) ? "Biometric attendance verified" : "No attendance recorded"}</p></section></div></>; }

function WorkoutPage({ onToast }: { onToast: (message: string) => void }) { const [done, setDone] = useState<number[]>([]); const completed = done.length; return <><PageHeader eyebrow="TODAY'S SESSION · 52 MIN" title="Upper body strength" body="A focused session built around your muscle-gain goal." action={<button className="dark-cta" onClick={() => onToast(completed === workoutExercises.length ? "Workout logged to your history." : "Finish every exercise to complete the session.")}><Icon name={completed === workoutExercises.length ? "check" : "play"} size={16} /> {completed === workoutExercises.length ? "Workout complete" : "Start session"}</button>} /><div className="workout-layout"><section className="surface session-workout"><div className="session-head"><div><span className="pill green">TRAINER RECOMMENDED</span><h3>Chest + Triceps</h3><p>Intermediate · 4 exercises · 52 min</p></div><div className="streak-bubble"><strong>04</strong><span>STREAK</span></div></div><div className="progress-track"><i style={{ width: `${(completed / workoutExercises.length) * 100}%` }} /></div><p className="progress-caption">{completed} of {workoutExercises.length} exercises complete</p>{workoutExercises.map((item, index) => <button className={`exercise-row ${done.includes(index) ? "completed" : ""}`} key={item.name} onClick={() => setDone((items) => items.includes(index) ? items.filter((value) => value !== index) : [...items, index])}><span className="exercise-index">0{index + 1}</span><span className="exercise-copy"><b>{item.name}</b><small>{item.sets} · {item.muscle}</small></span><span className="exercise-check"><Icon name="check" size={15} /></span></button>)}</section><aside className="surface coach-card"><p className="eyebrow">YOUR COACH'S NOTE</p><h3>Leave one more rep in the tank.</h3><p>Focus on a controlled eccentric and keep your rest between 60 and 90 seconds. Quality reps build lasting strength.</p><div className="coach-profile"><div className="avatar">RV</div><span><b>Rohan Verma</b><small>Assigned trainer</small></span></div></aside></div></>; }

function ProgressPage() { return <><PageHeader eyebrow="YOUR JOURNEY" title="Progress you can feel" body="Small, consistent actions adding up to a stronger version of you." /><div className="progress-layout"><section className="surface chart-card"><CardTitle eyebrow="BODY WEIGHT" title="74.8 kg" action={<span className="pill green">+0.8 KG</span>} /><div className="chart"><div className="chart-lines"><i /><i /><i /><i /></div><svg viewBox="0 0 640 220" preserveAspectRatio="none"><path d="M0 165 C48 162 68 178 112 151 S175 137 205 144 S245 111 291 125 S338 141 374 102 S424 91 457 111 S495 87 535 76 S582 58 640 41" /></svg></div><div className="chart-axis"><span>01 AUG</span><span>08 AUG</span><span>15 AUG</span><span>23 AUG</span></div></section><section className="surface goal-progress"><p className="eyebrow">GOAL PROGRESS</p><h3>Muscle gain</h3><div className="progress-ring"><strong>68<small>%</small></strong><span>ON TRACK</span></div><p>Keep your weekly attendance above four visits to stay on pace.</p></section></div><section className="surface history-card"><CardTitle eyebrow="FITNESS HISTORY" title="Attendance + workouts" action={<span className="card-kebab">•••</span>} />{["23 Aug", "22 Aug", "21 Aug", "19 Aug"].map((date, index) => <div className="history-row" key={date}><span><b>{date}</b><small>{index === 0 ? "Today" : "August 2026"}</small></span><i><em style={{ width: `${[82, 65, 48, 73][index]}%` }} /></i><b>{[58, 52, 44, 61][index]} min</b><strong>Completed</strong></div>)}</section></>; }

function ProfilePage({ session, onToast }: { session: Session; onToast: (message: string) => void }) { return <><PageHeader eyebrow="MEMBER PROFILE" title="Your foundation" body="Keep your details current so every recommendation feels personal." action={<button className="lime-cta" onClick={() => onToast("Profile changes saved.")}><Icon name="check" size={16} /> Save changes</button>} /><div className="profile-layout"><section className="surface profile-form"><div className="profile-heading"><div className="avatar large">{getInitials(session.name)}</div><div><span className="pill green">ACTIVE MEMBER</span><h3>{session.name}</h3><p>Member since January 2026 · {session.branch}</p></div></div><div className="form-grid"><Field label="Full name" value={session.name} /><Field label="Email address" value="arjun.kumar@example.com" /><Field label="Height" value="176 cm" /><Field label="Current weight" value="74.8 kg" /><Field label="Fitness goal" value="Muscle Gain" select /><Field label="Primary club" value={session.branch} select /></div></section><aside className="profile-side"><div><p>MEMBERSHIP</p><strong>Active</strong><span>Expires 31 Jan 2027</span></div><div><p>EMERGENCY CONTACT</p><strong>Priya Kumar</strong><span>+91 98765 43210</span></div></aside></div></>; }

function BranchesPage({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: (page: Page) => void }) { return <section className={`surface directory-card ${compact ? "compact" : ""}`}><CardTitle eyebrow="FIVE BRANCHES" title="Every club, one view" action={!compact && <span className="pill">NETWORK OVERVIEW</span>} />{branches.map((branch) => <button className="branch-row" key={branch.name} onClick={() => onNavigate?.("Members")}><span className={`branch-marker ${branch.accent}`}><Icon name="map" size={17} /></span><span className="branch-main"><b>{branch.name}</b><small>{branch.area} · {branch.phone}</small></span><span className="branch-stat"><b>{branch.members}</b><small>members</small></span><span className="branch-stat"><b>{branch.checkedIn}</b><small>checked in</small></span><Icon name="chevron" size={16} /></button>)}</section>; }

function MembersPage({ compact = false, onToast, onAddMember }: { compact?: boolean; onToast: (message: string) => void; onAddMember: () => void }) { const members = [{ initials: "AK", name: "Arjun Kumar", goal: "Muscle gain", attendance: "12 / 23", status: "Active" }, { initials: "PS", name: "Priya Shah", goal: "Fat loss", attendance: "18 / 23", status: "Active" }, { initials: "VN", name: "Vivek Nair", goal: "Strength", attendance: "09 / 23", status: "Follow up" }, { initials: "MI", name: "Meera Iyer", goal: "General fitness", attendance: "15 / 23", status: "Active" }]; return <section className={`surface directory-card ${compact ? "compact" : ""}`}><CardTitle eyebrow="MEMBER DIRECTORY" title="People in your care" action={<button className="lime-cta small" onClick={onAddMember}><Icon name="user-plus" size={15} /> Add member</button>} />{!compact && <div className="directory-tools"><label><Icon name="search" size={15} /><input placeholder="Search by name" /></label><span>238 total members</span></div>}{members.map((member) => <button className="member-row" key={member.name} onClick={() => onToast(`${member.name}'s profile opened.`)}><span className="avatar">{member.initials}</span><span className="member-main"><b>{member.name}</b><small>{member.goal}</small></span><span className="member-stat"><small>ATTENDANCE</small><b>{member.attendance}</b></span><span className={`member-status ${member.status === "Follow up" ? "warning" : ""}`}>{member.status}</span><Icon name="chevron" size={16} /></button>)}</section>; }

function CheckInsPage({ compact = false, onToast }: { compact?: boolean; onToast: (message: string) => void }) { const [checkedIn, setCheckedIn] = useState([true, true, true, false]); const people = [{ initials: "AK", name: "Arjun Kumar", time: "6:12 PM", duration: "58 min" }, { initials: "PS", name: "Priya Shah", time: "5:48 PM", duration: "1h 12m" }, { initials: "VN", name: "Vivek Nair", time: "5:31 PM", duration: "1h 30m" }, { initials: "MI", name: "Meera Iyer", time: "—", duration: "—" }]; return <section className={`surface directory-card ${compact ? "compact" : ""}`}><CardTitle eyebrow="HMT LAYOUT · LIVE" title="Currently checked in" action={<span className="live-count"><i />{checkedIn.filter(Boolean).length} active</span>} />{people.map((person, index) => <div className={`checkin-row ${checkedIn[index] ? "" : "muted"}`} key={person.name}><span className="avatar">{person.initials}</span><span><b>{person.name}</b><small>{checkedIn[index] ? `In since ${person.time} · ${person.duration}` : "Not checked in today"}</small></span><button className={checkedIn[index] ? "outline-cta" : "lime-cta small"} onClick={() => { setCheckedIn((values) => values.map((value, i) => i === index ? !value : value)); onToast(`${person.name} ${checkedIn[index] ? "checked out" : "checked in"} manually.`); }}>{checkedIn[index] ? "Check out" : "Check in"}</button></div>)}</section>; }

function EquipmentPage({ onToast }: { onToast: (message: string) => void }) { const [equipment, setEquipment] = useState([{ name: "Cable crossover", type: "Strength", status: "Available" }, { name: "Leg press", type: "Lower body", status: "Maintenance" }, { name: "Treadmill 04", type: "Cardio", status: "Available" }, { name: "Squat rack 02", type: "Strength", status: "Available" }]); return <><PageHeader eyebrow="HMT LAYOUT · EQUIPMENT" title="Keep the floor ready" body="Equipment status will feed the workout recommendation engine in Phase 2." action={<button className="lime-cta" onClick={() => onToast("Equipment added to branch inventory.")}><Icon name="dumbbell" size={16} /> Add equipment</button>} /><section className="surface equipment-card-grid"><CardTitle eyebrow="BRANCH INVENTORY" title="Equipment health" action={<span className="pill">3 AVAILABLE · 1 MAINTENANCE</span>} /><div className="equipment-grid">{equipment.map((item, index) => <div className="equipment-item" key={item.name}><div className="equipment-top"><span className="equipment-symbol"><Icon name="dumbbell" size={18} /></span><button className={`status ${item.status === "Maintenance" ? "maintenance" : "available"}`} onClick={() => { setEquipment((items) => items.map((value, i) => i === index ? { ...value, status: value.status === "Available" ? "Maintenance" : "Available" } : value)); onToast(`${item.name} status updated.`); }}>{item.status}</button></div><b>{item.name}</b><small>{item.type}</small></div>)}</div></section></>; }

function PlansPage({ onToast }: { onToast: (message: string) => void }) { const days = [{ day: "MON", plan: "Chest + Triceps" }, { day: "TUE", plan: "Back + Biceps" }, { day: "WED", plan: "Active recovery" }, { day: "THU", plan: "Shoulders" }, { day: "FRI", plan: "Legs" }, { day: "SAT", plan: "Full body" }, { day: "SUN", plan: "Rest day" }]; return <><PageHeader eyebrow="TRAINER WORKSPACE" title="Weekly plans" body="Assign the right focus for every member, every day." action={<button className="lime-cta" onClick={() => onToast("Plan builder is ready.")}><Icon name="calendar" size={16} /> Create plan</button>} /><section className="surface plans-card"><CardTitle eyebrow="ARJUN KUMAR · MUSCLE GAIN" title="Week of 24 August" action={<span className="pill green">ACTIVE PLAN</span>} /><div className="plans-grid">{days.map((item, index) => <button key={item.day} className={index === 0 ? "selected" : ""} onClick={() => onToast(`${item.day}: ${item.plan}`)}><span>{item.day}</span><b>{item.plan}</b><small>{index === 6 ? "Recovery" : `${index + 3} exercises`}</small></button>)}</div></section></>; }

function MemberModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string) => void }) { const [name, setName] = useState(""); return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><p className="eyebrow">NEW MEMBER</p><h2>Add someone new</h2></div><button onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button></div><label>Full name<input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Member name" /></label><label>Phone number<input placeholder="+91 98765 43210" /></label><label>Fitness goal<select><option>Muscle Gain</option><option>Fat Loss</option><option>Strength</option><option>General Fitness</option></select></label><div className="modal-actions"><button className="outline-cta" onClick={onClose}>Cancel</button><button className="lime-cta" disabled={!name.trim()} onClick={() => onSave(name.trim())}>Add member <Icon name="arrow" size={16} /></button></div></div></div>; }

function PageHeader({ eyebrow, title, body, action }: { eyebrow: string; title: string; body: string; action?: ReactNode }) { return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{body}</p></div>{action}</div>; }
function CardTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) { return <div className="card-title"><div><p className="eyebrow">{eyebrow}</p><h3>{title}</h3></div>{action}</div>; }
function Stat({ tone, label, value, detail, note, icon }: { tone: string; label: string; value: string; detail: string; note: string; icon: IconName }) { return <article className={`stat stat-${tone}`}><div><span>{label}</span><i><Icon name={icon} size={16} /></i></div><strong>{value}<small>{detail}</small></strong><p><b />{note}</p></article>; }
function ExerciseLine({ item, index }: { item: { name: string; sets: string }; index: number }) { return <div className="exercise-line"><span>0{index + 1}</span><div><b>{item.name}</b><small>{item.sets}</small></div><Icon name="chevron" size={15} /></div>; }
function Activity({ date, title, detail, live = false }: { date: string; title: string; detail: string; live?: boolean }) { return <div className="activity-row"><span className={`activity-mark ${live ? "live" : ""}`}>{live ? <i /> : <Icon name="check" size={14} />}</span><span><small>{date}</small><b>{title}</b><em>{detail}</em></span><strong className={live ? "green-text" : ""}>{live ? "Live now" : "Completed"}</strong></div>; }
function MiniCalendar() { return <Calendar selected={23} onSelect={() => undefined} />; }
function Calendar({ selected, onSelect, large = false }: { selected: number; onSelect: (day: number) => void; large?: boolean }) { return <><div className={`calendar-labels ${large ? "large" : ""}`}>{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => <span key={day}>{day}</span>)}</div><div className={`calendar-grid ${large ? "large" : ""}`}>{Array.from({ length: 31 }, (_, index) => { const day = index + 1; return <button key={day} onClick={() => onSelect(day)} className={`${attendanceDays.includes(day) ? "attended" : ""} ${selected === day ? "selected" : ""}`}>{day}</button>; })}</div></>; }
function DetailRow({ label, value }: { label: string; value: string }) { return <div className="detail-row"><span>{label}</span><b>{value}</b></div>; }
function Field({ label, value, select = false }: { label: string; value: string; select?: boolean }) { return <label>{label}{select ? <select defaultValue={value}><option>{value}</option><option>HMT Layout</option><option>General Fitness</option><option>Strength</option></select> : <input defaultValue={value} />}</label>; }
function getInitials(name: string) { return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }

export default App;

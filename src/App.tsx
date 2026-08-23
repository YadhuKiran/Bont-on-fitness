import { FormEvent, ReactNode, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

type IconName =
  | "grid"
  | "calendar"
  | "dumbbell"
  | "trend"
  | "users"
  | "settings"
  | "logout"
  | "bell"
  | "search"
  | "arrow"
  | "play"
  | "check"
  | "clock"
  | "map"
  | "chevron"
  | "shield"
  | "user-plus"
  | "briefcase"
  | "activity"
  | "menu";

type Role = "member" | "trainer" | "staff" | "manager" | "admin";

type IconProps = { name: IconName; size?: number; stroke?: number };

function Icon({ name, size = 20, stroke = 1.8 }: IconProps) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    calendar: <><rect x="3" y="4.5" width="18" height="17" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9.5h18" /></>,
    dumbbell: <><path d="M6 8v8M3.5 10v4M18 8v8M20.5 10v4M6 12h12" /></>,
    trend: <><path d="m4 16 5-5 4 3 7-8" /><path d="M15 6h5v5" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20c.3-3.4 2.2-5 5.5-5s5.2 1.6 5.5 5M16 11a3 3 0 1 0 0-6M16 15c2.8.2 4.2 1.8 4.5 4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.5h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1h2.5V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.5h-.1a1.7 1.7 0 0 0-1.5 1.5Z" /></>,
    logout: <><path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M14 16l4-4-4-4M18 12H8" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    play: <path d="m9 6 9 6-9 6V6Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    map: <><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
    shield: <><path d="M12 21s8-3.6 8-10V5l-8-3-8 3v6c0 6.4 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    "user-plus": <><circle cx="9" cy="8" r="3" /><path d="M3.5 20c.3-3.4 2.2-5 5.5-5s5.2 1.6 5.5 5M18 8v6M15 11h6" /></>,
    briefcase: <><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M8 6V4h8v2M3 11h18M10 11v2h4v-2" /></>,
    activity: <><path d="M3 12h4l2-7 4 14 2-7h6" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const roleLabels: Record<Role, string> = {
  member: "Member",
  trainer: "Trainer",
  staff: "Branch staff",
  manager: "Branch manager",
  admin: "Super admin",
};

const branches = [
  { name: "HMT Layout", location: "Bengaluru North", members: 238, attendance: 76, accent: "lime" },
  { name: "Anjana Nagar", location: "Bengaluru West", members: 194, attendance: 61, accent: "cream" },
  { name: "Laggere", location: "Bengaluru North", members: 167, attendance: 53, accent: "dark" },
  { name: "Chikka Gollarahatti", location: "Bengaluru West", members: 143, attendance: 48, accent: "blue" },
  { name: "Nelamangala", location: "Bengaluru Rural", members: 119, attendance: 39, accent: "orange" },
];

const attendanceDays = [1, 2, 5, 6, 8, 9, 12, 15, 16, 19, 21, 22, 23];
const workoutRows = [
  { number: "01", name: "Barbell bench press", detail: "4 sets · 8 reps" },
  { number: "02", name: "Incline dumbbell press", detail: "3 sets · 10 reps" },
  { number: "03", name: "Cable tricep pushdown", detail: "3 sets · 12 reps" },
];

function App() {
  const [session, setSession] = useState<{ name: string; role: Role; branch: string } | null>(null);
  const [active, setActive] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  if (!session) return <Login onLogin={setSession} />;

  const navItems = getNavItems(session.role);
  const isMember = session.role === "member";
  const isOperations = ["staff", "manager", "admin"].includes(session.role);

  const handleNavigate = (label: string) => {
    setActive(label);
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark">BT</div>
          <div><div className="brand-name">BON TON</div><div className="brand-subtitle">FITNESS CLUB</div></div>
        </div>
        <div className="member-mini">
          <div className="avatar avatar-small">{getInitials(session.name)}</div>
          <div><strong>{session.name}</strong><span>{roleLabels[session.role]}</span></div>
          <button className="icon-button" aria-label="Account options" onClick={() => showToast("Account preferences are coming soon.")}><Icon name="chevron" size={16} /></button>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          <span className="nav-heading">WORKSPACE</span>
          {navItems.map((item) => <button key={item.label} onClick={() => handleNavigate(item.label)} className={`nav-item ${active === item.label ? "nav-active" : ""}`}><Icon name={item.icon} /><span>{item.label}</span>{active === item.label && <span className="nav-indicator" />}</button>)}
          <span className="nav-heading nav-heading-space">MANAGE</span>
          {isMember ? <>
            <button className={`nav-item ${active === "My profile" ? "nav-active" : ""}`} onClick={() => handleNavigate("My profile")}><Icon name="users" /><span>My profile</span></button>
            <button className="nav-item" onClick={() => showToast("Profile settings are coming soon.")}><Icon name="settings" /><span>Settings</span></button>
          </> : <>
            <button className={`nav-item ${active === "Settings" ? "nav-active" : ""}`} onClick={() => handleNavigate("Settings")}><Icon name="settings" /><span>Settings</span></button>
            <button className="nav-item" onClick={() => showToast("Help centre is coming soon.")}><Icon name="shield" /><span>Help centre</span></button>
          </>}
        </nav>
        <div className="sidebar-bottom">
          <div className="club-card"><div className="club-card-icon"><Icon name="map" size={17} /></div><div><strong>{session.branch}</strong><span>{isOperations ? "Your operating branch" : "Primary club"}</span></div><Icon name="chevron" size={15} /></div>
          <button className="nav-item logout" onClick={() => setSession(null)}><Icon name="logout" /><span>Sign out</span></button>
        </div>
      </aside>
      {mobileMenuOpen && <button className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" />}
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation"><Icon name="menu" size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><Icon name="chevron" size={14} /><strong>{active}</strong></div>
          <div className="top-actions">
            <div className="search-box"><Icon name="search" size={17} /><input aria-label="Search" placeholder={isOperations ? "Search members" : "Search anything"} /></div>
            <div className="notification-wrap"><button className="round-button" onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications"><Icon name="bell" size={19} /><span className="notification-dot" /></button>{showNotifications && <div className="notification-popover"><strong>Notifications</strong><p>{isMember ? "Your workout plan for today is ready." : "Three new member check-ins need attention."}</p><small>Just now</small></div>}</div>
            <div className="avatar avatar-top">{getInitials(session.name)}</div>
          </div>
        </header>
        <div className="content">
          {active === "Overview" && (isMember ? <MemberOverview session={session} onNavigate={handleNavigate} /> : <OperationsOverview role={session.role} branch={session.branch} onNavigate={handleNavigate} />)}
          {active === "Attendance" && <AttendanceView onToast={showToast} />}
          {active === "Workouts" && <WorkoutView onToast={showToast} />}
          {active === "Progress" && <ProgressView />}
          {active === "My profile" && <ProfileView session={session} onToast={showToast} />}
          {active === "Branches" && <BranchesView onNavigate={handleNavigate} />}
          {active === "Members" && <MembersView role={session.role} onToast={showToast} />}
          {active === "Check-ins" && <CheckInsView onToast={showToast} />}
          {active === "Equipment" && <EquipmentView onToast={showToast} />}
          {active === "Plans" && <PlansView onToast={showToast} />}
          {active === "Settings" && <EmptyView eyebrow="ACCOUNT SETTINGS" title="Make the workspace yours" body="Notification preferences, access controls, and branch defaults will live here." />}
        </div>
      </main>
      {toast && <div className="toast" role="status"><Icon name="check" size={16} /> {toast}</div>}
    </div>
  );
}

function Login({ onLogin }: { onLogin: (session: { name: string; role: Role; branch: string }) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isConfigured = Boolean(supabase);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    if (supabase && email && password) {
      const result = mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { full_name: "Bon Ton member", role } } });
      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }
    }
    window.setTimeout(() => {
      onLogin({ name: role === "member" ? "Arjun Kumar" : roleLabels[role], role, branch: role === "admin" ? "All Bon Ton clubs" : "HMT Layout" });
      setLoading(false);
    }, 250);
  };

  return <div className="auth-page">
    <div className="auth-brand"><div className="brand-mark large-mark">BT</div><div><div className="brand-name">BON TON</div><div className="brand-subtitle">FITNESS CLUB</div></div></div>
    <div className="auth-layout">
      <div className="auth-visual"><div className="visual-kicker"><span /> BON TON FITNESS <span /></div><h1>Train with<br /><em>purpose.</em></h1><p>Everything you need to build a body and life you're proud of.</p><div className="visual-stats"><div><strong>05</strong><span>CLUBS ACROSS<br />BENGALURU</span></div><div><strong>01</strong><span>COMMUNITY.<br />YOUR COMMUNITY.</span></div></div><div className="visual-lines" /><div className="visual-word">SHOW UP</div></div>
      <div className="auth-form-wrap"><div className="auth-form">
        <div className="auth-heading"><p className="eyebrow">{mode === "login" ? "WELCOME BACK" : "NEW MEMBER"}</p><h2>{mode === "login" ? "Let's get to work." : "Start your journey."}</h2><p>{mode === "login" ? "Sign in to continue your fitness journey." : "Create your Bon Ton member account."}</p></div>
        <div className="auth-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Email & password</button><button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button></div>
        <form onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" /></label><label>Password<div className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div></label>
          <div className="demo-role"><div><span className="eyebrow">DEMO ACCESS</span><p>Choose a workspace to preview</p></div><select aria-label="Demo role" value={role} onChange={(event) => setRole(event.target.value as Role)}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          {mode === "login" && <div className="form-options"><label className="checkbox-label"><input type="checkbox" /> Remember me</label><button type="button" className="link-button">Forgot password?</button></div>}
          {error && <div className="form-error">{error}</div>}
          <button className="button button-lime auth-submit" type="submit" disabled={loading}>{loading ? "Connecting…" : mode === "login" ? "Sign in to Bon Ton" : "Create account"} <Icon name="arrow" size={17} /></button>
        </form>
        <div className="auth-note"><Icon name="shield" size={15} /> {isConfigured ? "Secure Supabase member access" : "Demo mode · add Supabase keys to connect"}</div>
      </div></div>
    </div><p className="auth-footer">© 2026 Bon Ton Fitness <span>·</span> HMT Layout, Bengaluru</p>
  </div>;
}

function getNavItems(role: Role): { label: string; icon: IconName }[] {
  if (role === "member") return [{ label: "Overview", icon: "grid" }, { label: "Attendance", icon: "calendar" }, { label: "Workouts", icon: "dumbbell" }, { label: "Progress", icon: "trend" }];
  if (role === "trainer") return [{ label: "Overview", icon: "grid" }, { label: "Members", icon: "users" }, { label: "Plans", icon: "calendar" }, { label: "Progress", icon: "trend" }];
  if (role === "staff") return [{ label: "Overview", icon: "grid" }, { label: "Check-ins", icon: "activity" }, { label: "Members", icon: "users" }, { label: "Attendance", icon: "calendar" }];
  return [{ label: "Overview", icon: "grid" }, { label: "Branches", icon: "map" }, { label: "Members", icon: "users" }, { label: "Equipment", icon: "dumbbell" }];
}

function MemberOverview({ session, onNavigate }: { session: { name: string; branch: string }; onNavigate: (label: string) => void }) {
  return <>
    <div className="welcome-row"><div><p className="eyebrow">THURSDAY, 23 AUGUST 2026</p><h1>Good morning, {session.name.split(" ")[0]}<span>.</span></h1><p className="welcome-copy">Consistency is the key to your strongest self.</p></div><button className="button button-dark" onClick={() => onNavigate("Workouts")}><Icon name="play" size={16} /> Start a workout</button></div>
    <section className="hero-card"><div className="hero-content"><div className="live-pill"><span className="live-dot" /> YOU'RE CHECKED IN</div><h2>Make today<br /><em>count.</em></h2><p>Your recommended session is ready. Show up for yourself.</p><button className="button button-lime" onClick={() => onNavigate("Workouts")}>View today's workout <Icon name="arrow" size={17} /></button></div><div className="hero-decoration"><div className="ring ring-one" /><div className="ring ring-two" /><div className="hero-number">04</div><span>WEEK<br />STREAK</span></div></section>
    <div className="section-heading"><div><p className="eyebrow">YOUR SNAPSHOT</p><h3>Keep the momentum</h3></div><button className="text-button" onClick={() => onNavigate("Progress")}>View progress <Icon name="arrow" size={16} /></button></div>
    <section className="stats-grid"><StatCard label="Attendance" value="12" suffix="/ 23 days" helper="This month" icon="calendar" tone="lime" /><StatCard label="Current streak" value="04" suffix=" days" helper="Best: 12 days" icon="trend" tone="dark" /><StatCard label="Current weight" value="74.8" suffix=" kg" helper="+0.8 kg this month" icon="dumbbell" tone="light" /><StatCard label="Fitness goal" value="Muscle" suffix=" gain" helper="On track" icon="trend" tone="warm" /></section>
    <div className="dashboard-columns"><section className="panel workout-panel"><div className="panel-heading"><div><p className="eyebrow">RECOMMENDED FOR YOU</p><h3>Upper body strength</h3></div><span className="panel-menu">•••</span></div><div className="workout-meta"><span><Icon name="clock" size={15} /> 52 min</span><span><Icon name="dumbbell" size={15} /> Intermediate</span><span className="meta-accent">Chest + Triceps</span></div><div className="workout-list">{workoutRows.map((row) => <WorkoutRow key={row.number} {...row} />)}</div><button className="button button-dark full-button" onClick={() => onNavigate("Workouts")}>Open workout <Icon name="arrow" size={17} /></button></section><AttendanceCard onNavigate={onNavigate} /></div>
    <div className="section-heading recent-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>You're building a habit</h3></div><button className="text-button" onClick={() => onNavigate("Attendance")}>See all activity <Icon name="arrow" size={16} /></button></div><div className="activity-list"><ActivityItem date="Today, 6:12 PM" title={`Checked in at ${session.branch}`} detail="Session in progress" status="Live now" live /><ActivityItem date="Yesterday, 7:04 AM" title="Upper body strength" detail="52 min · 4 exercises" status="Completed" /><ActivityItem date="Tuesday, 6:48 PM" title="Checked out" detail="58 min session · Great work" status="Completed" /></div>
  </>;
}

function OperationsOverview({ role, branch, onNavigate }: { role: Role; branch: string; onNavigate: (label: string) => void }) {
  const scope = role === "admin" ? "ALL BON TON CLUBS" : branch.toUpperCase();
  return <>
    <div className="welcome-row"><div><p className="eyebrow">OPERATIONS · {scope}</p><h1>Good morning<span>.</span></h1><p className="welcome-copy">Here’s what’s happening across your fitness floor today.</p></div><button className="button button-dark" onClick={() => onNavigate(role === "staff" ? "Check-ins" : "Members")}><Icon name="user-plus" size={16} /> {role === "staff" ? "Open check-ins" : "Add a member"}</button></div>
    <section className="ops-hero"><div><span className="live-pill"><span className="live-dot" /> LIVE OPERATIONS</span><h2>{role === "admin" ? "Five clubs." : "Your club."}<br /><em>One rhythm.</em></h2><p>Keep every member moving with a clear view of attendance, people, and equipment.</p></div><div className="ops-hero-stat"><strong>89</strong><span>MEMBERS<br />IN CLUBS NOW</span></div></section>
    <div className="section-heading"><div><p className="eyebrow">TODAY AT A GLANCE</p><h3>Keep the floor moving</h3></div></div>
    <section className="stats-grid"><StatCard label="Active members" value={role === "admin" ? "861" : "238"} suffix=" total" helper="+18 this month" icon="users" tone="lime" /><StatCard label="Checked in now" value="89" suffix=" members" helper="Across operating hours" icon="activity" tone="dark" /><StatCard label="New enquiries" value="16" suffix=" this week" helper="5 awaiting follow-up" icon="briefcase" tone="light" /><StatCard label="Equipment health" value="96" suffix="% available" helper="2 items in maintenance" icon="dumbbell" tone="warm" /></section>
    {role === "admin" ? <BranchesView onNavigate={onNavigate} compact /> : <div className="dashboard-columns"><CheckInsView onToast={() => undefined} compact /><MembersView role={role} onToast={() => undefined} compact /></div>}
  </>;
}

function AttendanceView({ onToast }: { onToast: (message: string) => void }) {
  const [selectedDay, setSelectedDay] = useState(23);
  return <><PageIntro eyebrow="MEMBER HISTORY" title="Attendance rhythm" body="A clear record of every visit, session, and streak." action={<button className="button button-lime" onClick={() => onToast("Attendance is synced from the biometric feed.")}><Icon name="activity" size={16} /> Sync biometric feed</button>} /><div className="detail-grid"><section className="panel large-panel"><div className="panel-heading"><div><p className="eyebrow">AUGUST 2026</p><h3>Every visit counts</h3></div><span className="month-chip">13 visits</span></div><div className="calendar-labels large-calendar">{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid large-calendar">{Array.from({ length: 31 }, (_, i) => { const day = i + 1; const attended = attendanceDays.includes(day); return <button key={day} onClick={() => setSelectedDay(day)} className={`calendar-day ${attended ? "attended" : ""} ${day === selectedDay ? "today" : ""}`}>{day}</button>; })}</div><div className="calendar-footer"><span><i className="legend-dot attended" /> Attended</span><span><i className="legend-dot" /> Rest day</span><strong>04 day streak</strong></div></section><section className="panel session-panel"><p className="eyebrow">SELECTED DAY</p><h3>Wednesday, {selectedDay} August</h3><div className="session-time"><span>CHECK-IN</span><strong>{attendanceDays.includes(selectedDay) ? "06:12 PM" : "—"}</strong></div><div className="session-time"><span>CHECK-OUT</span><strong>{attendanceDays.includes(selectedDay) ? "07:10 PM" : "Rest day"}</strong></div><div className="session-time"><span>DURATION</span><strong>{attendanceDays.includes(selectedDay) ? "58 minutes" : "—"}</strong></div><div className="session-note"><Icon name="check" size={15} /> {attendanceDays.includes(selectedDay) ? "Biometric attendance verified" : "No attendance recorded"}</div></section></div></>;
}

function WorkoutView({ onToast }: { onToast: (message: string) => void }) {
  const [started, setStarted] = useState(false);
  return <><PageIntro eyebrow="TODAY'S SESSION" title="Upper body strength" body="A focused 52-minute session built around your muscle-gain goal." action={<button className="button button-dark" onClick={() => { setStarted(!started); onToast(started ? "Workout paused." : "Workout started. Have a strong session."); }}><Icon name={started ? "clock" : "play"} size={16} /> {started ? "Pause workout" : "Start workout"}</button>} /><div className="workout-layout"><section className="panel workout-detail-panel"><div className="workout-detail-top"><div><span className="tag tag-lime">TRAINER RECOMMENDED</span><h3>Chest + Triceps</h3><p>Intermediate · 4 exercises · 52 min</p></div><div className="workout-circle">04<span>STREAK</span></div></div>{workoutRows.map((row, index) => <div className="exercise-card" key={row.number}><span className="row-number">{row.number}</span><div><strong>{row.name}</strong><span>{row.detail}</span></div><button className={index === 0 && started ? "exercise-done" : "exercise-button"} onClick={() => onToast(`${row.name} marked ${index === 0 && started ? "incomplete" : "complete"}.`)}><Icon name="check" size={15} /></button></div>)}<button className="button button-lime full-button" onClick={() => onToast("Workout logged to your fitness history.")}>Complete workout <Icon name="arrow" size={17} /></button></section><section className="panel coach-note"><p className="eyebrow">YOUR COACH'S NOTE</p><h3>Leave one more rep in the tank.</h3><p>Focus on a controlled eccentric and keep your rest between 60 and 90 seconds. Quality reps build lasting strength.</p><div className="coach-signature"><div className="avatar avatar-small">RV</div><div><strong>Rohan Verma</strong><span>Assigned trainer</span></div></div></section></div></>;
}

function ProgressView() {
  return <><PageIntro eyebrow="YOUR JOURNEY" title="Progress you can feel" body="Small, consistent actions adding up to a stronger version of you." /><div className="progress-grid"><section className="panel progress-chart"><div className="panel-heading"><div><p className="eyebrow">BODY WEIGHT</p><h3>74.8 kg</h3></div><span className="positive-change">+0.8 kg</span></div><div className="chart-area"><div className="chart-grid-lines"><span /><span /><span /><span /></div><svg viewBox="0 0 620 220" preserveAspectRatio="none" className="line-chart" aria-label="Weight progress chart"><path d="M0 164 C50 160 70 175 110 151 S170 136 205 143 S245 109 290 125 S335 141 370 101 S425 92 455 111 S495 85 530 75 S580 60 620 43" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /><path d="M0 164 C50 160 70 175 110 151 S170 136 205 143 S245 109 290 125 S335 141 370 101 S425 92 455 111 S495 85 530 75 S580 60 620 43 V220 H0Z" fill="currentColor" opacity=".08" /></svg></div><div className="chart-labels"><span>01 AUG</span><span>08 AUG</span><span>15 AUG</span><span>23 AUG</span></div></section><section className="panel goal-panel"><p className="eyebrow">GOAL PROGRESS</p><h3>Muscle gain</h3><div className="goal-ring"><strong>68<span>%</span></strong><small>ON TRACK</small></div><p>Keep your weekly attendance above 4 visits to stay on pace.</p></section></div><section className="panel progress-history"><div className="panel-heading"><div><p className="eyebrow">FITNESS HISTORY</p><h3>Attendance + workouts</h3></div><span className="panel-menu">•••</span></div>{["23 Aug", "22 Aug", "21 Aug", "19 Aug"].map((date, index) => <div className="history-row" key={date}><div className="history-date">{date}<span>{index === 0 ? "Today" : "August 2026"}</span></div><div className="history-bar"><i style={{ width: `${[82, 65, 48, 73][index]}%` }} /></div><strong>{[58, 52, 44, 61][index]} min</strong><span className="status-live">Completed</span></div>)}</section></>;
}

function ProfileView({ session, onToast }: { session: { name: string; branch: string }; onToast: (message: string) => void }) {
  return <><PageIntro eyebrow="MEMBER PROFILE" title="Your foundation" body="Keep your details current so every recommendation feels personal." action={<button className="button button-lime" onClick={() => onToast("Profile changes saved.")}><Icon name="check" size={16} /> Save changes</button>} /><section className="profile-grid"><div className="panel profile-card"><div className="profile-header"><div className="avatar avatar-large">{getInitials(session.name)}</div><div><span className="tag tag-lime">ACTIVE MEMBER</span><h3>{session.name}</h3><p>Member since January 2026 · {session.branch}</p></div></div><div className="form-grid"><label>Full name<input defaultValue={session.name} /></label><label>Email address<input defaultValue="arjun.kumar@example.com" /></label><label>Height<input defaultValue="176 cm" /></label><label>Starting weight<input defaultValue="72 kg" /></label><label>Fitness goal<select defaultValue="Muscle Gain"><option>Muscle Gain</option><option>Fat Loss</option><option>Strength</option><option>Endurance</option><option>General Fitness</option></select></label><label>Primary club<select defaultValue={session.branch}><option>HMT Layout</option><option>Anjana Nagar</option><option>Laggere</option><option>Chikka Gollarahatti</option><option>Nelamangala</option></select></label></div></div><aside className="profile-side"><div className="side-stat"><span>MEMBERSHIP</span><strong>Active</strong><small>Expires 31 Jan 2027</small></div><div className="side-stat"><span>EMERGENCY CONTACT</span><strong>Priya Kumar</strong><small>+91 98765 43210</small></div></aside></section></>;
}

function BranchesView({ onNavigate, compact = false }: { onNavigate: (label: string) => void; compact?: boolean }) {
  return <section className={`panel branches-panel ${compact ? "compact-panel" : ""}`}><div className="panel-heading"><div><p className="eyebrow">{compact ? "FIVE BRANCHES" : "NETWORK OVERVIEW"}</p><h3>Every club, one view</h3></div>{!compact && <button className="button button-lime" onClick={() => onNavigate("Members")}><Icon name="users" size={15} /> View members</button>}</div><div className="branch-list">{branches.map((branch) => <button className="branch-row" key={branch.name} onClick={() => onNavigate("Members")}><div className={`branch-icon branch-${branch.accent}`}><Icon name="map" size={17} /></div><div className="branch-name"><strong>{branch.name}</strong><span>{branch.location}</span></div><div className="branch-metric"><strong>{branch.members}</strong><span>members</span></div><div className="branch-metric"><strong>{branch.attendance}</strong><span>checked in</span></div><Icon name="chevron" size={16} /></button>)}</div></section>;
}

function MembersView({ role, onToast, compact = false }: { role: Role; onToast: (message: string) => void; compact?: boolean }) {
  const members = [{ initials: "AK", name: "Arjun Kumar", goal: "Muscle gain", attendance: "12 / 23", status: "Active" }, { initials: "PS", name: "Priya Shah", goal: "Fat loss", attendance: "18 / 23", status: "Active" }, { initials: "VN", name: "Vivek Nair", goal: "Strength", attendance: "09 / 23", status: "Needs follow-up" }, { initials: "MI", name: "Meera Iyer", goal: "General fitness", attendance: "15 / 23", status: "Active" }];
  return <section className={`panel members-panel ${compact ? "compact-panel" : ""}`}><div className="panel-heading"><div><p className="eyebrow">{role === "trainer" ? "MY MEMBERS" : "MEMBER DIRECTORY"}</p><h3>People in your care</h3></div><button className="button button-lime" onClick={() => onToast("New member form is ready for Supabase integration.")}><Icon name="user-plus" size={15} /> Add member</button></div>{!compact && <div className="table-tools"><div className="inline-search"><Icon name="search" size={15} /><input placeholder="Search by name" /></div><span>238 total members</span></div>}<div className="member-table">{members.map((member) => <button className="member-row" key={member.name} onClick={() => onToast(`${member.name}'s profile opened.`)}><div className="avatar avatar-small">{member.initials}</div><div className="member-name"><strong>{member.name}</strong><span>{member.goal}</span></div><div className="member-cell"><span>ATTENDANCE</span><strong>{member.attendance}</strong></div><div className={`member-status ${member.status !== "Active" ? "status-warning" : ""}`}>{member.status}</div><Icon name="chevron" size={16} /></button>)}</div></section>;
}

function CheckInsView({ onToast, compact = false }: { onToast: (message: string) => void; compact?: boolean }) {
  const [checkedIn, setCheckedIn] = useState([true, true, true, false]);
  const current = [{ initials: "AK", name: "Arjun Kumar", time: "6:12 PM", duration: "58 min" }, { initials: "PS", name: "Priya Shah", time: "5:48 PM", duration: "1h 12m" }, { initials: "VN", name: "Vivek Nair", time: "5:31 PM", duration: "1h 30m" }, { initials: "MI", name: "Meera Iyer", time: "4:55 PM", duration: "—" }];
  return <section className={`panel checkins-panel ${compact ? "compact-panel" : ""}`}><div className="panel-heading"><div><p className="eyebrow">HMT LAYOUT · LIVE</p><h3>Currently checked in</h3></div><span className="live-count"><i className="live-dot" /> {checkedIn.filter(Boolean).length} active</span></div><div className="checkin-list">{current.map((member, index) => <div className={`checkin-row ${checkedIn[index] ? "" : "checkin-out"}`} key={member.name}><div className="avatar avatar-small">{member.initials}</div><div><strong>{member.name}</strong><span>{checkedIn[index] ? `In since ${member.time} · ${member.duration}` : "Not checked in today"}</span></div><button className={checkedIn[index] ? "button button-outline" : "button button-lime"} onClick={() => { setCheckedIn((values) => values.map((value, valueIndex) => valueIndex === index ? !value : value)); onToast(`${member.name} ${checkedIn[index] ? "checked out" : "checked in"} manually.`); }}>{checkedIn[index] ? "Check out" : "Check in"}</button></div>)}</div></section>;
}

function EquipmentView({ onToast }: { onToast: (message: string) => void }) {
  const [equipment, setEquipment] = useState([{ name: "Cable crossover", type: "Strength", status: "Available" }, { name: "Leg press", type: "Lower body", status: "Maintenance" }, { name: "Treadmill 04", type: "Cardio", status: "Available" }, { name: "Squat rack 02", type: "Strength", status: "Available" }]);
  return <><PageIntro eyebrow="HMT LAYOUT · EQUIPMENT" title="Keep the floor ready" body="Equipment status will feed the workout recommendation engine in Phase 2." action={<button className="button button-lime" onClick={() => onToast("Equipment added to the branch inventory.")}><Icon name="dumbbell" size={16} /> Add equipment</button>} /><section className="panel equipment-panel"><div className="panel-heading"><div><p className="eyebrow">BRANCH INVENTORY</p><h3>Equipment health</h3></div><span className="month-chip">3 available · 1 maintenance</span></div><div className="equipment-grid">{equipment.map((item, index) => <div className="equipment-card" key={item.name}><div className="equipment-card-top"><div className="equipment-icon"><Icon name="dumbbell" size={18} /></div><button className={`status-pill ${item.status === "Maintenance" ? "status-warning" : "status-available"}`} onClick={() => { setEquipment((items) => items.map((equipmentItem, itemIndex) => itemIndex === index ? { ...equipmentItem, status: equipmentItem.status === "Available" ? "Maintenance" : "Available" } : equipmentItem)); onToast(`${item.name} status updated.`); }}>{item.status}</button></div><strong>{item.name}</strong><span>{item.type}</span></div>)}</div></section></>;
}

function PlansView({ onToast }: { onToast: (message: string) => void }) {
  return <><PageIntro eyebrow="TRAINER WORKSPACE" title="Weekly plans" body="Assign the right focus for every member, every day." action={<button className="button button-lime" onClick={() => onToast("Plan builder is ready for Supabase integration.")}><Icon name="calendar" size={16} /> Create plan</button>} /><section className="panel plans-panel"><div className="panel-heading"><div><p className="eyebrow">ARJUN KUMAR · MUSCLE GAIN</p><h3>Week of 24 August</h3></div><span className="tag tag-lime">ACTIVE PLAN</span></div><div className="plan-days">{[{ day: "MON", focus: "Chest + Triceps" }, { day: "TUE", focus: "Back + Biceps" }, { day: "WED", focus: "Active recovery" }, { day: "THU", focus: "Shoulders" }, { day: "FRI", focus: "Legs" }, { day: "SAT", focus: "Full body" }, { day: "SUN", focus: "Rest day" }].map((item, index) => <button key={item.day} className={`plan-day ${index === 0 ? "plan-day-active" : ""}`} onClick={() => onToast(`${item.day}: ${item.focus}`)}><span>{item.day}</span><strong>{item.focus}</strong><small>{index === 6 ? "Recovery" : `${index + 3} exercises`}</small></button>)}</div></section></>;
}

function EmptyView({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <div className="empty-view"><div className="empty-icon"><Icon name="settings" size={22} /></div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{body}</p></div>;
}

function PageIntro({ eyebrow, title, body, action }: { eyebrow: string; title: string; body: string; action?: ReactNode }) {
  return <div className="page-intro"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{body}</p></div>{action}</div>;
}

function AttendanceCard({ onNavigate }: { onNavigate: (label: string) => void }) {
  return <section className="panel attendance-panel"><div className="panel-heading"><div><p className="eyebrow">AUGUST 2026</p><h3>Attendance rhythm</h3></div><button className="round-button small-round" onClick={() => onNavigate("Attendance")} aria-label="Open attendance"><Icon name="arrow" size={16} /></button></div><div className="calendar-labels">{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{Array.from({ length: 31 }, (_, i) => { const day = i + 1; const attended = attendanceDays.includes(day); return <button key={day} className={`calendar-day ${attended ? "attended" : ""} ${day === 23 ? "today" : ""}`}>{day}</button>; })}</div><div className="calendar-footer"><span><i className="legend-dot attended" /> Attended</span><span><i className="legend-dot" /> Rest day</span><strong>13 visits</strong></div></section>;
}

function StatCard({ label, value, suffix, helper, icon, tone }: { label: string; value: string; suffix: string; helper: string; icon: IconName; tone: "lime" | "dark" | "light" | "warm" }) { return <div className={`stat-card stat-${tone}`}><div className="stat-top"><span>{label}</span><div className="stat-icon"><Icon name={icon} size={17} /></div></div><div className="stat-value">{value}<small>{suffix}</small></div><div className="stat-helper"><span className="helper-dot" />{helper}</div></div>; }
function WorkoutRow({ number, name, detail }: { number: string; name: string; detail: string }) { return <div className="workout-row"><span className="row-number">{number}</span><div><strong>{name}</strong><span>{detail}</span></div><Icon name="chevron" size={16} /></div>; }
function ActivityItem({ date, title, detail, status, live = false }: { date: string; title: string; detail: string; status: string; live?: boolean }) { return <div className="activity-item"><div className={`activity-icon ${live ? "activity-live" : ""}`}>{live ? <span className="live-dot" /> : <Icon name="check" size={16} />}</div><div className="activity-copy"><span>{date}</span><strong>{title}</strong><small>{detail}</small></div><span className={`activity-status ${live ? "status-live" : ""}`}>{status}</span></div>; }
function getInitials(name: string) { return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }

export default App;

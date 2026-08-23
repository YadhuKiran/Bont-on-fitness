import { FormEvent, ReactNode, useState } from "react";

type IconName = "grid" | "calendar" | "dumbbell" | "trend" | "users" | "settings" | "logout" | "bell" | "search" | "arrow" | "play" | "check" | "clock" | "map" | "chevron";

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
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const navItems: { label: string; icon: IconName }[] = [
  { label: "Overview", icon: "grid" },
  { label: "Attendance", icon: "calendar" },
  { label: "Workouts", icon: "dumbbell" },
  { label: "Progress", icon: "trend" },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark">BT</div>
          <div><div className="brand-name">BON TON</div><div className="brand-subtitle">FITNESS CLUB</div></div>
        </div>
        <div className="member-mini"><div className="avatar avatar-small">AK</div><div><strong>Arjun Kumar</strong><span>Member</span></div><button className="icon-button"><Icon name="chevron" size={16} /></button></div>
        <nav className="main-nav">
          <span className="nav-heading">WORKSPACE</span>
          {navItems.map((item) => <button key={item.label} onClick={() => { setActive(item.label); setMobileMenuOpen(false); }} className={`nav-item ${active === item.label ? "nav-active" : ""}`}><Icon name={item.icon} /><span>{item.label}</span>{item.label === "Overview" && <span className="nav-indicator" />}</button>)}
          <span className="nav-heading nav-heading-space">MANAGE</span>
          <button className="nav-item"><Icon name="users" /><span>My profile</span></button>
          <button className="nav-item"><Icon name="settings" /><span>Settings</span></button>
        </nav>
        <div className="sidebar-bottom"><div className="club-card"><div className="club-card-icon"><Icon name="map" size={17} /></div><div><strong>HMT Layout</strong><span>Primary club</span></div><Icon name="chevron" size={15} /></div><button className="nav-item logout" onClick={() => setLoggedIn(false)}><Icon name="logout" /><span>Sign out</span></button></div>
      </aside>
      {mobileMenuOpen && <button className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" />}
      <main className="main-area">
        <header className="topbar"><button className="mobile-menu-button" onClick={() => setMobileMenuOpen(true)}><span /><span /><span /></button><div className="breadcrumb"><span>Workspace</span><Icon name="chevron" size={14} /><strong>{active}</strong></div><div className="top-actions"><div className="search-box"><Icon name="search" size={17} /><input placeholder="Search anything" /></div><div className="notification-wrap"><button className="round-button" onClick={() => setShowNotifications(!showNotifications)}><Icon name="bell" size={19} /><span className="notification-dot" /></button>{showNotifications && <div className="notification-popover"><strong>Notifications</strong><p>Your workout plan for today is ready.</p><small>Just now</small></div>}</div><div className="avatar avatar-top">AK</div></div></header>
        <div className="content"><div className="welcome-row"><div><p className="eyebrow">THURSDAY, 23 AUGUST 2026</p><h1>Good morning, Arjun<span>.</span></h1><p className="welcome-copy">Consistency is the key to your strongest self.</p></div><button className="button button-dark" onClick={() => setActive("Workouts")}><Icon name="play" size={16} /> Start a workout</button></div>
          <section className="hero-card"><div className="hero-content"><div className="live-pill"><span className="live-dot" /> YOU'RE CHECKED IN</div><h2>Make today<br /><em>count.</em></h2><p>Your recommended session is ready. Show up for yourself.</p><button className="button button-lime" onClick={() => setActive("Workouts")}>View today's workout <Icon name="arrow" size={17} /></button></div><div className="hero-decoration"><div className="ring ring-one" /><div className="ring ring-two" /><div className="hero-number">04</div><span>WEEK<br />STREAK</span></div></section>
          <div className="section-heading"><div><p className="eyebrow">YOUR SNAPSHOT</p><h3>Keep the momentum</h3></div><button className="text-button" onClick={() => setActive("Progress")}>View progress <Icon name="arrow" size={16} /></button></div>
          <section className="stats-grid"><StatCard label="Attendance" value="12" suffix="/ 23 days" helper="This month" icon="calendar" tone="lime" /><StatCard label="Current streak" value="04" suffix=" days" helper="Best: 12 days" icon="trend" tone="dark" /><StatCard label="Current weight" value="74.8" suffix=" kg" helper="+0.8 kg this month" icon="dumbbell" tone="light" /><StatCard label="Fitness goal" value="Muscle" suffix=" gain" helper="On track" icon="trend" tone="warm" /></section>
          <div className="dashboard-columns"><section className="panel workout-panel"><div className="panel-heading"><div><p className="eyebrow">RECOMMENDED FOR YOU</p><h3>Upper body strength</h3></div><span className="panel-menu">•••</span></div><div className="workout-meta"><span><Icon name="clock" size={15} /> 52 min</span><span><Icon name="dumbbell" size={15} /> Intermediate</span><span className="meta-accent">Chest + Triceps</span></div><div className="workout-list"><WorkoutRow number="01" name="Barbell bench press" detail="4 sets · 8 reps" /><WorkoutRow number="02" name="Incline dumbbell press" detail="3 sets · 10 reps" /><WorkoutRow number="03" name="Cable tricep pushdown" detail="3 sets · 12 reps" /></div><button className="button button-dark full-button" onClick={() => setActive("Workouts")}>Open workout <Icon name="arrow" size={17} /></button></section><section className="panel attendance-panel"><div className="panel-heading"><div><p className="eyebrow">AUGUST 2026</p><h3>Attendance rhythm</h3></div><button className="round-button small-round" onClick={() => setActive("Attendance")}><Icon name="arrow" size={16} /></button></div><div className="calendar-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div><div className="calendar-grid">{Array.from({ length: 31 }, (_, i) => { const day = i + 1; const attended = [1, 2, 5, 6, 8, 9, 12, 15, 16, 19, 21, 22, 23].includes(day); return <button key={day} className={`calendar-day ${attended ? "attended" : ""} ${day === 23 ? "today" : ""}`}>{day}</button>; })}</div><div className="calendar-footer"><span><i className="legend-dot attended" /> Attended</span><span><i className="legend-dot" /> Rest day</span><strong>13 visits</strong></div></section></div>
          <div className="section-heading recent-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>You're building a habit</h3></div><button className="text-button" onClick={() => setActive("Attendance")}>See all activity <Icon name="arrow" size={16} /></button></div><div className="activity-list"><ActivityItem date="Today, 6:12 PM" title="Checked in at HMT Layout" detail="Session in progress" status="Live now" live /><ActivityItem date="Yesterday, 7:04 AM" title="Upper body strength" detail="52 min · 4 exercises" status="Completed" /><ActivityItem date="Tuesday, 6:48 PM" title="Checked out" detail="58 min session · Great work" status="Completed" /></div>
        </div>
      </main>
    </div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onLogin(); };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      const res = await authSignIn(email, password);
      if ((res as any).error) {
        setError((res as any).error.message || "Sign-in failed");
        return;
      }
      onLogin();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="brand-mark large-mark">BT</div>
        <div>
          <div className="brand-name">BON TON</div>
          <div className="brand-subtitle">FITNESS CLUB</div>
        </div>
      </div>
      <div className="auth-layout">
        <div className="auth-visual">
          <div className="visual-kicker"><span /> BON TON FITNESS <span /></div>
          <h1>Train with<br /><em>purpose.</em></h1>
          <p>Everything you need to build a body and life you're proud of.</p>
          <div className="visual-stats">
            <div><strong>05</strong><span>CLUBS ACROSS<br />BENGALURU</span></div>
            <div><strong>01</strong><span>COMMUNITY.<br />YOUR COMMUNITY.</span></div>
          </div>
          <div className="visual-lines" />
        </div>
        <div className="auth-form-wrap">
          <div className="auth-form">
            <div className="auth-heading">
              <p className="eyebrow">WELCOME BACK</p>
              <h2>{mode === "login" ? "Let's get to work." : "Start your journey."}</h2>
              <p>{mode === "login" ? "Sign in to continue your fitness journey." : "Create your Bon Ton member account."}</p>
            </div>
            <div className="auth-tabs">
              <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Email & password</button>
              <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Phone OTP <span>SOON</span></button>
            </div>
            <form onSubmit={submit}>
              <label>Email address
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" />
              </label>
              <label>Password
                <div className="password-field">
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} required minLength={6} placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button>
                </div>
              </label>
              {mode === "login" && (
                <div className="form-options">
                  <label className="checkbox-label"><input type="checkbox" /> Remember me</label>
                  <button type="button" className="link-button">Forgot password?</button>
                </div>
              )}
              {error && <div className="form-error">{error}</div>}
              <button className="button button-lime auth-submit" type="submit">{mode === "login" ? "Sign in to Bon Ton" : "Create account"} <Icon name="arrow" size={17} /></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix, helper, icon, tone }: { label: string; value: string; suffix: string; helper: string; icon: IconName; tone: "lime" | "dark" | "light" | "warm" }) { return <div className={`stat-card stat-${tone}`}><div className="stat-top"><span>{label}</span><div className="stat-icon"><Icon name={icon} size={17} /></div></div><div className="stat-value">{value}<small>{suffix}</small></div><div className="stat-helper"><span className="helper-dot" />{helper}</div></div>; }
function WorkoutRow({ number, name, detail }: { number: string; name: string; detail: string }) { return <div className="workout-row"><span className="row-number">{number}</span><div><strong>{name}</strong><span>{detail}</span></div><Icon name="chevron" size={16} /></div>; }
function ActivityItem({ date, title, detail, status, live = false }: { date: string; title: string; detail: string; status: string; live?: boolean }) { return <div className="activity-item"><div className={`activity-icon ${live ? "activity-live" : ""}`}>{live ? <span className="live-dot" /> : <Icon name="check" size={16} />}</div><div className="activity-copy"><span>{date}</span><strong>{title}</strong><small>{detail}</small></div><span className={`activity-status ${live ? "status-live" : ""}`}>{status}</span></div>; }

export default App;

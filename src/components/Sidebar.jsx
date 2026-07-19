import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/', label: 'இன்றைய வரிசை', sub: "Today's Queue" },
  { to: '/patients', label: 'நோயாளிகள்', sub: 'Patients' },
  { to: '/billing', label: 'வரவு', sub: 'Billing' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 bg-ink text-cream min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="font-display text-lg tracking-wide">Me &amp; Doctor</div>
        <div className="text-xs text-brass mt-0.5 font-tamil">Clinic OS</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `block rounded px-3 py-2.5 transition-colors ${
                isActive ? 'bg-brass text-ink' : 'hover:bg-white/10 text-cream'
              }`
            }
          >
            <div className="font-tamil text-sm">{l.label}</div>
            <div className="text-[11px] opacity-70">{l.sub}</div>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mx-3 mb-5 text-left text-xs text-cream/60 hover:text-clay px-3 py-2"
      >
        வெளியேறு · Sign out
      </button>
    </aside>
  );
}

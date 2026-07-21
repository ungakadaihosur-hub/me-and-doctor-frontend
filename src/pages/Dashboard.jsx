import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import api from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/api/dashboard').then((res) => setStats(res.data));
  }, []);

  const cards = [
    { label: 'இன்று நோயாளிகள்', sub: "Today's Patients", value: stats?.today_patient_count },
    { label: 'வாக்-இன்', sub: 'Walk-ins', value: stats?.walk_ins_today },
    { label: 'முடிந்த ஆலோசனைகள்', sub: 'Completed Visits', value: stats?.completed_visits_today },
    { label: 'நிலுவை கட்டணம்', sub: 'Pending Payments', value: stats ? `${stats.pending_payments_count} · ₹${stats.pending_payments_amount.toLocaleString('en-IN')}` : undefined },
  ];

  return (
    <div>
      <Header title="டாஷ்போர்டு" subtitle="Doctor Dashboard" />

      <div className="px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 max-w-3xl">
          <div className="chit px-5 py-5">
            <div className="text-xs text-ink-soft uppercase tracking-wide">இன்றைய வரவு</div>
            <div className="token-number text-3xl text-ink mt-1">
              {stats ? `₹${stats.today_revenue.toLocaleString('en-IN')}` : '—'}
            </div>
            <div className="text-[11px] text-ink-soft mt-1">Today's Revenue</div>
          </div>
          {cards.map((c) => (
            <div key={c.sub} className="chit px-5 py-5">
              <div className="text-xs text-ink-soft uppercase tracking-wide">{c.label}</div>
              <div className="token-number text-3xl text-ink mt-1">{c.value ?? '—'}</div>
              <div className="text-[11px] text-ink-soft mt-1">{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div>
            <h2 className="font-display text-lg text-ink mb-3">சமீபத்திய நோயாளிகள் · Recent Patients</h2>
            <div className="space-y-2">
              {(stats?.recent_patients || []).map((p) => (
                <Link key={p.id} to={`/patients/${p.id}`} className="chit flex justify-between px-5 py-3">
                  <span className="text-ink">{p.name}</span>
                  <span className="text-xs text-ink-soft">{p.phone || '—'}</span>
                </Link>
              ))}
              {stats && stats.recent_patients.length === 0 && (
                <p className="text-sm text-ink-soft">இன்னும் நோயாளிகள் இல்லை.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink mb-3">வரும் பின்தொடர்தல் · Upcoming Follow-ups</h2>
            <div className="space-y-2">
              {(stats?.upcoming_follow_ups || []).map((f) => (
                <div key={f.id} className="chit flex justify-between px-5 py-3">
                  <span className="text-ink">{f.patients?.name}</span>
                  <span className="text-xs text-brass-deep">{new Date(f.follow_up_date).toLocaleDateString()}</span>
                </div>
              ))}
              {stats && stats.upcoming_follow_ups.length === 0 && (
                <p className="text-sm text-ink-soft">அடுத்த 7 நாட்களில் பின்தொடர்தல் இல்லை.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-10">
          <Link to="/queue" className="text-sm text-brass-deep hover:text-ink underline underline-offset-2">
            இன்றைய வரிசைக்குச் செல் · Go to Today's Queue →
          </Link>
          <Link to="/reports" className="text-sm text-brass-deep hover:text-ink underline underline-offset-2">
            அறிக்கைகள் · View Reports →
          </Link>
        </div>
      </div>
    </div>
  );
}

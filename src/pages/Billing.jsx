import { useState } from 'react';
import Header from '../components/Header';
import { useBilling } from '../hooks/useClinicData';

export default function Billing() {
  const [range, setRange] = useState('day');
  const { summary } = useBilling(range);

  return (
    <div>
      <Header title="வரவு" subtitle="Billing Summary" />

      <div className="px-8 py-6">
        <div className="flex gap-2 mb-6">
          {[
            { key: 'day', ta: 'இன்று', en: 'Today' },
            { key: 'month', ta: 'இந்த மாதம்', en: 'This Month' },
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-4 py-1.5 rounded text-sm font-medium ${
                range === r.key ? 'bg-ink text-cream' : 'bg-parchment text-ink-soft'
              }`}
            >
              {r.ta} · {r.en}
            </button>
          ))}
        </div>

        {summary && (
          <div className="chit px-8 py-8 max-w-sm mb-8">
            <div className="text-xs text-ink-soft uppercase tracking-wide">Total Collection</div>
            <div className="token-number text-4xl text-ink mt-1">₹{summary.total.toLocaleString('en-IN')}</div>
            <div className="text-xs text-brass-deep mt-2">{summary.count} visits billed</div>
          </div>
        )}

        <div className="space-y-2">
          {summary?.rows.map((row, i) => (
            <div key={i} className="chit flex items-center justify-between px-5 py-3">
              <div className="text-sm text-ink-soft">{new Date(row.created_at).toLocaleString()}</div>
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase text-brass-deep">{row.payment_mode}</span>
                <span className="font-medium text-ink">₹{Number(row.amount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

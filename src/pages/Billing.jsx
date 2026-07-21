import { useState } from 'react';
import Header from '../components/Header';
import { useBilling } from '../hooks/useClinicData';

export default function Billing() {
  const [range, setRange] = useState('day');
  const { summary, markPaid } = useBilling(range);

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
            <div key={i} className="chit px-5 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-ink-soft">{new Date(row.created_at).toLocaleString()}</div>
                  {row.invoice_number && <div className="text-xs text-brass-deep">Invoice #{row.invoice_number}</div>}
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs uppercase font-medium ${row.payment_status === 'paid' ? 'text-sage' : 'text-clay'}`}>
                    {row.payment_status}
                  </span>
                  {row.payment_status === 'pending' && row.id && (
                    <button onClick={() => markPaid(row.id)} className="text-xs text-brass-deep hover:text-ink underline underline-offset-2">
                      Mark Paid
                    </button>
                  )}
                  <span className="text-xs uppercase text-brass-deep">{row.payment_mode}</span>
                  <span className="font-medium text-ink">₹{Number(row.amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
              {row.consultation_fee != null && (
                <div className="mt-1 text-[11px] text-ink-soft">
                  Consultation ₹{row.consultation_fee} + Other ₹{row.other_charges || 0} − Discount ₹{row.discount || 0}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import Header from '../components/Header';
import { useQueue, usePatients } from '../hooks/useClinicData';

const STATUS_LABEL = {
  waiting: { ta: 'காத்திருக்கிறார்', en: 'Waiting', color: 'text-brass-deep' },
  in_consultation: { ta: 'ஆலோசனையில்', en: 'In consultation', color: 'text-ink' },
  done: { ta: 'முடிந்தது', en: 'Done', color: 'text-sage' },
};

const NEXT_STATUS = { waiting: 'in_consultation', in_consultation: 'done', done: 'done' };

export default function Dashboard() {
  const { tokens, issueToken, updateStatus } = useQueue();
  const { patients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState('');

  const handleIssue = async () => {
    await issueToken(selectedPatient || null);
    setSelectedPatient('');
  };

  return (
    <div>
      <Header title="இன்றைய வரிசை" subtitle="Today's Queue" />

      <div className="px-8 py-6">
        <div className="flex gap-3 mb-8">
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="border border-ink/15 rounded px-3 py-2 flex-1 max-w-xs bg-white"
          >
            <option value="">Walk-in (இன்னும் பதிவு செய்யவில்லை)</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={handleIssue}
            className="bg-ink text-cream px-5 py-2 rounded font-medium hover:bg-ink-soft"
          >
            + புதிய டோக்கன் · New Token
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {tokens.length === 0 && (
            <p className="text-ink-soft text-sm col-span-full">
              இன்று இன்னும் யாரும் இல்லை. புதிய டோக்கன் வழங்கத் தொடங்குங்கள்.
            </p>
          )}

          {tokens.map((t) => {
            const status = STATUS_LABEL[t.status];
            return (
              <div key={t.id} className="chit px-5 py-4">
                <div className="flex items-start justify-between">
                  <div className="token-number text-3xl text-ink">{String(t.token_number).padStart(2, '0')}</div>
                  <span className={`text-xs font-medium ${status.color}`}>{status.en}</span>
                </div>
                <div className="mt-2 text-sm text-ink">{t.patients?.name || 'Walk-in'}</div>

                {t.status !== 'done' && (
                  <button
                    onClick={() => updateStatus(t.id, NEXT_STATUS[t.status])}
                    className="mt-4 text-xs font-medium text-brass-deep hover:text-ink underline underline-offset-2"
                  >
                    {t.status === 'waiting' ? 'ஆலோசனை தொடங்கு →' : 'முடிந்தது என குறி →'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { usePatients } from '../hooks/useClinicData';

export default function Patients() {
  const [query, setQuery] = useState('');
  const { patients, addPatient } = usePatients(query);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', age: '', gender: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    await addPatient(form);
    setForm({ name: '', phone: '', age: '', gender: '' });
    setShowForm(false);
  };

  return (
    <div>
      <Header title="நோயாளிகள்" subtitle="Patients" />

      <div className="px-8 py-6">
        <div className="flex gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="பெயர் அல்லது எண் தேடுங்கள் · Search name or phone"
            className="border border-ink/15 rounded px-3 py-2 flex-1 max-w-sm bg-white"
          />
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-ink text-cream px-5 py-2 rounded font-medium hover:bg-ink-soft"
          >
            + புதிய நோயாளி · New Patient
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="chit px-5 py-5 mb-8 max-w-lg grid grid-cols-2 gap-3">
            <input required placeholder="பெயர் · Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-ink/15 rounded px-3 py-2 col-span-2" />
            <input placeholder="Phone" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border border-ink/15 rounded px-3 py-2" />
            <input placeholder="Age" type="number" value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="border border-ink/15 rounded px-3 py-2" />
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="border border-ink/15 rounded px-3 py-2 col-span-2 bg-white">
              <option value="">Gender</option>
              <option value="male">ஆண் · Male</option>
              <option value="female">பெண் · Female</option>
              <option value="other">மற்றவை · Other</option>
            </select>
            <button className="col-span-2 bg-brass text-ink rounded py-2 font-medium hover:bg-brass-deep hover:text-cream">
              சேமி · Save
            </button>
          </form>
        )}

        <div className="space-y-2">
          {patients.map((p) => (
            <Link
              key={p.id}
              to={`/patients/${p.id}`}
              className="chit flex items-center justify-between px-5 py-3 hover:translate-x-0.5 transition-transform"
            >
              <div>
                <div className="text-ink font-medium">{p.name}</div>
                <div className="text-xs text-ink-soft">{p.phone || '—'} {p.age ? `· ${p.age}y` : ''}</div>
              </div>
              <span className="text-brass-deep text-sm">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

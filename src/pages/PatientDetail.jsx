import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { usePatientDetail, useVisits, usePrescriptions } from '../hooks/useClinicData';

export default function PatientDetail() {
  const { id } = useParams();
  const { patient, reload } = usePatientDetail(id);
  const { addVisit } = useVisits(id);
  const { lastRx, createPrescription, sharePrescription } = usePrescriptions(id);

  const [vitals, setVitals] = useState({ bp: '', sugar: '', weight: '' });
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
  const [savedRx, setSavedRx] = useState(null);
  const [saving, setSaving] = useState(false);

  const updateMedicine = (i, field, value) => {
    setMedicines((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));
  };

  const addMedicineRow = () => setMedicines((prev) => [...prev, { name: '', dosage: '', frequency: '', duration: '' }]);

  const repeatLast = () => {
    if (lastRx) setMedicines(lastRx.medicines);
  };

  const handleSaveVisitAndRx = async () => {
    setSaving(true);
    try {
      const visit = await addVisit({ soap_notes: notes, vitals });
      const validMedicines = medicines.filter((m) => m.name.trim());
      let rx = null;
      if (validMedicines.length) {
        rx = await createPrescription(visit.id, validMedicines);
        setSavedRx(rx);
      }
      setNotes('');
      setVitals({ bp: '', sugar: '', weight: '' });
      setMedicines([{ name: '', dosage: '', frequency: '', duration: '' }]);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (savedRx) await sharePrescription(savedRx.id);
  };

  if (!patient) return null;

  return (
    <div>
      <Header title={patient.name} subtitle={`${patient.phone || '—'} · ${patient.age || '—'} y · ${patient.gender || '—'}`} />

      <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timeline */}
        <div>
          <h2 className="font-display text-lg text-ink mb-3">வருகை வரலாறு · Visit Timeline</h2>
          <div className="space-y-3">
            {(patient.recent_visits || []).length === 0 && (
              <p className="text-sm text-ink-soft">முந்தைய வருகைகள் இல்லை.</p>
            )}
            {(patient.recent_visits || []).map((v) => (
              <div key={v.id} className="chit px-5 py-4">
                <div className="text-xs text-brass-deep">{new Date(v.visit_date).toLocaleDateString()}</div>
                {v.soap_notes && <p className="text-sm text-ink mt-1">{v.soap_notes}</p>}
                {v.vitals && (v.vitals.bp || v.vitals.sugar || v.vitals.weight) && (
                  <div className="flex gap-4 mt-2 text-xs text-ink-soft">
                    {v.vitals.bp && <span>BP: {v.vitals.bp}</span>}
                    {v.vitals.sugar && <span>Sugar: {v.vitals.sugar}</span>}
                    {v.vitals.weight && <span>Weight: {v.vitals.weight}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* New visit + prescription */}
        <div>
          <h2 className="font-display text-lg text-ink mb-3">புதிய பரிசோதனை · New Visit</h2>
          <div className="chit px-5 py-5 space-y-4">
            <textarea
              placeholder="குறிப்புகள் · Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
              rows={2}
            />
            <div className="grid grid-cols-3 gap-2">
              <input placeholder="BP" value={vitals.bp} onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                className="border border-ink/15 rounded px-2 py-1.5 text-sm" />
              <input placeholder="Sugar" value={vitals.sugar} onChange={(e) => setVitals({ ...vitals, sugar: e.target.value })}
                className="border border-ink/15 rounded px-2 py-1.5 text-sm" />
              <input placeholder="Weight" value={vitals.weight} onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                className="border border-ink/15 rounded px-2 py-1.5 text-sm" />
            </div>

            <div className="border-t border-ink/10 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ink">மருந்துச் சீட்டு · Prescription</span>
                {lastRx && (
                  <button onClick={repeatLast} type="button" className="text-xs text-brass-deep hover:text-ink underline underline-offset-2">
                    கடந்த சீட்டை மீண்டும் பயன்படுத்து · Repeat last Rx
                  </button>
                )}
              </div>

              {medicines.map((m, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                  <input placeholder="Medicine" value={m.name} onChange={(e) => updateMedicine(i, 'name', e.target.value)}
                    className="border border-ink/15 rounded px-2 py-1.5 text-sm col-span-2" />
                  <input placeholder="Dosage" value={m.dosage} onChange={(e) => updateMedicine(i, 'dosage', e.target.value)}
                    className="border border-ink/15 rounded px-2 py-1.5 text-sm" />
                  <input placeholder="Freq / Days" value={m.frequency} onChange={(e) => updateMedicine(i, 'frequency', e.target.value)}
                    className="border border-ink/15 rounded px-2 py-1.5 text-sm" />
                </div>
              ))}
              <button onClick={addMedicineRow} type="button" className="text-xs text-ink-soft hover:text-ink">
                + மருந்து சேர் · Add medicine
              </button>
            </div>

            <button
              onClick={handleSaveVisitAndRx}
              disabled={saving}
              className="w-full bg-ink text-cream rounded py-2.5 font-medium hover:bg-ink-soft disabled:opacity-50"
            >
              {saving ? 'சேமிக்கிறது...' : 'சேமி · Save Visit'}
            </button>

            {savedRx && (
              <div className="flex gap-3">
                <a href={`${import.meta.env.VITE_API_BASE_URL}/api/prescriptions/${savedRx.id}/pdf`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 text-center border border-ink/15 rounded py-2 text-sm hover:bg-parchment">
                  PDF பார்க்க
                </a>
                <button onClick={handleShare}
                  className="flex-1 bg-brass text-ink rounded py-2 text-sm font-medium hover:bg-brass-deep hover:text-cream">
                  WhatsApp-ல் அனுப்பு
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

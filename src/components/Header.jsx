import { useClinic } from '../hooks/useClinicData';

export default function Header({ title, subtitle }) {
  const { clinic } = useClinic();

  return (
    <header className="flex items-center justify-between px-8 py-6 border-b border-ink/10">
      <div>
        <h1 className="font-display text-2xl text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-ink-soft mt-1">{subtitle}</p>}
      </div>
      {clinic && (
        <div className="text-right">
          <div className="font-display text-sm text-ink">{clinic.clinic_name}</div>
          <div className="text-xs text-ink-soft">
            {clinic.doctor_name}
            {clinic.qualification ? ` · ${clinic.qualification}` : ''}
          </div>
        </div>
      )}
    </header>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('phone'); // phone -> otp
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await sendOtp(phone);
      setStage('otp');
    } catch {
      setError('OTP அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await verifyOtp(phone, otp);
      navigate('/');
    } catch {
      setError('தவறான OTP. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="chit w-full max-w-sm px-8 py-10 mb-4">
        <div className="text-center mb-8">
          <div className="font-display text-2xl text-ink">Me &amp; Doctor</div>
          <div className="font-tamil text-sm text-brass-deep mt-1">Clinic OS</div>
        </div>

        {stage === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs text-ink-soft font-tamil">மொபைல் எண் · Mobile number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98xxxxxxxx"
                className="mt-1 w-full border border-ink/15 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brass"
              />
            </div>
            {error && <p className="text-clay text-xs">{error}</p>}
            <button
              disabled={busy}
              className="w-full bg-ink text-cream rounded py-2.5 font-medium hover:bg-ink-soft disabled:opacity-50"
            >
              OTP அனுப்பு · Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-xs text-ink-soft font-tamil">OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="______"
                className="mt-1 w-full border border-ink/15 rounded px-3 py-2 tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-brass"
              />
            </div>
            {error && <p className="text-clay text-xs">{error}</p>}
            <button
              disabled={busy}
              className="w-full bg-brass text-ink rounded py-2.5 font-medium hover:bg-brass-deep hover:text-cream disabled:opacity-50"
            >
              உள்நுழை · Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

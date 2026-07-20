import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo.png';
export default function Login() {
  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const handlePhoneChange = (e) => {
  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
  setPhone(digitsOnly);
};
  const [otp, setOtp] = useState('');
  const handleOtpChange = (e) => {
  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
  setOtp(digitsOnly);
};
  const [stage, setStage] = useState('phone'); // phone -> otp
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await sendOtp('+91' + phone);
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
      await verifyOtp('+91' + phone, otp);
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
  <img src={logo} alt="Me & Doctor" className="mx-auto w-20 h-20 mb-2" />
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
  inputMode="numeric"
  pattern="[0-9]{10}"
  maxLength={10}
  value={phone}
  onChange={handlePhoneChange}
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
  inputMode="numeric"
  pattern="[0-9]{4}"
  maxLength={4}
  value={otp}
  onChange={handleOtpChange}
  placeholder="____"
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

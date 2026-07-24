import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMsg91Widget } from '../hooks/useMsg91Widget';
import logo from '../assets/logo.png';

export default function Login() {
  const { verifyWidgetToken } = useAuth();
  const { ready, configError, sendOtp, verifyOtp } = useMsg91Widget();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('phone'); // phone -> otp
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleOtpChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(digitsOnly);
  };

  const isPhoneValid = phone.length === 10;
  const isOtpValid = otp.length === 6;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await sendOtp(`91${phone}`);
      setStage('otp');
    } catch (err) {
      console.error('MSG91 sendOtp failed:', err);
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
      const accessToken = await verifyOtp(otp);
      await verifyWidgetToken(accessToken);
      navigate('/');
    } catch (err) {
      console.error('OTP verify / session exchange failed:', err);
      setError('தவறான OTP. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="chit w-full max-w-sm px-8 py-10 mb-4">
        <div className="text-center mb-8">
          <img src={logo} alt="Me & Doctor" className="w-20 h-20 mx-auto mb-3 object-contain" />
          <div className="font-display text-2xl text-ink">Me &amp; Doctor</div>
          <div className="font-tamil text-sm text-brass-deep mt-1">Clinic OS</div>
        </div>

        {configError && <p className="text-clay text-xs mb-4 text-center">{configError}</p>}

        {stage === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs text-ink-soft font-tamil">மொபைல் எண் · Mobile number</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                required
                value={phone}
                onChange={handlePhoneChange}
                placeholder="98xxxxxxxx"
                maxLength={10}
                className="mt-1 w-full border border-ink/15 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brass"
              />
              <div className="text-[11px] text-ink-soft mt-1">{phone.length}/10</div>
            </div>
            {error && <p className="text-clay text-xs">{error}</p>}
            <button
              disabled={busy || !isPhoneValid || !ready}
              className="w-full bg-ink text-cream rounded py-2.5 font-medium hover:bg-ink-soft disabled:opacity-50"
            >
              {ready ? 'OTP அனுப்பு · Send OTP' : 'ஏற்றுகிறது... · Loading...'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-xs text-ink-soft font-tamil">OTP</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                required
                value={otp}
                onChange={handleOtpChange}
                placeholder="______"
                maxLength={6}
                className="mt-1 w-full border border-ink/15 rounded px-3 py-2 tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-brass"
              />
              <div className="text-[11px] text-ink-soft mt-1 text-center">{otp.length}/6</div>
            </div>
            {error && <p className="text-clay text-xs">{error}</p>}
            <button
              disabled={busy || !isOtpValid}
              className="w-full bg-brass text-ink rounded py-2.5 font-medium hover:bg-brass-deep hover:text-cream disabled:opacity-50"
            >
              உள்நுழை · Login
            </button>
          </form>
        )}

        <p className="text-center text-xs text-ink-soft mt-6">
          புதிய கிளினிக்-ஆ? <Link to="/onboarding" className="text-brass-deep underline underline-offset-2">பதிவு செய்யுங்கள்</Link> · New clinic? <Link to="/onboarding" className="text-brass-deep underline underline-offset-2">Register</Link>
        </p>
      </div>
    </div>
  );
}

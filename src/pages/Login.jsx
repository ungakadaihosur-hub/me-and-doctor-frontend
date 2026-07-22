import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo.png';

const WIDGET_ID = import.meta.env.VITE_MSG91_WIDGET_ID;
const TOKEN_AUTH = import.meta.env.VITE_MSG91_TOKEN_AUTH;

export default function Login() {
  const { verifyWidgetToken } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('phone'); // phone -> otp
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const widgetReady = useRef(false);

  // Loads MSG91's widget script once. exposeMethods:true means MSG91's
  // own popup UI never shows — we keep our own "chit"-styled form and
  // just call window.sendOtp / window.verifyOtp ourselves.
  useEffect(() => {
    if (!WIDGET_ID || !TOKEN_AUTH) {
      setError('MSG91 widget-க்கு VITE_MSG91_WIDGET_ID / VITE_MSG91_TOKEN_AUTH env vars set பண்ணவில்லை.');
      return;
    }

    window.configuration = {
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      exposeMethods: true,
      success: () => {},
      failure: () => {},
    };

    const script = document.createElement('script');
    script.src = 'https://verify.msg91.com/otp-provider.js';
    script.onload = () => {
      window.initSendOTP(window.configuration);
      widgetReady.current = true;
    };
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, []);

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const isPhoneValid = phone.length === 10;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await window.sendOtp({ identifier: `91${phone}` });
      setStage('otp');
    } catch (err) {
      console.error('MSG91 sendOtp failed:', err);
      setError('OTP அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setBusy(false);
    }
  };

  const handleOtpChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(digitsOnly);
  };

  const isOtpValid = otp.length === 6;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = await window.verifyOtp(otp);
      // MSG91 returns the access-token in `message` on success — the
      // backend re-verifies this token server-side before trusting it.
      const accessToken = response?.message;
      if (!accessToken) throw new Error('no_access_token');

      await verifyWidgetToken(accessToken);
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
          <img src={logo} alt="Me & Doctor" className="w-20 h-20 mx-auto mb-3 object-contain" />
          <div className="font-display text-2xl text-ink">Me &amp; Doctor</div>
          <div className="font-tamil text-sm text-brass-deep mt-1">Clinic OS</div>
        </div>

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
              disabled={busy || !isPhoneValid}
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
      </div>
    </div>
  );
}

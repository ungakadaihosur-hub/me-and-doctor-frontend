import { useEffect, useRef, useState, useCallback } from 'react';

const WIDGET_ID = import.meta.env.VITE_MSG91_WIDGET_ID;
const TOKEN_AUTH = import.meta.env.VITE_MSG91_TOKEN_AUTH;

/**
 * Loads MSG91's client-side OTP Widget once and exposes send/verify as
 * promises that actually check MSG91's response `type` field — a bug
 * found in the original Login.jsx was that only a thrown exception was
 * treated as failure, so a resolved-but-failed response (type: 'error')
 * was silently treated as success.
 *
 * `ready` is real React state (not a ref that nothing read, which was
 * the other bug found in the audit) — callers should disable their
 * "Send OTP" button until this is true.
 */
export function useMsg91Widget() {
  const [ready, setReady] = useState(false);
  const [configError, setConfigError] = useState(
    !WIDGET_ID || !TOKEN_AUTH
      ? 'MSG91 widget-க்கு VITE_MSG91_WIDGET_ID / VITE_MSG91_TOKEN_AUTH env vars set பண்ணவில்லை.'
      : null
  );
  const scriptRef = useRef(null);

  useEffect(() => {
    if (!WIDGET_ID || !TOKEN_AUTH) return;

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
      setReady(true);
    };
    script.onerror = () => setConfigError('MSG91 widget script load ஆகவில்லை.');
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current) document.body.removeChild(scriptRef.current);
    };
  }, []);

  const sendOtp = useCallback(async (identifier) => {
    const response = await window.sendOtp({ identifier });
    if (response?.type !== 'success') {
      throw new Error(response?.message || 'send_otp_failed');
    }
    return response;
  }, []);

  const verifyOtp = useCallback(async (otp) => {
    const response = await window.verifyOtp(otp);
    if (response?.type !== 'success' || !response?.message) {
      throw new Error(response?.message || 'verify_otp_failed');
    }
    return response.message; // the access-token
  }, []);

  return { ready, configError, sendOtp, verifyOtp };
}

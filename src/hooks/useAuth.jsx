import { createContext, useContext, useState, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [claims, setClaims] = useState(() => {
    const raw = localStorage.getItem('me_and_doctor_claims');
    return raw ? JSON.parse(raw) : null;
  });

  const sendOtp = useCallback(async (phone) => {
    await api.post('/api/auth/send-otp', { phone });
  }, []);

  const verifyOtp = useCallback(async (phone, otp) => {
    const { data } = await api.post('/api/auth/verify-otp', { phone, otp });
    localStorage.setItem('me_and_doctor_token', data.token);
    localStorage.setItem('me_and_doctor_claims', JSON.stringify(data.claims));
    setClaims(data.claims);
  }, []);

  // MSG91 OTP Widget flow: frontend gets an access-token directly from
  // MSG91 after send/verify; this exchanges it for our own session.
  const verifyWidgetToken = useCallback(async (accessToken) => {
    const { data } = await api.post('/api/auth/verify-widget-token', { accessToken });
    localStorage.setItem('me_and_doctor_token', data.token);
    localStorage.setItem('me_and_doctor_claims', JSON.stringify(data.claims));
    setClaims(data.claims);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('me_and_doctor_token');
    localStorage.removeItem('me_and_doctor_claims');
    setClaims(null);
  }, []);

  return (
    <AuthContext.Provider value={{ claims, sendOtp, verifyOtp, verifyWidgetToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

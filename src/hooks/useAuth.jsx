import { createContext, useContext, useState, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'me_and_doctor_token';
const CLAIMS_KEY = 'me_and_doctor_claims';

// Reads the token's exp claim without verifying its signature — this is
// NOT a security check (the client can't verify a signature it doesn't
// have the secret for), it's only used to avoid trusting an obviously
// expired token for UI purposes. The real, non-bypassable check is
// jwt.verify() in requireSession on the backend, on every API call.
function getTokenExpiryMs(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function loadStoredSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawClaims = localStorage.getItem(CLAIMS_KEY);

  if (!token || !rawClaims) {
    // Guards against a partial/mismatched write (e.g. claims present
    // without a token) being treated as a valid session.
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CLAIMS_KEY);
    return null;
  }

  const expiry = getTokenExpiryMs(token);
  if (expiry && Date.now() >= expiry) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CLAIMS_KEY);
    return null;
  }

  try {
    return JSON.parse(rawClaims);
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CLAIMS_KEY);
    return null;
  }
}

function persistSession(data) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(data.claims));
}

export function AuthProvider({ children }) {
  const [claims, setClaims] = useState(loadStoredSession);

  // MSG91 OTP Widget flow: frontend gets an access-token directly from
  // MSG91 after send/verify; this exchanges it for our own session.
  const verifyWidgetToken = useCallback(async (accessToken) => {
    const { data } = await api.post('/api/auth/verify-widget-token', { accessToken });
    persistSession(data);
    setClaims(data.claims);
  }, []);

  // Doctor onboarding: same widget-verified access-token as login, plus
  // the new clinic's details. Creates the clinic + doctor rows and logs
  // the doctor straight in.
  const onboard = useCallback(async (accessToken, clinicDetails) => {
    const { data } = await api.post('/api/auth/onboard', { accessToken, ...clinicDetails });
    persistSession(data);
    setClaims(data.claims);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CLAIMS_KEY);
    setClaims(null);
  }, []);

  return (
    <AuthContext.Provider value={{ claims, verifyWidgetToken, onboard, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

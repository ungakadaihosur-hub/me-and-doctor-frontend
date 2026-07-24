import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';

// Maps Android's hardware/gesture back button to React Router's history,
// and exits the app instead of leaving the user stuck when there's
// nowhere left to go back to. This listener is only ever invoked inside
// the native Android shell — on the web build, Capacitor's App plugin
// never fires 'backButton', so this hook is a safe no-op there.
export function useAndroidBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const listener = CapacitorApp.addListener('backButton', () => {
      if (location.pathname === '/' || location.pathname === '/login') {
        CapacitorApp.exitApp();
      } else {
        navigate(-1);
      }
    });

    return () => {
      listener.then((l) => l.remove());
    };
  }, [navigate, location]);
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { SplashScreen } from '@capacitor/splash-screen';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// No-ops on the web build; on Android this hides the native splash
// screen once React has actually mounted, instead of Capacitor's
// default auto-hide timer which can race ahead of the app being ready.
SplashScreen.hide().catch(() => {});

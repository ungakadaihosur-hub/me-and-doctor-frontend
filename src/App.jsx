import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedLayout from './components/ProtectedLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Billing from './pages/Billing';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/billing" element={<Billing />} />
          </Route>
        </Routes>
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '11px',
            color: '#B8935A',
            background: 'rgba(250,246,238,0.9)',
            padding: '4px 0',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.02em',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        >
          Powered by UNGA KADAI DIGITAL
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

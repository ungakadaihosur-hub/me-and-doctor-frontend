import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './Sidebar';

export default function ProtectedLayout() {
  const { claims } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!claims) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Tap-outside-to-close overlay — mobile only (md:hidden), and
          only rendered while the sidebar is actually open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile-only top bar with hamburger — hidden entirely on
            desktop (md:hidden), so desktop layout is untouched */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-ink/10 bg-cream sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="text-ink p-1 -ml-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="font-display text-sm text-ink">Me &amp; Doctor</span>
        </div>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

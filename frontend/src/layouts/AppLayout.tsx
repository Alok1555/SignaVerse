// ============================================================
// SIGNAVERSE — App Layout (Protected)
// ============================================================

import { Outlet } from 'react-router-dom';
import { SideNav } from '../components/layout/SideNav';
import { BottomNav } from '../components/layout/BottomNav';
import { ToastContainer } from '../components/ui/Toast';
import { CelebrationOverlay } from '../components/animations/CelebrationOverlay';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

export function AppLayout() {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen w-full bg-background">
        {/* Desktop sidebar */}
        <ErrorBoundary fallback={<div className="w-64 shrink-0" style={{ background: 'rgba(15,10,30,0.98)' }} />}>
          <SideNav />
        </ErrorBoundary>

        {/* Main content area */}
        <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <BottomNav />

        {/* Global overlays */}
        <ToastContainer />
        <CelebrationOverlay />
      </div>
    </ErrorBoundary>
  );
}


import React, { useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import './App.css';
import { AuthPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Budget } from './pages/Budget';
import { Itinerary } from './pages/Itinerary';
import { Documents } from './pages/Documents';
import { Profile } from './pages/Profile';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';

const FullPageLoader = () => (
  <div className="min-h-screen bg-stone-50 flex items-center justify-center">
    <div className="text-center">
      <div className="text-5xl mb-4 animate-bounce">🌍</div>
      <p className="text-stone-500 text-sm font-medium">Loading Wandr...</p>
    </div>
  </div>
);

const ProtectedLayout = () => {
  const { state, currentPage, isLoading, navigate } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) return <FullPageLoader />;
  if (!state.user) return <Navigate to="/auth" replace />;

  return (
    <div className="app-shell min-h-screen bg-stone-50 flex">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <header className="mobile-topbar lg:hidden sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-stone-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-sm">
              🌍
            </div>
            <span className="font-display font-bold text-stone-800">Wandr</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-stone-100 text-stone-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </header>

        <div className="app-content flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl w-full mx-auto page-enter">
          <Outlet />
        </div>

        <nav className="mobile-bottom-nav lg:hidden sticky bottom-0 z-20 bg-white border-t border-stone-200 px-2 py-2 flex items-center justify-around">
          {[
            { page: 'dashboard', emoji: '🗺️', label: 'Trips' },
            { page: 'budget', emoji: '💰', label: 'Budget' },
            { page: 'itinerary', emoji: '📅', label: 'Plan' },
            { page: 'documents', emoji: '📁', label: 'Docs' },
            { page: 'profile', emoji: '👤', label: 'Me' },
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                currentPage === item.page ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className={`text-xs font-medium ${currentPage === item.page ? 'text-amber-600' : ''}`}>
                {item.label}
              </span>
              {currentPage === item.page && <span className="w-1 h-1 bg-amber-400 rounded-full" />}
            </button>
          ))}
        </nav>
      </main>

      <ToastContainer />
    </div>
  );
};

const AuthGate = () => {
  const { state, isLoading } = useApp();
  if (isLoading) return <FullPageLoader />;
  if (state.user) return <Navigate to="/" replace />;
  return <AuthPage />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthGate />} />
    <Route path="/" element={<ProtectedLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="budget" element={<Budget />} />
      <Route path="itinerary" element={<Itinerary />} />
      <Route path="documents" element={<Documents />} />
      <Route path="profile" element={<Profile />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

import React from 'react';
import { useApp } from '../context/useApp';
const PlanIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>);
const BudgetIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v2m0 6v2m-3-5h6m-5.5-2.5C9 8.5 10 8 12 8s2.5.5 2.5 1.5c0 2-5 2-5 4 0 1 1 1.5 2.5 1.5s3-.5 3-1.5" strokeLinecap="round"/>
  </svg>);
const ItineraryIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>);
const DocsIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/>
    <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/>
  </svg>);
const ProfileIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>);
const NAV_ITEMS = [
    { page: 'dashboard', label: 'Dashboard', emoji: '🗺️', icon: <PlanIcon /> },
    { page: 'budget', label: 'Budget', emoji: '💰', icon: <BudgetIcon /> },
    { page: 'itinerary', label: 'Itinerary', emoji: '📅', icon: <ItineraryIcon /> },
    { page: 'documents', label: 'Documents', emoji: '📁', icon: <DocsIcon /> },
    { page: 'profile', label: 'Profile', emoji: '👤', icon: <ProfileIcon /> },
];
export const Sidebar = ({ mobileOpen, onMobileClose }) => {
    const { currentPage, navigate, state, logout } = useApp();
    const handleNav = (page) => {
        navigate(page);
        onMobileClose();
    };
    return (<>
      {/* Mobile overlay */}
      {mobileOpen && (<div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onMobileClose}/>)}

      {/* Sidebar */}
      <aside className={`
          fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur border-r border-stone-200 z-40 flex flex-col shadow-xl shadow-stone-200/30
          transition-transform duration-300 lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-lg shadow-sm">
              🌍
            </div>
            <div>
              <span className="font-display text-xl font-bold text-stone-800">Wandr</span>
              <p className="text-stone-400 text-xs">Smart Travel Planner</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => (<button key={item.page} onClick={() => handleNav(item.page)} className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${currentPage === item.page
                ? 'bg-amber-50 text-amber-700 shadow-sm'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'}
              `}>
              <span className={currentPage === item.page ? 'text-amber-500' : 'text-stone-400'}>
                {item.icon}
              </span>
              {item.label}
              {currentPage === item.page && (<span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400"/>)}
            </button>))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-stone-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
              {state.user?.avatar || '👤'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800 truncate">{state.user?.name}</p>
              <p className="text-xs text-stone-400 truncate">{state.user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-stone-500 hover:text-red-500 hover:bg-red-50 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>);
};

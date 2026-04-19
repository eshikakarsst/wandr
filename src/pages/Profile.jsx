import React, { useState, useMemo } from 'react';
import { useApp } from '../context/useApp';
const CURRENCIES = [
    { key: 'INR', label: 'Indian Rupee', symbol: '₹' },
    { key: 'USD', label: 'US Dollar', symbol: '$' },
    { key: 'EUR', label: 'Euro', symbol: '€' },
    { key: 'GBP', label: 'British Pound', symbol: '£' },
    { key: 'JPY', label: 'Japanese Yen', symbol: '¥' },
];
const AVATARS = ['🧳', '🌍', '✈️', '🗺️', '🏖️', '⛰️', '🎒', '🌏', '🚀', '🦅'];
export const Profile = () => {
    const { state, updateUser, logout, getTripStatus, getTripTotalSpent, formatCurrency } = useApp();
    const [name, setName] = useState(state.user?.name || '');
    const [avatar, setAvatar] = useState(state.user?.avatar || '🧳');
    const [currency, setCurrency] = useState(state.user?.currency || 'INR');
    const [editMode, setEditMode] = useState(false);
    const stats = useMemo(() => {
        const trips = state.trips;
        const upcoming = trips.filter(t => getTripStatus(t) === 'upcoming').length;
        const ongoing = trips.filter(t => getTripStatus(t) === 'ongoing').length;
        const completed = trips.filter(t => getTripStatus(t) === 'completed').length;
        const totalBudget = trips.reduce((s, t) => s + t.budget, 0);
        const totalSpent = trips.reduce((s, t) => s + getTripTotalSpent(t.id), 0);
        const totalExpenses = state.expenses.length;
        const totalActivities = state.activities.length;
        const totalDocs = state.documents.length;
        const destinations = [...new Set(trips.map(t => t.destination))].length;
        return { upcoming, ongoing, completed, totalBudget, totalSpent, totalExpenses, totalActivities, totalDocs, destinations, total: trips.length };
    }, [state, getTripStatus, getTripTotalSpent]);
    const handleSave = () => {
        updateUser({ name, avatar, currency });
        setEditMode(false);
    };
    const memberSince = state.user ? new Date(state.user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '';
    return (<div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-stone-800">Profile & Settings</h1>

      {/* Profile card */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-amber-400 to-orange-500"/>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-4xl shadow-md cursor-pointer" title={editMode ? 'Change avatar below' : ''}>
              {avatar}
            </div>
            {!editMode ? (<button onClick={() => setEditMode(true)} className="btn-secondary px-4 py-2 text-sm">
                Edit Profile
              </button>) : (<div className="flex gap-2">
                <button onClick={() => setEditMode(false)} className="btn-secondary px-3 py-2 text-sm">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-primary px-4 py-2 text-sm">
                  Save Changes
                </button>
              </div>)}
          </div>

          {editMode ? (<div className="space-y-4">
              {/* Avatar picker */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-2">Choose Avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {AVATARS.map(av => (<button key={av} type="button" onClick={() => setAvatar(av)} className={`w-10 h-10 rounded-xl text-2xl flex items-center justify-center transition-all ${avatar === av ? 'bg-amber-100 ring-2 ring-amber-400' : 'hover:bg-stone-100'}`}>{av}</button>))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">Display Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="field-input px-3 py-2.5 text-sm"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">Preferred Currency</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CURRENCIES.map(c => (<button key={c.key} type="button" onClick={() => setCurrency(c.key)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${currency === c.key
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                      <span className="font-bold font-mono">{c.symbol}</span>
                      <span>{c.key} — {c.label}</span>
                    </button>))}
                </div>
              </div>
            </div>) : (<div>
              <h2 className="font-display text-xl font-bold text-stone-800">{state.user?.name}</h2>
              <p className="text-stone-500 text-sm">{state.user?.email}</p>
              <p className="text-stone-400 text-xs mt-1">Member since {memberSince}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                  {CURRENCIES.find(c => c.key === state.user?.currency)?.symbol} {state.user?.currency}
                </span>
                <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-medium">
                  🌍 {stats.destinations} destination{stats.destinations !== 1 ? 's' : ''} explored
                </span>
              </div>
            </div>)}
        </div>
      </div>

      {/* Stats grid */}
      <div>
        <h2 className="font-display text-lg font-semibold text-stone-700 mb-3">Your Travel Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Total Trips', value: stats.total, emoji: '🗺️', sub: `${stats.upcoming} upcoming` },
            { label: 'Ongoing', value: stats.ongoing, emoji: '🟢', sub: 'Active right now' },
            { label: 'Completed', value: stats.completed, emoji: '✅', sub: 'Trips finished' },
            { label: 'Total Expenses', value: stats.totalExpenses, emoji: '🧾', sub: formatCurrency(stats.totalSpent) + ' spent' },
            { label: 'Activities Planned', value: stats.totalActivities, emoji: '📍', sub: 'Across all trips' },
            { label: 'Documents Saved', value: stats.totalDocs, emoji: '📁', sub: 'In your vault' },
        ].map(s => (<div key={s.label} className="bg-white border border-stone-200 rounded-xl p-4">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-2xl font-bold font-display text-stone-800">{s.value}</div>
              <div className="text-xs font-semibold text-stone-600 mt-0.5">{s.label}</div>
              <div className="text-xs text-stone-400">{s.sub}</div>
            </div>))}
        </div>
      </div>

      {/* Budget overview */}
      {stats.total > 0 && (<div className="bg-white border border-stone-200 rounded-2xl p-5">
          <h3 className="font-semibold text-stone-700 mb-4">💰 Budget Overview</h3>
          <div className="space-y-3">
            {state.trips.map(trip => {
                const spent = getTripTotalSpent(trip.id);
                const pct = trip.budget > 0 ? Math.min((spent / trip.budget) * 100, 100) : 0;
                const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#10b981';
                const status = getTripStatus(trip);
                return (<div key={trip.id}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span>{trip.coverEmoji}</span>
                      <span className="text-sm font-medium text-stone-700">{trip.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${status === 'upcoming' ? 'bg-amber-100 text-amber-700' :
                        status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-stone-100 text-stone-500'}`}>{status}</span>
                    </div>
                    <span className="text-xs font-mono text-stone-600">
                      {formatCurrency(spent, trip.currency)} / {formatCurrency(trip.budget, trip.currency)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: barColor }}/>
                  </div>
                </div>);
            })}
          </div>
        </div>)}

      {/* Danger zone */}
      <div className="bg-white border border-red-100 rounded-2xl p-5">
        <h3 className="font-semibold text-stone-700 mb-1">Account</h3>
        <p className="text-stone-400 text-sm mb-4">Manage your session</p>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round"/>
          </svg>
          Sign Out
        </button>
      </div>
    </div>);
};

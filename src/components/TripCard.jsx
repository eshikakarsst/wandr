import React from 'react';
import { useApp } from '../context/useApp';
const STATUS_STYLES = {
    upcoming: 'bg-amber-100 text-amber-700',
    ongoing: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-stone-100 text-stone-600',
};
const STATUS_LABELS = {
    upcoming: '✈️ Upcoming',
    ongoing: '🟢 Ongoing',
    completed: '✅ Completed',
};
export const TripCard = ({ trip, onSelect, onEdit, onDelete }) => {
    const { getTripStatus, getTripTotalSpent, formatCurrency, getTripDays } = useApp();
    const status = getTripStatus(trip);
    const spent = getTripTotalSpent(trip.id);
    const pct = trip.budget > 0 ? Math.min((spent / trip.budget) * 100, 100) : 0;
    const days = getTripDays(trip);
    const startFmt = new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const endFmt = new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#10b981';
    return (<div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group hover-lift" onClick={onSelect}>
      {/* Color banner */}
      <div className="h-2 w-full" style={{ background: trip.color }}/>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: trip.color + '20' }}>
              {trip.coverEmoji}
            </div>
            <div>
              <h3 className="font-display font-semibold text-stone-800 text-lg leading-tight">{trip.name}</h3>
              <p className="text-stone-500 text-sm mt-0.5">📍 {trip.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            <button onClick={onEdit} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors" title="Edit">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button onClick={onDelete} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors" title="Delete">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Dates & status */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-stone-500 text-xs font-mono">{startFmt} → {endFmt} • {days}d</p>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[status]}`}>
            {STATUS_LABELS[status]}
          </span>
        </div>

        {/* Budget bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-stone-500">Budget used</span>
            <span className="font-mono font-medium text-stone-700">
              {formatCurrency(spent, trip.currency)} / {formatCurrency(trip.budget, trip.currency)}
            </span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: barColor }}/>
          </div>
          <p className="text-xs text-stone-400 mt-1 text-right">{pct.toFixed(0)}% spent</p>
        </div>
      </div>
    </div>);
};

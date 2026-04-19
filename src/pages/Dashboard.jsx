import React, { useState, useMemo } from 'react';
import { useApp } from '../context/useApp';
import { TripCard } from '../components/TripCard';
import { Modal } from '../components/Modal';
const COLORS = ['#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'];
const EMOJIS = ['🏖️', '⛰️', '🏰', '🗺️', '🌍', '✈️', '🏝️', '🎡', '🌄', '🏕️', '🗼', '🌸'];
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
const emptyForm = () => ({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'INR',
    color: COLORS[0],
    coverEmoji: EMOJIS[0],
    notes: '',
});
export const Dashboard = () => {
    const { state, addTrip, updateTrip, deleteTrip, getTripStatus, formatCurrency, navigate, selectTrip, getTripTotalSpent } = useApp();
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm());
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQ, setSearchQ] = useState('');
    const stats = useMemo(() => {
        const totalBudget = state.trips.reduce((s, t) => s + t.budget, 0);
        const totalSpent = state.trips.reduce((s, t) => s + getTripTotalSpent(t.id), 0);
        const upcoming = state.trips.filter(t => getTripStatus(t) === 'upcoming').length;
        const ongoing = state.trips.filter(t => getTripStatus(t) === 'ongoing').length;
        const completed = state.trips.filter(t => getTripStatus(t) === 'completed').length;
        return { totalBudget, totalSpent, upcoming, ongoing, completed, total: state.trips.length };
    }, [state.trips, getTripStatus, getTripTotalSpent]);
    const filtered = useMemo(() => {
        return state.trips.filter(t => {
            const matchStatus = filterStatus === 'all' || getTripStatus(t) === filterStatus;
            const matchSearch = t.name.toLowerCase().includes(searchQ.toLowerCase()) ||
                t.destination.toLowerCase().includes(searchQ.toLowerCase());
            return matchStatus && matchSearch;
        });
    }, [state.trips, filterStatus, searchQ, getTripStatus]);
    const openAdd = () => { setEditId(null); setForm(emptyForm()); setModalOpen(true); };
    const openEdit = (trip) => {
        setEditId(trip.id);
        setForm({
            name: trip.name,
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
            budget: trip.budget.toString(),
            currency: trip.currency,
            color: trip.color,
            coverEmoji: trip.coverEmoji,
            notes: trip.notes,
        });
        setModalOpen(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: form.name,
            destination: form.destination,
            startDate: form.startDate,
            endDate: form.endDate,
            budget: parseFloat(form.budget) || 0,
            currency: form.currency,
            color: form.color,
            coverEmoji: form.coverEmoji,
            notes: form.notes,
        };
        if (editId) {
            updateTrip(editId, data);
        }
        else {
            addTrip(data);
        }
        setModalOpen(false);
    };
    const handleSelect = (tripId) => {
        selectTrip(tripId);
        navigate('budget');
    };
    const f = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-800">
            Hey, {state.user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-stone-500 mt-1">
            {stats.total === 0 ? "Let's plan your first adventure!" : `You have ${stats.total} trip${stats.total !== 1 ? 's' : ''} planned`}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary px-4 py-2.5 text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
          New Trip
        </button>
      </div>

      {/* Stats */}
      {stats.total > 0 && (<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
                { label: 'Total Trips', value: stats.total, emoji: '🗺️', color: 'text-stone-700' },
                { label: 'Upcoming', value: stats.upcoming, emoji: '✈️', color: 'text-amber-600' },
                { label: 'Ongoing', value: stats.ongoing, emoji: '🟢', color: 'text-emerald-600' },
                { label: 'Completed', value: stats.completed, emoji: '✅', color: 'text-stone-500' },
            ].map(s => (<div key={s.label} className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</div>
              <div className="text-xs text-stone-500 font-medium mt-0.5">{s.label}</div>
            </div>))}
        </div>)}

      {/* Budget overview */}
      {stats.total > 0 && (<div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-amber-100 text-sm font-medium">Total Budget Across Trips</p>
              <p className="text-3xl font-bold font-display mt-1">{formatCurrency(stats.totalSpent)}</p>
              <p className="text-amber-100 text-sm">of {formatCurrency(stats.totalBudget)} total</p>
            </div>
            <div className="text-5xl">💳</div>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${stats.totalBudget > 0 ? Math.min((stats.totalSpent / stats.totalBudget) * 100, 100) : 0}%` }}/>
          </div>
          <p className="text-amber-100 text-xs mt-1.5">
            {stats.totalBudget > 0 ? `${((stats.totalSpent / stats.totalBudget) * 100).toFixed(0)}% of total budget used` : 'No budget set'}
          </p>
        </div>)}

      {/* Filters */}
      {state.trips.length > 0 && (<div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
            </svg>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search trips..." className="field-input pl-10 pr-4 py-2.5 text-sm text-stone-700"/>
          </div>
          <div className="flex gap-1.5 bg-white border border-stone-200 rounded-xl p-1">
            {['all', 'upcoming', 'ongoing', 'completed'].map(s => (<button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterStatus === s
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-stone-500 hover:text-stone-700'}`}>
                {s}
              </button>))}
          </div>
        </div>)}

      {/* Trip grid */}
      {filtered.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(trip => (<TripCard key={trip.id} trip={trip} onSelect={() => handleSelect(trip.id)} onEdit={() => openEdit(trip)} onDelete={() => deleteTrip(trip.id)}/>))}
        </div>) : (<div className="text-center py-20">
          <div className="text-6xl mb-4">{state.trips.length === 0 ? '✈️' : '🔍'}</div>
          <h3 className="font-display text-xl font-semibold text-stone-700 mb-2">
            {state.trips.length === 0 ? 'No trips yet' : 'No trips found'}
          </h3>
          <p className="text-stone-400 text-sm mb-6">
            {state.trips.length === 0
                ? 'Create your first trip to get started!'
                : 'Try a different filter or search term'}
          </p>
          {state.trips.length === 0 && (<button onClick={openAdd} className="btn-primary px-6 py-3">
              + Plan Your First Trip
            </button>)}
        </div>)}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Trip' : 'New Trip'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji & Color */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <label className="block text-xs font-medium text-stone-600 mb-2">Cover</label>
              <div className="grid grid-cols-4 gap-1.5">
                {EMOJIS.map(em => (<button key={em} type="button" onClick={() => setForm(p => ({ ...p, coverEmoji: em }))} className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${form.coverEmoji === em ? 'bg-amber-100 ring-2 ring-amber-400' : 'hover:bg-stone-100'}`}>{em}</button>))}
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">Trip Name *</label>
                <input value={form.name} onChange={f('name')} placeholder="e.g. Goa Beach Escape" required className="field-input px-3 py-2 rounded-lg text-sm"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (<button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))} className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-stone-400 scale-110' : ''}`} style={{ background: c }}/>))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Destination *</label>
            <input value={form.destination} onChange={f('destination')} placeholder="e.g. Goa, India" required className="field-input px-3 py-2 rounded-lg text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Start Date *</label>
              <input type="date" value={form.startDate} onChange={f('startDate')} required className="field-input px-3 py-2 rounded-lg text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">End Date *</label>
              <input type="date" value={form.endDate} onChange={f('endDate')} required min={form.startDate} className="field-input px-3 py-2 rounded-lg text-sm"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Budget</label>
              <input type="number" value={form.budget} onChange={f('budget')} placeholder="0" min="0" className="field-input px-3 py-2 rounded-lg text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Currency</label>
              <select value={form.currency} onChange={f('currency')} className="field-input px-3 py-2 rounded-lg text-sm bg-white">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={f('notes')} rows={2} placeholder="Any special notes..." className="field-input px-3 py-2 rounded-lg text-sm resize-none"/>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 py-2.5 text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm">
              {editId ? 'Save Changes' : 'Create Trip'}
            </button>
          </div>
        </form>
      </Modal>
    </div>);
};

import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/useApp';
import { Modal } from '../components/Modal';
const CATEGORIES = [
    { key: 'flights', label: 'Flights', emoji: '✈️', color: '#3b82f6' },
    { key: 'hotels', label: 'Hotels', emoji: '🏨', color: '#8b5cf6' },
    { key: 'food', label: 'Food', emoji: '🍽️', color: '#f59e0b' },
    { key: 'transport', label: 'Transport', emoji: '🚌', color: '#10b981' },
    { key: 'activities', label: 'Activities', emoji: '🎡', color: '#ec4899' },
    { key: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#f97316' },
    { key: 'visa', label: 'Visa', emoji: '📋', color: '#14b8a6' },
    { key: 'insurance', label: 'Insurance', emoji: '🛡️', color: '#6366f1' },
    { key: 'other', label: 'Other', emoji: '💼', color: '#78716c' },
];
const FALLBACK_CATEGORY = CATEGORIES[CATEGORIES.length - 1];
const emptyForm = () => ({
    title: '',
    amount: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
    notes: '',
});
export const Budget = () => {
    const { state, selectedTripId, selectTrip, addExpense, updateExpense, deleteExpense, formatCurrency, getTripTotalSpent, getTripExpensesByCategory, } = useApp();
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm());
    const [filterCat, setFilterCat] = useState('all');
    const activeTrip = useMemo(() => state.trips.find(t => t.id === selectedTripId) || state.trips[0] || null, [state.trips, selectedTripId]);
    const tripExpenses = useMemo(() => state.expenses.filter(e => e.tripId === (activeTrip?.id ?? '')).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [state.expenses, activeTrip]);
    const categoryBreakdown = useMemo(() => activeTrip ? getTripExpensesByCategory(activeTrip.id) : {}, [activeTrip, getTripExpensesByCategory]);
    const totalSpent = useMemo(() => activeTrip ? getTripTotalSpent(activeTrip.id) : 0, [activeTrip, getTripTotalSpent]);
    const filtered = useMemo(() => filterCat === 'all' ? tripExpenses : tripExpenses.filter(e => e.category === filterCat), [tripExpenses, filterCat]);
    const openAdd = useCallback(() => {
        setEditId(null);
        setForm(emptyForm());
        setModalOpen(true);
    }, []);
    const openEdit = useCallback((exp) => {
        setEditId(exp.id);
        setForm({ title: exp.title, amount: exp.amount.toString(), category: exp.category, date: exp.date, notes: exp.notes });
        setModalOpen(true);
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!activeTrip)
            return;
        const data = {
            tripId: activeTrip.id,
            title: form.title,
            amount: parseFloat(form.amount) || 0,
            category: form.category,
            date: form.date,
            notes: form.notes,
        };
        if (editId)
            updateExpense(editId, data);
        else
            addExpense(data);
        setModalOpen(false);
    };
    const f = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));
    const budget = activeTrip?.budget ?? 0;
    const pct = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
    const remaining = budget - totalSpent;
    const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#10b981';
    if (!activeTrip) {
        return (<div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-6xl mb-4">💰</div>
        <h2 className="font-display text-2xl font-bold text-stone-700 mb-2">No Trips Yet</h2>
        <p className="text-stone-400">Create a trip from the Dashboard to start tracking expenses.</p>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-800">Budget Tracker</h1>
          <p className="text-stone-500 text-sm mt-0.5">Track every rupee, dollar, and euro</p>
        </div>
        <button onClick={openAdd} className="btn-primary px-4 py-2.5 text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
          Add Expense
        </button>
      </div>

      {/* Trip selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {state.trips.map(t => (<button key={t.id} onClick={() => selectTrip(t.id)} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${activeTrip?.id === t.id
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'}`}>
            <span>{t.coverEmoji}</span>
            <span>{t.name}</span>
          </button>))}
      </div>

      {/* Budget overview card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-stone-800">{activeTrip.coverEmoji} {activeTrip.name}</h2>
            <p className="text-stone-400 text-sm">📍 {activeTrip.destination}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-display text-stone-800">{formatCurrency(totalSpent, activeTrip.currency)}</p>
            <p className="text-stone-400 text-sm">of {formatCurrency(budget, activeTrip.currency)}</p>
          </div>
        </div>

        <div className="h-3 bg-stone-100 rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: barColor }}/>
        </div>

        <div className="flex justify-between text-xs text-stone-500">
          <span>{pct.toFixed(0)}% spent</span>
          <span className={remaining < 0 ? 'text-red-500 font-semibold' : 'text-emerald-600 font-semibold'}>
            {remaining >= 0 ? `${formatCurrency(remaining, activeTrip.currency)} remaining` : `${formatCurrency(Math.abs(remaining), activeTrip.currency)} over budget!`}
          </span>
        </div>

        {/* Category breakdown mini-bars */}
        {tripExpenses.length > 0 && (<div className="mt-5 pt-4 border-t border-stone-100">
            <p className="text-xs font-medium text-stone-500 mb-3">Breakdown by Category</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.filter(c => categoryBreakdown[c.key] > 0).map(c => {
                const amt = categoryBreakdown[c.key];
                const catPct = totalSpent > 0 ? (amt / totalSpent) * 100 : 0;
                return (<div key={c.key} className="flex items-center gap-2">
                    <span className="text-base">{c.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-stone-600 truncate">{c.label}</span>
                        <span className="text-stone-500 font-mono ml-1">{catPct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${catPct}%`, background: c.color }}/>
                      </div>
                    </div>
                  </div>);
            })}
            </div>
          </div>)}
      </div>

      {/* Category filter */}
      {tripExpenses.length > 0 && (<div className="flex gap-1.5 overflow-x-auto pb-1">
          <button onClick={() => setFilterCat('all')} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCat === 'all' ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'}`}>
            All ({tripExpenses.length})
          </button>
          {CATEGORIES.filter(c => categoryBreakdown[c.key] > 0).map(c => (<button key={c.key} onClick={() => setFilterCat(c.key)} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCat === c.key ? 'text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'}`} style={filterCat === c.key ? { background: c.color } : {}}>
              {c.emoji} {c.label}
            </button>))}
        </div>)}

      {/* Expense list */}
      {filtered.length > 0 ? (<div className="space-y-2">
          {filtered.map(exp => {
                const cat = CATEGORIES.find(c => c.key === exp.category) || FALLBACK_CATEGORY;
                return (<div key={exp.id} className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-4 hover:border-stone-300 transition-colors group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: cat.color + '20' }}>
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-stone-800 truncate">{exp.title}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: cat.color + '20', color: cat.color }}>
                      {cat.label}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {exp.notes && ` • ${exp.notes}`}
                  </p>
                </div>
                <p className="font-bold font-mono text-stone-800 text-base">{formatCurrency(exp.amount, activeTrip.currency)}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(exp)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button onClick={() => deleteExpense(exp.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="3 6 5 6 21 6" strokeLinecap="round"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round"/>
                      <path d="M10 11v6M14 11v6" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>);
            })}
        </div>) : (<div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="text-5xl mb-3">🧾</div>
          <h3 className="font-display text-lg font-semibold text-stone-600 mb-1">No expenses yet</h3>
          <p className="text-stone-400 text-sm mb-4">Start logging expenses for this trip</p>
          <button onClick={openAdd} className="btn-primary px-5 py-2.5 text-sm">
            + Add First Expense
          </button>
        </div>)}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Expense' : 'Log Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Title *</label>
            <input value={form.title} onChange={f('title')} placeholder="e.g. Hotel booking" required className="field-input px-3 py-2.5 text-sm"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Amount *</label>
              <input type="number" value={form.amount} onChange={f('amount')} placeholder="0" min="0" step="0.01" required className="field-input px-3 py-2.5 text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Category</label>
              <select value={form.category} onChange={f('category')} className="field-input px-3 py-2.5 text-sm bg-white">
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Date</label>
            <input type="date" value={form.date} onChange={f('date')} className="field-input px-3 py-2.5 text-sm"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={f('notes')} rows={2} placeholder="Optional notes..." className="field-input px-3 py-2.5 text-sm resize-none"/>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 py-2.5 text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm">
              {editId ? 'Save Changes' : 'Log Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>);
};

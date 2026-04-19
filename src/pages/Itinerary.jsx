import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/useApp';
import { Modal } from '../components/Modal';
const ACTIVITY_EMOJIS = ['🏖️', '🏔️', '🍽️', '🏨', '🚌', '✈️', '🎡', '🛕', '🏰', '🌄', '🏄', '🎭', '🛍️', '🌊', '⛄', '🎨', '🏕️', '🗼', '🌸', '📸'];
const emptyForm = () => ({
    title: '',
    time: '09:00',
    location: '',
    emoji: '🗺️',
    notes: '',
});
export const Itinerary = () => {
    const { state, selectedTripId, selectTrip, addActivity, updateActivity, deleteActivity, getTripDays, } = useApp();
    const [activeDay, setActiveDay] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm());
    const activeTrip = useMemo(() => state.trips.find(t => t.id === selectedTripId) || state.trips[0] || null, [state.trips, selectedTripId]);
    const totalDays = useMemo(() => (activeTrip ? getTripDays(activeTrip) : 0), [activeTrip, getTripDays]);
    const dayActivities = useMemo(() => state.activities
        .filter(a => a.tripId === (activeTrip?.id ?? '') && a.day === activeDay)
        .sort((a, b) => a.time.localeCompare(b.time)), [state.activities, activeTrip, activeDay]);
    const getDateForDay = useCallback((day) => {
        if (!activeTrip)
            return '';
        const d = new Date(activeTrip.startDate);
        d.setDate(d.getDate() + day - 1);
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    }, [activeTrip]);
    const openAdd = useCallback(() => { setEditId(null); setForm(emptyForm()); setModalOpen(true); }, []);
    const openEdit = useCallback((act) => {
        setEditId(act.id);
        setForm({ title: act.title, time: act.time, location: act.location, emoji: act.emoji, notes: act.notes });
        setModalOpen(true);
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!activeTrip)
            return;
        const data = { tripId: activeTrip.id, day: activeDay, ...form };
        if (editId)
            updateActivity(editId, data);
        else
            addActivity(data);
        setModalOpen(false);
    };
    const f = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));
    if (!activeTrip) {
        return (<div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="font-display text-2xl font-bold text-stone-700 mb-2">No Trips Yet</h2>
        <p className="text-stone-400">Create a trip from the Dashboard to build your itinerary.</p>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-800">Itinerary Builder</h1>
          <p className="text-stone-500 text-sm mt-0.5">Plan every moment of your adventure</p>
        </div>
        <button onClick={openAdd} className="btn-primary px-4 py-2.5 text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
          Add Activity
        </button>
      </div>

      {/* Trip selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {state.trips.map(t => (<button key={t.id} onClick={() => { selectTrip(t.id); setActiveDay(1); }} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${activeTrip?.id === t.id
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'}`}>
            <span>{t.coverEmoji}</span>
            <span>{t.name}</span>
          </button>))}
      </div>

      {/* Trip info banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: activeTrip.color + '20' }}>
          {activeTrip.coverEmoji}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-stone-800">{activeTrip.name}</h2>
          <p className="text-stone-400 text-sm">📍 {activeTrip.destination} • {totalDays} days</p>
        </div>
        <div className="text-right text-sm text-stone-500">
          <p>{new Date(activeTrip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          <p className="text-stone-400 text-xs">to {new Date(activeTrip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
            const acts = state.activities.filter(a => a.tripId === activeTrip.id && a.day === day).length;
            return (<button key={day} onClick={() => setActiveDay(day)} className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl text-sm transition-all border ${activeDay === day
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'}`}>
              <span className="font-semibold">Day {day}</span>
              <span className="text-xs opacity-70 mt-0.5">{getDateForDay(day)}</span>
              {acts > 0 && (<span className={`text-xs mt-1 w-5 h-5 rounded-full flex items-center justify-center ${activeDay === day ? 'bg-amber-400 text-white' : 'bg-stone-200 text-stone-600'}`}>{acts}</span>)}
            </button>);
        })}
      </div>

      {/* Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-700">
            Day {activeDay} — {getDateForDay(activeDay)}
          </h3>
          <span className="text-xs text-stone-400">{dayActivities.length} activities</span>
        </div>

        {dayActivities.length > 0 ? (<div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-stone-200"/>
            <div className="space-y-4">
              {dayActivities.map((act) => (<div key={act.id} className="relative flex gap-4 group">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl z-10 bg-white border-2 border-stone-200 group-hover:border-amber-300 transition-colors" style={{ boxShadow: '0 0 0 4px white' }}>
                    {act.emoji}
                  </div>
                  {/* Content */}
                  <div className="flex-1 bg-white border border-stone-200 rounded-xl p-4 hover:border-stone-300 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-md">{act.time}</span>
                          <h4 className="font-semibold text-stone-800">{act.title}</h4>
                        </div>
                        {act.location && (<p className="text-sm text-stone-500">📍 {act.location}</p>)}
                        {act.notes && (<p className="text-xs text-stone-400 mt-1.5 bg-stone-50 px-3 py-1.5 rounded-lg">{act.notes}</p>)}
                      </div>
                      <div className="flex gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(act)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button onClick={() => deleteActivity(act.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <polyline points="3 6 5 6 21 6" strokeLinecap="round"/>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round"/>
                            <path d="M10 11v6M14 11v6" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>) : (<div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
            <div className="text-5xl mb-3">📍</div>
            <h3 className="font-display text-lg font-semibold text-stone-600 mb-1">No activities for Day {activeDay}</h3>
            <p className="text-stone-400 text-sm mb-4">Plan what you'll do on this day</p>
            <button onClick={openAdd} className="btn-primary px-5 py-2.5 text-sm">
              + Add Activity
            </button>
          </div>)}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Activity' : 'Add Activity'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji picker */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">Activity Icon</label>
            <div className="flex flex-wrap gap-1.5">
              {ACTIVITY_EMOJIS.map(em => (<button key={em} type="button" onClick={() => setForm(p => ({ ...p, emoji: em }))} className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${form.emoji === em ? 'bg-amber-100 ring-2 ring-amber-400' : 'hover:bg-stone-100'}`}>{em}</button>))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Activity Title *</label>
            <input value={form.title} onChange={f('title')} placeholder="e.g. Visit Amber Fort" required className="field-input px-3 py-2.5 text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Time</label>
              <input type="time" value={form.time} onChange={f('time')} className="field-input px-3 py-2.5 text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Location</label>
              <input value={form.location} onChange={f('location')} placeholder="e.g. Amer, Jaipur" className="field-input px-3 py-2.5 text-sm"/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={f('notes')} rows={2} placeholder="Tips, reminders, booking refs..." className="field-input px-3 py-2.5 text-sm resize-none"/>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 py-2.5 text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm">
              {editId ? 'Save Changes' : 'Add Activity'}
            </button>
          </div>
        </form>
      </Modal>
    </div>);
};

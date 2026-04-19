import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useApp } from '../context/useApp';
import { Modal } from '../components/Modal';
const DOC_TYPES = [
    { value: 'passport', label: 'Passport', emoji: '🛂' },
    { value: 'visa', label: 'Visa', emoji: '📋' },
    { value: 'ticket', label: 'Flight/Train Ticket', emoji: '🎫' },
    { value: 'hotel', label: 'Hotel Booking', emoji: '🏨' },
    { value: 'insurance', label: 'Travel Insurance', emoji: '🛡️' },
    { value: 'id', label: 'Government ID', emoji: '🪪' },
    { value: 'itinerary', label: 'Itinerary PDF', emoji: '📄' },
    { value: 'other', label: 'Other', emoji: '📁' },
];
const DEFAULT_CHECKLIST_ITEMS = [
    'Passport valid for 6+ months',
    'Visa obtained',
    'Flight tickets saved',
    'Hotel booking confirmed',
    'Travel insurance purchased',
    'Government ID packed',
    'Emergency contacts noted',
    'Local currency arranged',
    'Vaccinations / health docs',
    'Roaming plan activated',
];
export const Documents = () => {
    const { state, selectedTripId, selectTrip, addDocument, deleteDocument, addChecklistItem, toggleChecklistItem, deleteChecklistItem, showToast, } = useApp();
    const [modalOpen, setModalOpen] = useState(false);
    const [docName, setDocName] = useState('');
    const [docType, setDocType] = useState('other');
    const [fileData, setFileData] = useState({ dataUrl: null, name: '', size: 0 });
    const [newCheckItem, setNewCheckItem] = useState('');
    const [tab, setTab] = useState('docs');
    const fileInputRef = useRef(null);
    const activeTrip = useMemo(() => state.trips.find(t => t.id === selectedTripId) || state.trips[0] || null, [state.trips, selectedTripId]);
    const tripDocs = useMemo(() => state.documents.filter(d => d.tripId === (activeTrip?.id ?? '')), [state.documents, activeTrip]);
    const tripChecklist = useMemo(() => state.checklists.filter(c => c.tripId === (activeTrip?.id ?? '')), [state.checklists, activeTrip]);
    const checkedCount = useMemo(() => tripChecklist.filter(c => c.checked).length, [tripChecklist]);
    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            showToast('File too large (max 5MB)', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setFileData({ dataUrl: reader.result, name: file.name, size: file.size });
        reader.readAsDataURL(file);
        if (!docName)
            setDocName(file.name.replace(/\.[^.]+$/, ''));
    }, [docName, showToast]);
    const handleAddDoc = (e) => {
        e.preventDefault();
        if (!activeTrip || !docName)
            return;
        addDocument({
            tripId: activeTrip.id,
            name: docName,
            type: docType,
            fileDataUrl: fileData.dataUrl,
            fileName: fileData.name,
            fileSize: fileData.size,
        });
        setDocName('');
        setDocType('other');
        setFileData({ dataUrl: null, name: '', size: 0 });
        setModalOpen(false);
    };
    const addDefaultChecklist = () => {
        if (!activeTrip)
            return;
        DEFAULT_CHECKLIST_ITEMS.forEach(label => {
            if (!tripChecklist.find(c => c.label === label)) {
                addChecklistItem({ tripId: activeTrip.id, label, checked: false });
            }
        });
        showToast('Smart checklist loaded! ✅');
    };
    const handleAddCheckItem = (e) => {
        e.preventDefault();
        if (!activeTrip || !newCheckItem.trim())
            return;
        addChecklistItem({ tripId: activeTrip.id, label: newCheckItem.trim(), checked: false });
        setNewCheckItem('');
    };
    const formatFileSize = (bytes) => {
        if (bytes < 1024)
            return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    if (!activeTrip) {
        return (<div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-6xl mb-4">📁</div>
        <h2 className="font-display text-2xl font-bold text-stone-700 mb-2">No Trips Yet</h2>
        <p className="text-stone-400">Create a trip from the Dashboard first.</p>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-800">Document Vault</h1>
          <p className="text-stone-500 text-sm mt-0.5">All your travel docs in one safe place</p>
        </div>
        {tab === 'docs' && (<button onClick={() => setModalOpen(true)} className="btn-primary px-4 py-2.5 text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
            Add Document
          </button>)}
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

      {/* Tabs */}
      <div className="flex bg-stone-100 rounded-xl p-1">
        <button onClick={() => setTab('docs')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${tab === 'docs' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
          📁 Documents
          {tripDocs.length > 0 && <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">{tripDocs.length}</span>}
        </button>
        <button onClick={() => setTab('checklist')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${tab === 'checklist' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
          ✅ Checklist
          {tripChecklist.length > 0 && <span className="bg-emerald-100 text-emerald-700 text-xs px-1.5 py-0.5 rounded-full">{checkedCount}/{tripChecklist.length}</span>}
        </button>
      </div>

      {/* Documents tab */}
      {tab === 'docs' && (<>
          {tripDocs.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {tripDocs.map(doc => {
                    const dtype = DOC_TYPES.find(d => d.value === doc.type) || DOC_TYPES[DOC_TYPES.length - 1];
                    return (<div key={doc.id} className="bg-white border border-stone-200 rounded-xl p-4 hover:border-stone-300 hover:shadow-sm transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-2xl">
                        {dtype.emoji}
                      </div>
                      <button onClick={() => deleteDocument(doc.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <polyline points="3 6 5 6 21 6" strokeLinecap="round"/>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                    <h4 className="font-semibold text-stone-800 text-sm mb-1 truncate">{doc.name}</h4>
                    <p className="text-xs text-stone-400 mb-2">{dtype.label}</p>
                    {doc.fileName && (<p className="text-xs text-stone-400 font-mono truncate">
                        {doc.fileName} {doc.fileSize > 0 && `• ${formatFileSize(doc.fileSize)}`}
                      </p>)}
                    <p className="text-xs text-stone-300 mt-2">
                      Added {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    {doc.fileDataUrl && (<a href={doc.fileDataUrl} download={doc.fileName || doc.name} className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round"/>
                        </svg>
                        Download
                      </a>)}
                  </div>);
                })}
            </div>) : (<div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
              <div className="text-5xl mb-3">📂</div>
              <h3 className="font-display text-lg font-semibold text-stone-600 mb-1">No documents yet</h3>
              <p className="text-stone-400 text-sm mb-4">Upload your passport, tickets, hotel bookings & more</p>
              <button onClick={() => setModalOpen(true)} className="btn-primary px-5 py-2.5 text-sm">
                + Add First Document
              </button>
            </div>)}
        </>)}

      {/* Checklist tab */}
      {tab === 'checklist' && (<div className="space-y-4">
          {/* Progress */}
          {tripChecklist.length > 0 && (<div className="bg-white border border-stone-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-stone-600">Pre-trip Checklist</span>
                <span className="text-sm font-bold text-emerald-600">{checkedCount}/{tripChecklist.length} done</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${tripChecklist.length > 0 ? (checkedCount / tripChecklist.length) * 100 : 0}%` }}/>
              </div>
              {checkedCount === tripChecklist.length && tripChecklist.length > 0 && (<p className="text-xs text-emerald-500 mt-2 font-medium">🎉 All packed! Ready to roll!</p>)}
            </div>)}

          {/* Quick load */}
          {tripChecklist.length === 0 && (<button onClick={addDefaultChecklist} className="w-full py-3 border-2 border-dashed border-amber-300 text-amber-600 text-sm font-medium rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
              ✨ Load Smart Checklist (10 essentials)
            </button>)}

          {/* Add custom */}
          <form onSubmit={handleAddCheckItem} className="flex gap-2">
            <input value={newCheckItem} onChange={e => setNewCheckItem(e.target.value)} placeholder="Add a checklist item..." className="field-input flex-1 px-4 py-2.5 text-sm"/>
            <button type="submit" className="btn-primary px-4 py-2.5 text-sm">
              Add
            </button>
          </form>

          {/* Items */}
          <div className="space-y-2">
            {tripChecklist.map(item => (<div key={item.id} className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 py-3 group hover:border-stone-300 transition-colors">
                <button onClick={() => toggleChecklistItem(item.id)} className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${item.checked
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-stone-300 hover:border-emerald-400'}`}>
                  {item.checked && (<svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>)}
                </button>
                <span className={`flex-1 text-sm ${item.checked ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                  {item.label}
                </span>
                <button onClick={() => deleteChecklistItem(item.id)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>))}
          </div>

          {tripChecklist.length === 0 && (<div className="text-center py-10">
              <p className="text-stone-400 text-sm">No checklist items yet. Add items above or load the smart checklist.</p>
            </div>)}
        </div>)}

      {/* Add Doc Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Document">
        <form onSubmit={handleAddDoc} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Document Name *</label>
            <input value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. My Passport" required className="field-input px-3 py-2.5 text-sm"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Document Type</label>
            <div className="grid grid-cols-2 gap-2">
              {DOC_TYPES.map(d => (<button key={d.value} type="button" onClick={() => setDocType(d.value)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all ${docType === d.value
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                  <span>{d.emoji}</span>
                  <span>{d.label}</span>
                </button>))}
            </div>
          </div>

          {/* File upload */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Upload File (optional, max 5MB)</label>
            <div className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center cursor-pointer hover:border-amber-300 hover:bg-amber-50/30 transition-all" onClick={() => fileInputRef.current?.click()}>
              {fileData.name ? (<div>
                  <div className="text-2xl mb-1">📎</div>
                  <p className="text-sm font-medium text-stone-700">{fileData.name}</p>
                  <p className="text-xs text-stone-400">{formatFileSize(fileData.size)}</p>
                </div>) : (<div>
                  <div className="text-2xl mb-1">☁️</div>
                  <p className="text-sm text-stone-500">Click to upload a file</p>
                  <p className="text-xs text-stone-400 mt-1">PDF, JPG, PNG, etc.</p>
                </div>)}
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.gif,.doc,.docx" onChange={handleFileChange}/>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 py-2.5 text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm">
              Save Document
            </button>
          </div>
        </form>
      </Modal>
    </div>);
};

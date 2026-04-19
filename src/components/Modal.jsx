import React, { useEffect, useRef } from 'react';
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const overlayRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            const canAutoFocus = window.matchMedia('(min-width: 640px) and (hover: hover)').matches;
            if (canAutoFocus) {
                setTimeout(() => {
                    const el = overlayRef.current?.querySelector('input, textarea, select, button');
                    el?.focus();
                }, 50);
            }
            return () => { document.body.style.overflow = previousOverflow; };
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape')
            onClose(); };
        if (isOpen)
            document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const sizeClasses = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };
    return (<div ref={overlayRef} className="fixed inset-0 z-50 flex items-end justify-center p-2 sm:items-center sm:p-4" onClick={(e) => { if (e.target === overlayRef.current)
        onClose(); }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`relative w-full ${sizeClasses[size]} bg-white rounded-t-2xl shadow-2xl animate-modal-in max-h-[90%] sm:max-h-[90vh] sm:rounded-2xl flex flex-col`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-stone-100">
          <h2 id="modal-title" className="font-display text-xl font-semibold text-stone-800">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors" aria-label="Close">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 px-4 py-4 sm:px-6 sm:py-5">{children}</div>
      </div>
    </div>);
};

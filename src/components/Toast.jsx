import React from 'react';
import { useApp } from '../context/useApp';
export const ToastContainer = () => {
    const { toasts } = useApp();
    return (<div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (<div key={toast.id} className={`
            flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
            pointer-events-auto animate-toast-in min-w-[260px] max-w-xs
            ${toast.type === 'success' ? 'bg-emerald-600 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${toast.type === 'info' ? 'bg-stone-700 text-white' : ''}
          `}>
          <span>
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'info' && 'ℹ️'}
          </span>
          <span>{toast.message}</span>
        </div>))}
    </div>);
};

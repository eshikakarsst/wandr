import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/useApp';
import { ToastContainer } from '../components/Toast';

export const AuthPage = () => {
    const { login, signup } = useApp();
    const [mode, setMode] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const emailRef = useRef(null);
    useEffect(() => { emailRef.current?.focus(); }, [mode]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
            }
            else {
                await signup(name, email, password);
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl"/>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-100/40 rounded-full blur-2xl"/>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-200 mb-4 text-3xl">
            🌍
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-800">Wandr</h1>
          <p className="text-stone-500 mt-1 text-sm">Plan smarter. Travel freer.</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-stone-200/50 p-8">
          {/* Tabs */}
          <div className="flex bg-stone-100 rounded-xl p-1 mb-6">
            {['login', 'signup'].map(m => (<button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === m
                ? 'bg-white shadow text-stone-800'
                : 'text-stone-500 hover:text-stone-700'}`}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (<div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Wanderer" className="field-input px-4 py-2.5" required/>
              </div>)}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input ref={emailRef} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="field-input px-4 py-2.5" required/>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'} className="field-input px-4 py-2.5 pr-12" required/>
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? (<span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>) : (mode === 'login' ? '✈️ Sign In' : '🚀 Create Account')}
            </button>
          </form>

          <p className="mt-5 pt-5 border-t border-stone-100 text-xs text-stone-400 text-center">
            Your account data is secured with Firebase Authentication and Firestore.
          </p>
        </div>

        <p className="text-center text-stone-400 text-xs mt-6">
          Built with ☕ and wanderlust • React Course 2029
        </p>
      </div>
      <ToastContainer />
    </div>);
};

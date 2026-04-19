import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { loginWithEmail, logoutUser, onUserChanged, signupWithEmail } from '../services/auth';
import { loadRemoteState, loadUserProfile, saveRemoteState, saveUserProfile } from '../services/firestore';
import { AppContext } from './AppContextValue';
import { isFirebaseConfigured } from '../services/firebase';

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

const PAGE_TO_PATH = {
  dashboard: '/',
  budget: '/budget',
  itinerary: '/itinerary',
  documents: '/documents',
  profile: '/profile',
};

const PATH_TO_PAGE = {
  '/': 'dashboard',
  '/budget': 'budget',
  '/itinerary': 'itinerary',
  '/documents': 'documents',
  '/profile': 'profile',
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const defaultState = {
  user: null,
  trips: [],
  expenses: [],
  activities: [],
  documents: [],
  checklists: [],
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const normalizeRemoteState = (cloudState) => {
  if (!cloudState || typeof cloudState !== 'object') {
    return defaultState;
  }

  return {
    ...defaultState,
    trips: ensureArray(cloudState.trips),
    expenses: ensureArray(cloudState.expenses),
    activities: ensureArray(cloudState.activities),
    documents: ensureArray(cloudState.documents),
    checklists: ensureArray(cloudState.checklists),
  };
};

const normalizeFirebaseUser = (firebaseUser, profile) => ({
  id: firebaseUser.uid,
  name: profile?.name || firebaseUser.displayName || 'Traveler',
  email: firebaseUser.email || '',
  avatar: profile?.avatar || '🧳',
  currency: profile?.currency || 'INR',
  createdAt: profile?.createdAt || new Date().toISOString(),
});

const isOfflineFirestoreError = (error) =>
  error instanceof FirebaseError &&
  (error.code === 'unavailable' || error.message.toLowerCase().includes('client is offline'));

const getAuthErrorMessage = (error, fallback) => {
  if (!(error instanceof FirebaseError)) return fallback;

  const messages = {
    'auth/email-already-in-use': 'Email already in use. Please sign in.',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/invalid-email': 'Enter a valid email address',
    'auth/operation-not-allowed': 'Email/password sign-in is disabled in Firebase.',
    'auth/unauthorized-domain': 'This domain is not allowed in Firebase Authentication.',
    'auth/api-key-not-valid': 'Firebase API key is invalid. Check your deployed env vars.',
    'auth/network-request-failed': 'Network error. Check your connection and Firebase domain settings.',
    'auth/weak-password': 'Password must be at least 6 characters',
  };

  return messages[error.code] || `${fallback} (${error.code})`;
};

export const AppProvider = ({ children }) => {
  const routerNavigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState(defaultState);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [hydratedUid, setHydratedUid] = useState(null);
  const toastTimers = useRef(new Map());

  const currentPage = useMemo(() => PATH_TO_PAGE[location.pathname] || 'dashboard', [location.pathname]);

  const showToast = useCallback((message, type = 'success') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      toastTimers.current.delete(id);
    }, 3500);

    toastTimers.current.set(id, timer);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return undefined;
    }

    const unsubscribe = onUserChanged(
      async (firebaseUser) => {
        if (!firebaseUser) {
          setState(defaultState);
          setHydratedUid(null);
          setIsLoading(false);
          return;
        }

        try {
          const profile = await loadUserProfile(firebaseUser.uid);
          const cloudState = await loadRemoteState(firebaseUser.uid);

          const normalizedUser = normalizeFirebaseUser(firebaseUser, profile);
          const normalizedCloudState = normalizeRemoteState(cloudState);
          const nextState = { ...normalizedCloudState, user: normalizedUser };

          if (!profile) {
            await saveUserProfile(firebaseUser.uid, normalizedUser);
          }

          setState(nextState);
          setHydratedUid(firebaseUser.uid);
        } catch (error) {
          if (isOfflineFirestoreError(error)) {
            showToast('You are offline. Cloud data will load when Firestore is reachable.', 'info');
            setState({ ...defaultState, user: normalizeFirebaseUser(firebaseUser, null) });
            setHydratedUid(null);
          } else {
            console.error('Failed to hydrate cloud state', error);
            showToast('Unable to load your cloud data', 'error');
            setState(defaultState);
            setHydratedUid(null);
          }
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Firebase auth state failed', error);
        showToast('Firebase authentication is unavailable. Check your Firebase API key and Auth settings.', 'error');
        setState(defaultState);
        setHydratedUid(null);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [showToast]);

  useEffect(() => {
    if (!state.user || hydratedUid !== state.user.id) return;

    const payload = {
      trips: state.trips,
      expenses: state.expenses,
      activities: state.activities,
      documents: state.documents,
      checklists: state.checklists,
    };

    saveRemoteState(state.user.id, payload).catch((error) => {
      console.error('Cloud sync failed', error);
    });
  }, [state, hydratedUid]);

  const navigate = useCallback(
    (page) => {
      const nextPath = PAGE_TO_PATH[page] || '/';
      routerNavigate(nextPath);
    },
    [routerNavigate],
  );

  const selectTrip = useCallback((tripId) => setSelectedTripId(tripId), []);

  const login = useCallback(
    async (email, password) => {
      if (!isFirebaseConfigured) {
        showToast('Configure Firebase env vars to enable auth.', 'error');
        return false;
      }
      try {
        await loginWithEmail(email, password);
        routerNavigate('/');
        showToast('Welcome back! 🌍', 'success');
        return true;
      } catch (error) {
        showToast(getAuthErrorMessage(error, 'Login failed. Please try again.'), 'error');
        return false;
      }
    },
    [routerNavigate, showToast],
  );

  const signup = useCallback(
    async (name, email, password) => {
      if (!name || !email || !password) {
        showToast('All fields are required', 'error');
        return false;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return false;
      }

      if (!isFirebaseConfigured) {
        showToast('Configure Firebase env vars to enable auth.', 'error');
        return false;
      }

      try {
        const cred = await signupWithEmail(email, password);
        const newUser = {
          id: cred.user.uid,
          name,
          email,
          avatar: '🧳',
          currency: 'INR',
          createdAt: new Date().toISOString(),
        };

        try {
          await Promise.all([
            saveUserProfile(cred.user.uid, newUser),
            saveRemoteState(cred.user.uid, {
              trips: [],
              expenses: [],
              activities: [],
              documents: [],
              checklists: [],
            }),
          ]);
        } catch (error) {
          console.error('Failed to initialize cloud profile', error);
          showToast('Account created, but cloud data could not be initialized yet.', 'info');
        }

        setState({
          ...defaultState,
          user: newUser,
          trips: [],
          expenses: [],
          activities: [],
          documents: [],
          checklists: [],
        });
        setHydratedUid(cred.user.uid);

        routerNavigate('/');
        showToast(`Welcome to Wandr, ${name}! ✈️`, 'success');
        return true;
      } catch (error) {
        showToast(getAuthErrorMessage(error, 'Signup failed. Please try again.'), 'error');
        return false;
      }
    },
    [routerNavigate, showToast],
  );

  const logout = useCallback(async () => {
    if (isFirebaseConfigured) {
      await logoutUser();
    }
    setState(defaultState);
    setSelectedTripId(null);
    routerNavigate('/auth');
    showToast('Logged out successfully', 'info');
  }, [showToast, routerNavigate]);

  const addTrip = useCallback(
    (trip) => {
      const newTrip = { ...trip, id: generateId(), createdAt: new Date().toISOString() };
      setState((prev) => ({ ...prev, trips: [...prev.trips, newTrip] }));
      showToast(`Trip to ${trip.destination} created! 🗺️`);
    },
    [showToast],
  );

  const updateTrip = useCallback(
    (id, updates) => {
      setState((prev) => ({ ...prev, trips: prev.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)) }));
      showToast('Trip updated successfully');
    },
    [showToast],
  );

  const deleteTrip = useCallback(
    (id) => {
      setState((prev) => ({
        ...prev,
        trips: prev.trips.filter((t) => t.id !== id),
        expenses: prev.expenses.filter((e) => e.tripId !== id),
        activities: prev.activities.filter((a) => a.tripId !== id),
        documents: prev.documents.filter((d) => d.tripId !== id),
        checklists: prev.checklists.filter((c) => c.tripId !== id),
      }));
      showToast('Trip deleted', 'info');
    },
    [showToast],
  );

  const addExpense = useCallback(
    (expense) => {
      const newExp = { ...expense, id: generateId(), createdAt: new Date().toISOString() };
      setState((prev) => ({ ...prev, expenses: [...prev.expenses, newExp] }));
      showToast('Expense logged!');
    },
    [showToast],
  );

  const updateExpense = useCallback(
    (id, updates) => {
      setState((prev) => ({ ...prev, expenses: prev.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)) }));
      showToast('Expense updated');
    },
    [showToast],
  );

  const deleteExpense = useCallback(
    (id) => {
      setState((prev) => ({ ...prev, expenses: prev.expenses.filter((e) => e.id !== id) }));
      showToast('Expense removed', 'info');
    },
    [showToast],
  );

  const addActivity = useCallback(
    (activity) => {
      const newAct = { ...activity, id: generateId(), createdAt: new Date().toISOString() };
      setState((prev) => ({ ...prev, activities: [...prev.activities, newAct] }));
      showToast('Activity added to itinerary!');
    },
    [showToast],
  );

  const updateActivity = useCallback(
    (id, updates) => {
      setState((prev) => ({ ...prev, activities: prev.activities.map((a) => (a.id === id ? { ...a, ...updates } : a)) }));
      showToast('Activity updated');
    },
    [showToast],
  );

  const deleteActivity = useCallback(
    (id) => {
      setState((prev) => ({ ...prev, activities: prev.activities.filter((a) => a.id !== id) }));
      showToast('Activity removed', 'info');
    },
    [showToast],
  );

  const addDocument = useCallback(
    (doc) => {
      const newDoc = { ...doc, id: generateId(), uploadedAt: new Date().toISOString() };
      setState((prev) => ({ ...prev, documents: [...prev.documents, newDoc] }));
      showToast('Document saved to vault!');
    },
    [showToast],
  );

  const deleteDocument = useCallback(
    (id) => {
      setState((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }));
      showToast('Document removed', 'info');
    },
    [showToast],
  );

  const addChecklistItem = useCallback((item) => {
    const newItem = { ...item, id: generateId() };
    setState((prev) => ({ ...prev, checklists: [...prev.checklists, newItem] }));
  }, []);

  const toggleChecklistItem = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      checklists: prev.checklists.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)),
    }));
  }, []);

  const deleteChecklistItem = useCallback((id) => {
    setState((prev) => ({ ...prev, checklists: prev.checklists.filter((c) => c.id !== id) }));
  }, []);

  const updateUser = useCallback(
    (updates) => {
      setState((prev) => {
        if (!prev.user) return prev;
        const updated = { ...prev.user, ...updates };
        saveUserProfile(updated.id, updated).catch((error) => console.error('Failed to save profile', error));
        return { ...prev, user: updated };
      });
      showToast('Profile updated!');
    },
    [showToast],
  );

  const getTripStatus = useCallback((trip) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (today < start) return 'upcoming';
    if (today > end) return 'completed';
    return 'ongoing';
  }, []);

  const getTripTotalSpent = useCallback(
    (tripId) => state.expenses.filter((e) => e.tripId === tripId).reduce((sum, e) => sum + e.amount, 0),
    [state.expenses],
  );

  const getTripExpensesByCategory = useCallback(
    (tripId) => {
      const cats = {
        flights: 0,
        hotels: 0,
        food: 0,
        transport: 0,
        activities: 0,
        shopping: 0,
        visa: 0,
        insurance: 0,
        other: 0,
      };
      state.expenses
        .filter((e) => e.tripId === tripId)
        .forEach((e) => {
          cats[e.category] = (cats[e.category] || 0) + e.amount;
        });
      return cats;
    },
    [state.expenses],
  );

  const getTripDays = useCallback((trip) => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }, []);

  const formatCurrency = useCallback(
    (amount, currency) => {
      const cur = currency || state.user?.currency || 'INR';
      const sym = CURRENCY_SYMBOLS[cur];
      if (cur === 'JPY') return `${sym}${Math.round(amount).toLocaleString()}`;
      return `${sym}${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    },
    [state.user?.currency],
  );

  const value = useMemo(
    () => ({
      state,
      currentPage,
      selectedTripId,
      toasts,
      isLoading,
      navigate,
      selectTrip,
      login,
      signup,
      logout,
      addTrip,
      updateTrip,
      deleteTrip,
      addExpense,
      updateExpense,
      deleteExpense,
      addActivity,
      updateActivity,
      deleteActivity,
      addDocument,
      deleteDocument,
      addChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
      updateUser,
      showToast,
      getTripStatus,
      getTripTotalSpent,
      getTripExpensesByCategory,
      getTripDays,
      formatCurrency,
      generateId,
    }),
    [
      state,
      currentPage,
      selectedTripId,
      toasts,
      isLoading,
      navigate,
      selectTrip,
      login,
      signup,
      logout,
      addTrip,
      updateTrip,
      deleteTrip,
      addExpense,
      updateExpense,
      deleteExpense,
      addActivity,
      updateActivity,
      deleteActivity,
      addDocument,
      deleteDocument,
      addChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
      updateUser,
      showToast,
      getTripStatus,
      getTripTotalSpent,
      getTripExpensesByCategory,
      getTripDays,
      formatCurrency,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const PLACEHOLDER_VALUES = new Set([
  'your_api_key',
  'your_project.firebaseapp.com',
  'your_project_id',
  'your_project.appspot.com',
  'your_sender_id',
  'your_app_id',
]);

const hasRealFirebaseValue = (value) => {
  if (typeof value !== 'string') return false;

  const normalized = value.trim();
  if (!normalized) return false;

  return !PLACEHOLDER_VALUES.has(normalized);
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0 && !PLACEHOLDER_VALUES.has(firebaseConfig.apiKey));

const app = isFirebaseConfigured ? getApps()[0] || initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

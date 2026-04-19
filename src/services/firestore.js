import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const ensureDb = () => {
  if (!db) {
    throw new Error('Firestore is not configured. Add VITE_FIREBASE_* values in .env.');
  }
  return db;
};

const getUserRef = (uid) => doc(ensureDb(), 'users', uid);
const getAppStateRef = (uid) => doc(ensureDb(), 'users', uid, 'app', 'state');

export const saveUserProfile = async (uid, profile) => {
  await setDoc(getUserRef(uid), profile, { merge: true });
};

export const loadUserProfile = async (uid) => {
  const snap = await getDoc(getUserRef(uid));
  return snap.exists() ? snap.data() : null;
};

export const saveRemoteState = async (uid, appState) => {
  await setDoc(getAppStateRef(uid), appState, { merge: true });
};

export const loadRemoteState = async (uid) => {
  const snap = await getDoc(getAppStateRef(uid));
  return snap.exists() ? snap.data() : null;
};

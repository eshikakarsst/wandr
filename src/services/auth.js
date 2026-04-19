import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';

const ensureAuth = () => {
  if (!auth) {
    throw new Error('Firebase auth is not configured. Add VITE_FIREBASE_* values in .env.');
  }
  return auth;
};

export const loginWithEmail = (email, password) => signInWithEmailAndPassword(ensureAuth(), email, password);

export const signupWithEmail = (email, password) => createUserWithEmailAndPassword(ensureAuth(), email, password);

export const logoutUser = () => signOut(ensureAuth());

export const onUserChanged = (callback, onError) => onAuthStateChanged(ensureAuth(), callback, onError);

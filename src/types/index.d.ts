export type TripStatus = 'upcoming' | 'ongoing' | 'completed';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY';
export type ExpenseCategory =
  | 'flights'
  | 'hotels'
  | 'food'
  | 'transport'
  | 'activities'
  | 'shopping'
  | 'visa'
  | 'insurance'
  | 'other';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: Currency;
  color: string;
  coverEmoji: string;
  notes: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  tripId: string;
  day: number;
  time: string;
  title: string;
  location: string;
  emoji: string;
  notes: string;
  createdAt: string;
}

export interface TravelDocument {
  id: string;
  tripId: string;
  name: string;
  type: string;
  fileDataUrl: string | null;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface ChecklistItem {
  id: string;
  tripId: string;
  label: string;
  checked: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currency: Currency;
  createdAt: string;
}

export interface AppState {
  user: User | null;
  trips: Trip[];
  expenses: Expense[];
  activities: Activity[];
  documents: TravelDocument[];
  checklists: ChecklistItem[];
}

export type Page = 'dashboard' | 'budget' | 'itinerary' | 'documents' | 'profile';

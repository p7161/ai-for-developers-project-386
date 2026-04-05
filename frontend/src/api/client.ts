const BASE = '';

export interface Owner {
  id: string;
  name: string;
  bio?: string;
}

export interface EventType {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
}

export interface Slot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface DayAvailability {
  date: string;
  freeSlots: number;
}

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface BookingCreate {
  guestName: string;
  guestEmail: string;
  startTime: string;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const realApi = {
  getOwner: () => request<Owner>('/api/public/owner'),
  getCalendar: (month: string) =>
    request<DayAvailability[]>(`/api/public/calendar?month=${month}`),
  getSlots: (date: string) =>
    request<Slot[]>(`/api/public/slots?date=${date}`),
  createBooking: (data: BookingCreate) =>
    request<Booking>('/api/public/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getBookings: () => request<Booking[]>('/api/bookings'),
};

import { mockApi } from './mock';

// Use mock API by default in development.
// Set VITE_USE_MOCK=false to use the real API (e.g. with Prism or backend).
const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

export const api: typeof realApi = useMock ? mockApi : realApi;

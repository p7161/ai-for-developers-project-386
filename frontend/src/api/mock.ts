import dayjs from 'dayjs';
import type { Owner, DayAvailability, Slot, Booking, BookingCreate } from './client';

const bookings: Booking[] = [];

function generateSlots(date: string): Slot[] {
  const slots: Slot[] = [];
  const baseDate = dayjs(date);
  for (let hour = 9; hour < 13; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const start = baseDate.hour(hour).minute(min).second(0);
      const end = start.add(30, 'minute');
      const booked = bookings.some(
        (b) => b.startTime === start.toISOString(),
      );
      slots.push({
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        available: !booked,
      });
    }
  }
  return slots;
}

function generateCalendar(month: string): DayAvailability[] {
  const start = dayjs(`${month}-01`);
  const daysInMonth = start.daysInMonth();
  const result: DayAvailability[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = start.date(d);
    const dateStr = date.format('YYYY-MM-DD');
    const slots = generateSlots(dateStr);
    const freeSlots = slots.filter((s) => s.available).length;
    result.push({ date: dateStr, freeSlots });
  }
  return result;
}

export const mockApi = {
  getOwner: async (): Promise<Owner> => ({
    id: '1',
    name: 'Calendar Owner',
    bio: 'Book a call with me',
  }),

  getCalendar: async (month: string): Promise<DayAvailability[]> =>
    generateCalendar(month),

  getSlots: async (date: string): Promise<Slot[]> => generateSlots(date),

  createBooking: async (data: BookingCreate): Promise<Booking> => {
    const existing = bookings.find((b) => b.startTime === data.startTime);
    if (existing) {
      throw new Error('Этот слот уже занят');
    }
    const booking: Booking = {
      id: crypto.randomUUID(),
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      startTime: data.startTime,
      endTime: dayjs(data.startTime).add(30, 'minute').toISOString(),
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    return booking;
  },

  getBookings: async (): Promise<Booking[]> =>
    [...bookings].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    ),
};

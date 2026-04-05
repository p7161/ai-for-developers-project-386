import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db.js";

export const publicRouter = Router();

const SLOT_DURATION_MINUTES = 30;
const DAY_START_HOUR = 9;
const DAY_END_HOUR = 17;

const owner = {
  id: "owner-1",
  name: "Alex",
  bio: "Book a call with me!",
};

// Get owner profile
publicRouter.get("/owner", (_req, res) => {
  res.json(owner);
});

// Get free-slot counts per day for a given month
publicRouter.get("/calendar", (req, res) => {
  const { month } = req.query;
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "month query parameter required (YYYY-MM)" });
  }

  const [year, mon] = month.split("-").map(Number);
  const daysInMonth = new Date(year, mon, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(mon).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dateObj = new Date(year, mon - 1, day);

    // Skip past dates
    if (dateObj < today) {
      result.push({ date, freeSlots: 0 });
      continue;
    }

    const now = new Date();
    const isToday = dateObj.getTime() === today.getTime();

    // For today, only count future slots
    const effectiveStart = isToday && now > new Date(year, mon - 1, day, DAY_START_HOUR)
      ? now
      : new Date(year, mon - 1, day, DAY_START_HOUR);

    // Count total available (future) slots
    let totalFutureSlots = 0;
    for (let hour = DAY_START_HOUR; hour < DAY_END_HOUR; hour++) {
      for (let min = 0; min < 60; min += SLOT_DURATION_MINUTES) {
        const slotStart = new Date(year, mon - 1, day, hour, min);
        if (slotStart >= effectiveStart) totalFutureSlots++;
      }
    }

    const dayStart = effectiveStart.toISOString();
    const dayEnd = new Date(year, mon - 1, day, DAY_END_HOUR).toISOString();

    const bookedCount = db
      .prepare("SELECT COUNT(*) as cnt FROM bookings WHERE start_time >= ? AND start_time < ?")
      .get(dayStart, dayEnd).cnt;

    result.push({ date, freeSlots: Math.max(0, totalFutureSlots - bookedCount) });
  }

  res.json(result);
});

// Get 30-minute slots for a specific date
publicRouter.get("/slots", (req, res) => {
  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "date query parameter required (YYYY-MM-DD)" });
  }

  const [year, mon, day] = date.split("-").map(Number);
  const slots = [];

  const now = new Date();

  for (let hour = DAY_START_HOUR; hour < DAY_END_HOUR; hour++) {
    for (let min = 0; min < 60; min += SLOT_DURATION_MINUTES) {
      const startTime = new Date(year, mon - 1, day, hour, min);
      const endTime = new Date(startTime.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);

      // Slot is in the past
      if (startTime < now) {
        slots.push({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          available: false,
        });
        continue;
      }

      const booked = db
        .prepare("SELECT COUNT(*) as cnt FROM bookings WHERE start_time = ?")
        .get(startTime.toISOString()).cnt;

      slots.push({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        available: booked === 0,
      });
    }
  }

  res.json(slots);
});

// Create a booking — 409 if slot already taken
publicRouter.post("/bookings", (req, res) => {
  const { guestName, guestEmail, startTime } = req.body;

  if (!guestName || !guestEmail || !startTime) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "guestName, guestEmail and startTime are required" });
  }

  const start = new Date(startTime);
  const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);

  // Check for overlapping bookings
  const conflict = db
    .prepare("SELECT COUNT(*) as cnt FROM bookings WHERE start_time < ? AND end_time > ?")
    .get(end.toISOString(), start.toISOString()).cnt;

  if (conflict > 0) {
    return res.status(409).json({ code: "SLOT_TAKEN", message: "The selected time slot is already booked" });
  }

  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare("INSERT INTO bookings (id, guest_name, guest_email, start_time, end_time, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(id, guestName, guestEmail, start.toISOString(), end.toISOString(), now);

  res.status(201).json({
    id,
    guestName,
    guestEmail,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    createdAt: now,
  });
});

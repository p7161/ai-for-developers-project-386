import { Router } from "express";
import db from "../db.js";

export const bookingsRouter = Router();

// List upcoming bookings sorted by startTime ascending
bookingsRouter.get("/", (_req, res) => {
  const now = new Date().toISOString();
  const rows = db
    .prepare("SELECT * FROM bookings WHERE start_time >= ? ORDER BY start_time ASC")
    .all(now);

  res.json(rows.map(toBooking));
});

function toBooking(row) {
  return {
    id: row.id,
    guestName: row.guest_name,
    guestEmail: row.guest_email,
    startTime: row.start_time,
    endTime: row.end_time,
    createdAt: row.created_at,
  };
}

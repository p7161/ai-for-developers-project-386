import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db.js";

export const eventTypesRouter = Router();

// List all event types
eventTypesRouter.get("/", (_req, res) => {
  const rows = db.prepare("SELECT * FROM event_types").all();
  res.json(rows.map(toEventType));
});

// Create event type
eventTypesRouter.post("/", (req, res) => {
  const { name, description, durationMinutes } = req.body;

  if (!name || !durationMinutes || durationMinutes < 1) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "name and durationMinutes (>= 1) are required" });
  }

  const id = uuidv4();
  db.prepare("INSERT INTO event_types (id, name, description, duration_minutes) VALUES (?, ?, ?, ?)").run(id, name, description ?? null, durationMinutes);

  res.status(201).json({ id, name, description: description ?? null, durationMinutes });
});

// Get single event type
eventTypesRouter.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM event_types WHERE id = ?").get(req.params.id);
  if (!row) {
    return res.status(404).json({ code: "NOT_FOUND", message: "Event type not found" });
  }
  res.json(toEventType(row));
});

// Update event type
eventTypesRouter.patch("/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM event_types WHERE id = ?").get(req.params.id);
  if (!existing) {
    return res.status(404).json({ code: "NOT_FOUND", message: "Event type not found" });
  }

  const { name, description, durationMinutes } = req.body;
  const updated = {
    name: name ?? existing.name,
    description: description !== undefined ? description : existing.description,
    duration_minutes: durationMinutes ?? existing.duration_minutes,
  };

  if (updated.duration_minutes < 1) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "durationMinutes must be >= 1" });
  }

  db.prepare("UPDATE event_types SET name = ?, description = ?, duration_minutes = ? WHERE id = ?").run(updated.name, updated.description, updated.duration_minutes, req.params.id);

  res.json({ id: req.params.id, name: updated.name, description: updated.description, durationMinutes: updated.duration_minutes });
});

// Delete event type
eventTypesRouter.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM event_types WHERE id = ?").run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ code: "NOT_FOUND", message: "Event type not found" });
  }
  res.status(204).end();
});

function toEventType(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    durationMinutes: row.duration_minutes,
  };
}

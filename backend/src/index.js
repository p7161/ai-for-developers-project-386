import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { eventTypesRouter } from "./routes/eventTypes.js";
import { bookingsRouter } from "./routes/bookings.js";
import { publicRouter } from "./routes/public.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/event-types", eventTypesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/public", publicRouter);

// Serve frontend static files in production
const staticDir = path.join(__dirname, "../../frontend/dist");
app.use(express.static(staticDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

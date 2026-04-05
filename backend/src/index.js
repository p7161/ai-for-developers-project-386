import express from "express";
import cors from "cors";
import { eventTypesRouter } from "./routes/eventTypes.js";
import { bookingsRouter } from "./routes/bookings.js";
import { publicRouter } from "./routes/public.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/event-types", eventTypesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/public", publicRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

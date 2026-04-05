import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi";

using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

@service({
  title: "Call Booking Service",
})
@info({
  version: "1.0.0",
})
@server("http://localhost:3000", "Local development server")
namespace CallBooking;

// ──────────────────────────────────────────────
// Domain models
// ──────────────────────────────────────────────

@doc("Calendar owner profile (single pre-set user, no auth)")
model Owner {
  @doc("Unique owner identifier")
  id: string;

  @doc("Display name")
  name: string;

  @doc("Short bio or tagline")
  bio?: string;
}

@doc("A type of event the owner offers for booking")
model EventType {
  @doc("Unique identifier")
  id: string;

  @doc("Event type name, e.g. 'Quick chat'")
  name: string;

  @doc("Description shown to guests")
  description?: string;

  @doc("Duration in minutes")
  @minValue(1)
  durationMinutes: int32;
}

model EventTypeCreate {
  name: string;
  description?: string;

  @minValue(1)
  durationMinutes: int32;
}

model EventTypeUpdate {
  name?: string;
  description?: string;

  @minValue(1)
  durationMinutes?: int32;
}

@doc("An available 30-minute time slot")
model Slot {
  @doc("Slot start time (ISO 8601)")
  startTime: utcDateTime;

  @doc("Slot end time (ISO 8601)")
  endTime: utcDateTime;

  @doc("Whether the slot is available for booking")
  available: boolean;
}

@doc("Free slot count for a single calendar day")
model DayAvailability {
  @doc("Date (YYYY-MM-DD)")
  date: plainDate;

  @doc("Number of free slots on this day")
  freeSlots: int32;
}

@doc("A confirmed booking made by a guest")
model Booking {
  @doc("Unique booking identifier")
  id: string;

  @doc("Guest name")
  guestName: string;

  @doc("Guest email")
  guestEmail: string;

  @doc("Booking start time (ISO 8601)")
  startTime: utcDateTime;

  @doc("Booking end time (ISO 8601)")
  endTime: utcDateTime;

  @doc("When the booking was created")
  createdAt: utcDateTime;
}

model BookingCreate {
  @doc("Guest display name")
  guestName: string;

  @doc("Guest contact email")
  guestEmail: string;

  @doc("Desired slot start time (ISO 8601)")
  startTime: utcDateTime;
}

@doc("Standard error response")
model ErrorResponse {
  @doc("Machine-readable error code")
  code: string;

  @doc("Human-readable message")
  message: string;
}

// ──────────────────────────────────────────────
// Owner API — manage event types & view bookings
// ──────────────────────────────────────────────

@tag("Owner")
@route("/api/event-types")
namespace EventTypes {
  @doc("List all event types")
  op list(): EventType[];

  @doc("Create a new event type")
  @post
  op create(@body body: EventTypeCreate): {
    @statusCode statusCode: 201;
    @body body: EventType;
  };

  @doc("Get a single event type by id")
  @route("{id}")
  @get
  op read(@path id: string): EventType | {
    @statusCode statusCode: 404;
    @body body: ErrorResponse;
  };

  @doc("Update an event type")
  @route("{id}")
  @patch
  op update(@path id: string, @body body: EventTypeUpdate): EventType | {
    @statusCode statusCode: 404;
    @body body: ErrorResponse;
  };

  @doc("Delete an event type")
  @route("{id}")
  @delete
  op remove(@path id: string): {
    @statusCode statusCode: 204;
  } | {
    @statusCode statusCode: 404;
    @body body: ErrorResponse;
  };
}

@tag("Owner")
@route("/api/bookings")
namespace Bookings {
  @doc("List upcoming bookings sorted by startTime ascending")
  op list(): Booking[];
}

// ──────────────────────────────────────────────
// Guest (public) API
// ──────────────────────────────────────────────

@tag("Guest")
@route("/api/public")
namespace PublicApi {
  @doc("Get owner profile")
  @route("/owner")
  op getOwner(): Owner;

  @doc("Get free-slot counts per day for a given month (for calendar view)")
  @route("/calendar")
  op getCalendar(
    @doc("Year-month to query (YYYY-MM)")
    @query month: string,
  ): DayAvailability[];

  @doc("Get 30-minute slots for a specific date with availability status")
  @route("/slots")
  op getSlots(
    @doc("Date to query slots for (YYYY-MM-DD)")
    @query date: plainDate,
  ): Slot[];

  @doc("Create a booking for a free slot. Returns 409 if the slot is already taken.")
  @route("/bookings")
  @post
  op createBooking(@body body: BookingCreate): {
    @statusCode statusCode: 201;
    @body body: Booking;
  } | {
    @statusCode statusCode: 409;
    @body body: ErrorResponse;
  };
}

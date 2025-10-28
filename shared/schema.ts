import { z } from "zod";

// Schema for itinerary events
export const itineraryEventSchema = z.object({
  date: z.string(), // ISO date string (YYYY-MM-DD)
  event: z.string().min(1, "El evento no puede estar vacío"),
});

export const itinerarySchema = z.object({
  startDate: z.string(), // ISO date string (YYYY-MM-DD)
  events: z.record(z.string(), z.string()), // Record of date -> event text
});

export type ItineraryEvent = z.infer<typeof itineraryEventSchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;

// Constants
export const DAYS_IN_TRIP = 25;
export const NIGHTS_IN_TRIP = 24;

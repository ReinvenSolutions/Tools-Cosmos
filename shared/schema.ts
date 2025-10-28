import { pgTable, varchar, text, json, timestamp, serial, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Drizzle table definition for itineraries
export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull().unique(), // Add unique constraint
  startDate: varchar("start_date", { length: 10 }).notNull(), // YYYY-MM-DD
  events: json("events").$type<Record<string, string>>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas
export const insertItinerarySchema = createInsertSchema(itineraries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const itinerarySchema = z.object({
  startDate: z.string(), // ISO date string (YYYY-MM-DD)
  events: z.record(z.string(), z.string()), // Record of date -> event text
});

// Types
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;
export type SelectItinerary = typeof itineraries.$inferSelect;

// Constants
export const DAYS_IN_TRIP = 25;
export const NIGHTS_IN_TRIP = 24;

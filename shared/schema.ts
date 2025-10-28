import { pgTable, varchar, text, json, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Event categories
export const eventCategories = ["transport", "accommodation", "activity", "food", "other"] as const;
export type EventCategory = typeof eventCategories[number];

// Event with category
export interface EventWithCategory {
  text: string;
  category?: EventCategory;
}

// Day details with notes and budget
export interface DayDetails {
  event?: EventWithCategory;
  notes?: string;
  budget?: number;
}

// Drizzle table definition for itineraries
export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull().unique(),
  startDate: varchar("start_date", { length: 10 }).notNull(), // YYYY-MM-DD
  days: json("days").$type<Record<string, DayDetails>>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas
export const insertItinerarySchema = createInsertSchema(itineraries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const eventWithCategorySchema = z.object({
  text: z.string().min(1, "El evento no puede estar vacío"),
  category: z.enum(eventCategories).optional(),
});

export const dayDetailsSchema = z.object({
  event: eventWithCategorySchema.optional(),
  notes: z.string().optional(),
  budget: z.number().nonnegative().optional(),
});

export const itinerarySchema = z.object({
  startDate: z.string(),
  days: z.record(z.string(), dayDetailsSchema),
});

// Types
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;
export type SelectItinerary = typeof itineraries.$inferSelect;

// Constants
export const DAYS_IN_TRIP = 25;
export const NIGHTS_IN_TRIP = 24;

// Category metadata for UI
export const categoryMetadata: Record<EventCategory, { icon: string; color: string; label: string }> = {
  transport: { icon: "🚗", color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700", label: "Transporte" },
  accommodation: { icon: "🏨", color: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700", label: "Alojamiento" },
  activity: { icon: "🎯", color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700", label: "Actividad" },
  food: { icon: "🍽️", color: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700", label: "Comida" },
  other: { icon: "📋", color: "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700", label: "Otro" },
};

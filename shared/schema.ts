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

// Day details - solo eventos, sin notas ni presupuesto
export interface DayDetails {
  event?: EventWithCategory;
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

// Category metadata - TODAS las etiquetas ahora son VERDES
export const categoryMetadata: Record<EventCategory, { icon: string; color: string; label: string }> = {
  transport: { 
    icon: "🚗", 
    color: "bg-green-600 dark:bg-green-500 text-white border-green-700 dark:border-green-400", 
    label: "Transporte" 
  },
  accommodation: { 
    icon: "🏨", 
    color: "bg-green-600 dark:bg-green-500 text-white border-green-700 dark:border-green-400", 
    label: "Alojamiento" 
  },
  activity: { 
    icon: "🎯", 
    color: "bg-green-600 dark:bg-green-500 text-white border-green-700 dark:border-green-400", 
    label: "Actividad" 
  },
  food: { 
    icon: "🍽️", 
    color: "bg-green-600 dark:bg-green-500 text-white border-green-700 dark:border-green-400", 
    label: "Comida" 
  },
  other: { 
    icon: "📋", 
    color: "bg-green-600 dark:bg-green-500 text-white border-green-700 dark:border-green-400", 
    label: "Otro" 
  },
};

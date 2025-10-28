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

// Category metadata for UI - Colores vibrantes con excelente contraste
export const categoryMetadata: Record<EventCategory, { icon: string; color: string; label: string }> = {
  transport: { 
    icon: "🚗", 
    color: "bg-blue-500 dark:bg-blue-600 text-white border-blue-600 dark:border-blue-500", 
    label: "Transporte" 
  },
  accommodation: { 
    icon: "🏨", 
    color: "bg-purple-500 dark:bg-purple-600 text-white border-purple-600 dark:border-purple-500", 
    label: "Alojamiento" 
  },
  activity: { 
    icon: "🎯", 
    color: "bg-green-500 dark:bg-green-600 text-white border-green-600 dark:border-green-500", 
    label: "Actividad" 
  },
  food: { 
    icon: "🍽️", 
    color: "bg-orange-500 dark:bg-orange-600 text-white border-orange-600 dark:border-orange-500", 
    label: "Comida" 
  },
  other: { 
    icon: "📋", 
    color: "bg-slate-600 dark:bg-slate-500 text-white border-slate-700 dark:border-slate-400", 
    label: "Otro" 
  },
};

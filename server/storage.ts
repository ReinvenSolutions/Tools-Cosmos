import type { Itinerary } from "@shared/schema";
import { db } from "./db";
import { itineraries } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getItinerary(userId: string): Promise<Itinerary | undefined>;
  saveItinerary(userId: string, itinerary: Itinerary): Promise<Itinerary>;
  deleteItinerary(userId: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  async getItinerary(userId: string): Promise<Itinerary | undefined> {
    const result = await db
      .select()
      .from(itineraries)
      .where(eq(itineraries.sessionId, userId))
      .limit(1);

    if (result.length === 0) {
      return undefined;
    }

    const record = result[0];
    return {
      startDate: record.startDate,
      events: record.events as Record<string, string>,
    };
  }

  async saveItinerary(userId: string, itinerary: Itinerary): Promise<Itinerary> {
    // Use upsert (insert with on conflict do update) for atomic operation
    await db
      .insert(itineraries)
      .values({
        sessionId: userId,
        startDate: itinerary.startDate,
        events: itinerary.events,
      })
      .onConflictDoUpdate({
        target: itineraries.sessionId,
        set: {
          startDate: itinerary.startDate,
          events: itinerary.events,
          updatedAt: new Date(),
        },
      });

    return itinerary;
  }

  async deleteItinerary(userId: string): Promise<boolean> {
    await db
      .delete(itineraries)
      .where(eq(itineraries.sessionId, userId));

    return true;
  }
}

export class MemStorage implements IStorage {
  private itineraries: Map<string, Itinerary>;

  constructor() {
    this.itineraries = new Map();
  }

  async getItinerary(userId: string): Promise<Itinerary | undefined> {
    return this.itineraries.get(userId);
  }

  async saveItinerary(userId: string, itinerary: Itinerary): Promise<Itinerary> {
    this.itineraries.set(userId, itinerary);
    return itinerary;
  }

  async deleteItinerary(userId: string): Promise<boolean> {
    return this.itineraries.delete(userId);
  }
}

// Use database storage
export const storage = new DbStorage();

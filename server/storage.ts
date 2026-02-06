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
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return undefined;
    }

    const result = await db
      .select()
      .from(itineraries)
      .where(eq(itineraries.userId, userIdNum))
      .limit(1);

    if (result.length === 0) {
      return undefined;
    }

    const record = result[0];
    return {
      startDate: record.startDate,
      days: record.days as Record<string, any>,
    };
  }

  async saveItinerary(userId: string, itinerary: Itinerary): Promise<Itinerary> {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      throw new Error("Invalid user ID");
    }

    // Check if itinerary exists for this user
    const existing = await db
      .select()
      .from(itineraries)
      .where(eq(itineraries.userId, userIdNum))
      .limit(1);

    if (existing.length > 0) {
      // Update existing itinerary
      await db
        .update(itineraries)
        .set({
          startDate: itinerary.startDate,
          days: itinerary.days,
          updatedAt: new Date(),
        })
        .where(eq(itineraries.userId, userIdNum));
    } else {
      // Insert new itinerary
      await db.insert(itineraries).values({
        userId: userIdNum,
        startDate: itinerary.startDate,
        days: itinerary.days,
      });
    }

    return itinerary;
  }

  async deleteItinerary(userId: string): Promise<boolean> {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return false;
    }

    const result = await db
      .delete(itineraries)
      .where(eq(itineraries.userId, userIdNum));

    // Returns true if at least one row was deleted
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

import type { Itinerary } from "@shared/schema";

export interface IStorage {
  getItinerary(userId: string): Promise<Itinerary | undefined>;
  saveItinerary(userId: string, itinerary: Itinerary): Promise<Itinerary>;
  deleteItinerary(userId: string): Promise<boolean>;
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

export const storage = new MemStorage();

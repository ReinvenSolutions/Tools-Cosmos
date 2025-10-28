import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { itinerarySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get itinerary for current session
  app.get("/api/itinerary", async (req, res) => {
    try {
      const sessionId = req.sessionID || "default";
      const itinerary = await storage.getItinerary(sessionId);
      
      if (!itinerary) {
        // Return default itinerary with today's date
        const today = new Date();
        const todayISO = today.toISOString().split("T")[0];
        const defaultItinerary = {
          startDate: todayISO,
          days: {},
        };
        return res.json(defaultItinerary);
      }
      
      res.json(itinerary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch itinerary" });
    }
  });

  // Save itinerary
  app.post("/api/itinerary", async (req, res) => {
    try {
      const validated = itinerarySchema.parse(req.body);
      const sessionId = req.sessionID || "default";
      
      const saved = await storage.saveItinerary(sessionId, validated);
      res.json(saved);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid itinerary data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to save itinerary" });
    }
  });

  // Delete itinerary
  app.delete("/api/itinerary", async (req, res) => {
    try {
      const sessionId = req.sessionID || "default";
      const deleted = await storage.deleteItinerary(sessionId);
      
      if (!deleted) {
        return res.status(404).json({ error: "No itinerary to delete" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete itinerary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

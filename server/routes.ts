import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { itinerarySchema, insertUserSchema, loginSchema, users } from "@shared/schema";
import { z } from "zod";
import passport from "passport";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "./auth";
import { runMigration } from "./migrate-endpoint";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint - lightweight endpoint for Railway monitoring
  // This doesn't require authentication and returns immediately
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ 
      status: "ok", 
      timestamp: Date.now(),
      uptime: process.uptime()
    });
  });

  // TEMPORARY: Migration endpoint - Remove after running once
  app.get("/api/migrate", async (_req, res) => {
    try {
      const result = await runMigration();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Auth routes
  
  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validated = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, validated.email))
        .limit(1);
      
      if (existingUser) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validated.password, 10);
      
      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email: validated.email,
          password: hashedPassword,
          name: validated.name,
        })
        .returning();
      
      // Auto login after registration
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ error: "Error al iniciar sesión" });
        }
        
        const { password: _, ...userWithoutPassword } = newUser;
        res.json({ user: userWithoutPassword });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Datos inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  });
  
  // Login user
  app.post("/api/auth/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Datos inválidos", details: error.errors });
      }
    }
    
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ error: "Error al iniciar sesión" });
      }
      
      if (!user) {
        return res.status(401).json({ error: info?.message || "Email o contraseña incorrectos" });
      }
      
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Error al iniciar sesión" });
        }
        
        res.json({ user });
      });
    })(req, res, next);
  });
  
  // Logout user
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Error al cerrar sesión" });
      }
      res.json({ success: true });
    });
  });
  
  // Get current user
  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.json({ user: null });
    }
  });
  
  // Protected routes - require authentication
  // Get itinerary for current user
  app.get("/api/itinerary", isAuthenticated, async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const userId = req.user.id.toString();
      const itinerary = await storage.getItinerary(userId);
      
      if (!itinerary) {
        // Return empty itinerary (no default date)
        const defaultItinerary = {
          startDate: "",
          days: {},
        };
        return res.json(defaultItinerary);
      }
      
      res.json(itinerary);
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      res.status(500).json({ error: "Failed to fetch itinerary" });
    }
  });

  // Save itinerary for current user
  app.post("/api/itinerary", isAuthenticated, async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const validated = itinerarySchema.parse(req.body);
      const userId = req.user.id.toString();
      
      const saved = await storage.saveItinerary(userId, validated);
      res.json(saved);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid itinerary data", details: error.errors });
      }
      console.error("Error saving itinerary:", error);
      res.status(500).json({ error: "Failed to save itinerary" });
    }
  });

  // Delete itinerary for current user (deletes from database)
  app.delete("/api/itinerary", isAuthenticated, async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const userId = req.user.id.toString();
      const deleted = await storage.deleteItinerary(userId);
      
      if (!deleted) {
        return res.status(404).json({ error: "No itinerary to delete" });
      }
      
      res.json({ success: true, message: "Itinerario eliminado de la base de datos" });
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      res.status(500).json({ error: "Failed to delete itinerary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

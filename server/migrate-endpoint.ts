import { db } from "./db";
import { sql } from "drizzle-orm";

export async function runMigration() {
  try {
    console.log("🔄 Ejecutando migración inicial...");
    
    // Eliminar tablas existentes (si hay) y recrear
    await db.execute(sql`
      DROP TABLE IF EXISTS "itineraries" CASCADE;
      DROP TABLE IF EXISTS "users" CASCADE;
    `);
    
    // Crear tabla de usuarios
    await db.execute(sql`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    // Crear tabla de itinerarios
    await db.execute(sql`
      CREATE TABLE "itineraries" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "start_date" VARCHAR(10) NOT NULL,
        "days" JSON NOT NULL DEFAULT '{}'::json,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        CONSTRAINT "unique_user_itinerary" UNIQUE ("user_id")
      );
    `);
    
    // Crear índice
    await db.execute(sql`
      CREATE INDEX "idx_itineraries_user_id" ON "itineraries"("user_id");
    `);
    
    console.log("✅ Migración completada exitosamente!");
    return { success: true, message: "Tablas creadas exitosamente" };
    
  } catch (error: any) {
    console.error("❌ Error en migración:", error);
    return { success: false, error: error.message };
  }
}

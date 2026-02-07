-- Migration: Initial Schema
-- Fecha: 2026-02-06
-- Descripción: Crea las tablas users e itineraries desde cero

-- IMPORTANTE: Esto eliminará tablas existentes
DROP TABLE IF EXISTS "itineraries" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Crear tabla de usuarios
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Crear tabla de itinerarios
CREATE TABLE "itineraries" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "start_date" VARCHAR(10) NOT NULL,
  "days" JSON NOT NULL DEFAULT '{}'::json,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "unique_user_itinerary" UNIQUE ("user_id")
);

-- Crear índice para mejorar performance en queries por userId
CREATE INDEX "idx_itineraries_user_id" ON "itineraries"("user_id");

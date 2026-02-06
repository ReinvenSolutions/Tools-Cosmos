# Migración de Base de Datos: sessionId → userId

## ⚠️ IMPORTANTE - Lee esto antes de ejecutar

Esta migración cambia la estructura de la tabla `itineraries` para vincular los datos al **usuario autenticado** en lugar de la **sesión**.

### Cambios:
- ❌ **ELIMINA** la columna `session_id`
- ✅ **AGREGA** la columna `user_id` con foreign key a `users`
- ⚠️ **BORRA** todos los itinerarios existentes (no se pueden mapear)

### ¿Por qué se borran los datos?

No hay forma de saber qué usuario creó cada itinerario antiguo, porque estaban vinculados a `sessionId` temporal, no a un `userId` permanente.

## Cómo Ejecutar la Migración

### Opción 1: Usando Drizzle Kit (Recomendado)

```bash
# 1. Pushear los cambios del schema a la base de datos
npm run db:push
```

Drizzle detectará los cambios automáticamente y actualizará la base de datos.

### Opción 2: Ejecutar SQL Manualmente

Si prefieres ejecutar el SQL directamente:

```bash
# Conectarse a la base de datos
psql $DATABASE_URL

# Copiar y pegar el contenido de 0001_migrate_to_user_id.sql
```

O usando la Railway CLI:

```bash
# Si tienes Railway CLI instalado
railway connect postgres

# Luego ejecuta el SQL
\i migrations/0001_migrate_to_user_id.sql
```

## Verificar que Funcionó

Después de ejecutar la migración, verifica:

```sql
-- Ver la estructura de la tabla
\d itineraries

-- Debería mostrar:
-- - user_id (integer, NOT NULL, FK to users)
-- - NO debería estar session_id
```

## Después de la Migración

1. **Los usuarios deberán recrear sus itinerarios** (datos anteriores se perdieron)
2. **Cada usuario tendrá sus propios datos aislados**
3. **El borrado será permanente** de la base de datos
4. **Los datos persistirán** incluso si la sesión expira

## Rollback (Revertir cambios)

Si necesitas volver atrás:

```sql
-- SOLO si necesitas revertir (NO recomendado)
ALTER TABLE itineraries DROP COLUMN user_id;
ALTER TABLE itineraries ADD COLUMN session_id VARCHAR(255) NOT NULL UNIQUE;
```

Pero esto NO recuperará los datos perdidos.

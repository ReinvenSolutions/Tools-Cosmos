# Deployment en Railway

## Optimizaciones para Railway

Esta aplicación está optimizada para Railway con las siguientes características:

- **Consumo reducido de CPU**: Solo procesa requests cuando hay actividad
- **Graceful shutdown**: Cierre ordenado cuando Railway detiene el servicio
- **Health checks ligeros**: Endpoint `/api/health` para monitoreo sin carga
- **Timeouts configurados**: Previene conexiones colgadas y reduce uso de memoria
- **Sesiones optimizadas**: Configuración de cookies y sesiones para mínimo overhead

## Variables de Entorno Requeridas

Configura las siguientes variables de entorno en Railway:

### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_EVgsBi91wCxR@ep-blue-poetry-ad6edf9b-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. SESSION_SECRET
Genera una clave secreta aleatoria. Puedes usar:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
O usa cualquier string aleatorio y seguro.

### 3. PORT (Opcional)
Railway lo configura automáticamente, pero puedes especificar:
```
3000
```

### 4. NODE_ENV
```
production
```

## Pasos para configurar en Railway

### Configuración Inicial

1. Ve a tu proyecto en Railway
2. Haz clic en tu servicio
3. Ve a la pestaña "Variables"
4. Agrega cada variable mencionada arriba
5. Haz un nuevo deploy o Railway lo hará automáticamente

### Migración de Base de Datos (Importante)

⚠️ **ANTES del primer deploy en producción**, ejecuta la migración para actualizar la estructura de la base de datos:

**Opción 1: Usando Drizzle (Recomendado)**
```bash
npm run db:push
```

**Opción 2: SQL Manual en Neon Database**
1. Ve a tu dashboard de Neon (https://neon.tech)
2. Abre la consola SQL de tu base de datos
3. Copia y pega el contenido de `migrations/0001_migrate_to_user_id.sql`
4. Ejecuta

**¿Por qué esta migración?**
- Vincula los itinerarios al **usuario** en lugar de la **sesión**
- Cada usuario tiene sus propios datos aislados
- Los datos persisten incluso si la sesión expira
- El borrado es permanente de la base de datos

Ver `migrations/README_MIGRATION.md` para más detalles.

## Optimizaciones Implementadas

### 1. Configuración de Railway
- `railway.json`: Configuración específica con healthcheck en `/api/health`
- `nixpacks.toml`: Build optimizado con npm ci para instalación rápida

### 2. Optimizaciones del Servidor
- **HTTP Timeouts**: 
  - keepAliveTimeout: 65s (compatible con Railway load balancer)
  - requestTimeout: 30s (previene requests colgados)
  - headersTimeout: 66s
- **Max Connections**: Limitado a 1000 conexiones simultáneas
- **Graceful Shutdown**: Cierre ordenado en SIGTERM/SIGINT
- **Sesiones optimizadas**: Reducido a 7 días y solo se crean cuando se usan

### 3. Reducción de Overhead
- Header `x-powered-by` deshabilitado
- Health check súper ligero (solo retorna JSON pequeño)
- Sesiones solo se crean cuando hay datos para guardar

## Verificación

Después de configurar las variables:
- El endpoint `/api/health` debería responder con `{"status":"ok"}` 
- El endpoint `/api/itinerary` debería responder con código 200
- Las etiquetas y eventos deberían guardarse correctamente
- No deberías ver errores 500 en la consola del navegador

## Comportamiento de Sleep en Railway

Railway automáticamente "duerme" los servicios después de 5 minutos de inactividad (en el plan gratuito):
- Cuando no hay requests, la app se detiene automáticamente
- Railway detecta el primer request y "despierta" la aplicación (cold start ~10-15 segundos)
- Con las optimizaciones implementadas, el cold start es más rápido
- El health check `/api/health` es súper ligero y no genera carga innecesaria

## Monitoreo de Recursos

Para verificar el consumo de recursos en Railway:
1. Ve a tu proyecto en Railway
2. Haz clic en "Metrics"
3. Verifica:
   - CPU usage debería ser muy bajo cuando no hay usuarios
   - Memory usage debería ser estable (~100-200 MB)
   - El servicio debería entrar en "sleep" después de 5 min sin actividad

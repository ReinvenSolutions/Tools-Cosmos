# Módulo de Herramientas Cosmos

Aplicación web unificada que contiene múltiples herramientas para la gestión de viajes y servicios de Tomas Cosmos.

## Herramientas Disponibles

### 1. Contador de Días
Calculadora de itinerarios de 25 días / 24 noches con gestión de eventos por día.

**Características:**
- Selección de fecha de inicio
- Vista de calendario interactivo
- Gestión de eventos por día
- 🔒 **Datos aislados por usuario** (cada usuario ve solo sus datos)
- 💾 **Persistencia real** en base de datos PostgreSQL
- 🗑️ **Borrado permanente** de datos
- Tema claro/oscuro
- Guardado automático

**Ruta:** `/contador` o `/`

**Seguridad:**
- ✅ Requiere autenticación
- ✅ Datos vinculados a usuario específico
- ✅ Foreign keys con CASCADE delete

### 2. Cotizador de Millas
Calculadora de cotizaciones para vuelos con millas Avianca LifeMiles.

**Características:**
- Cálculo automático de valor en COP
- Soporte para vuelos de ida y ida-vuelta
- Múltiples pasajeros (1-9)
- Gestión de CLB (Cancelable)
- Precios personalizados por cliente (7 clientes)
- Generación automática de mensajes de cotización
- Copiar al portapapeles

**Ruta:** `/cotizador`

## Estructura del Proyecto

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Componentes de shadcn/ui
│   │   │   ├── calendar-picker.tsx
│   │   │   ├── date-range-display.tsx
│   │   │   ├── day-item.tsx
│   │   │   ├── summary-panel.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── timeline.tsx
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Utilidades
│   │   ├── pages/
│   │   │   ├── home.tsx         # Contador de Días
│   │   │   ├── dashboard.tsx    # Cotizador de Millas
│   │   │   └── not-found.tsx
│   │   ├── App.tsx              # Layout principal con sidebar
│   │   └── main.tsx
│   └── index.html
├── server/
│   ├── db.ts                    # Configuración de base de datos
│   ├── index.ts                 # Servidor Express
│   ├── routes.ts                # API endpoints
│   └── storage.ts               # Lógica de almacenamiento
└── shared/
    └── schema.ts                # Schemas de base de datos
```

## Navegación

La aplicación cuenta con un **sidebar** que permite navegar entre las herramientas:

- **Contador de Días** (icono de calendario)
- **Cotizador de Millas** (icono de avión)

El sidebar incluye:
- Logo de "Cosmos Tools"
- Menú de navegación
- Toggle de tema (claro/oscuro)
- Se puede colapsar con `Cmd/Ctrl + B`

## Tecnologías Utilizadas

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Wouter (routing)
  - Radix UI / shadcn/ui
  - TanStack Query
  - date-fns

- **Backend:**
  - Node.js
  - Express
  - Drizzle ORM
  - PostgreSQL (via Neon)

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar base de datos (crear archivo .env)
# DATABASE_URL=postgresql://...
# SESSION_SECRET=<genera-uno-aleatorio>

# Push del schema a la base de datos
npm run db:push

# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

**⚠️ Importante:** Si actualizas desde una versión anterior, ejecuta la migración:
```bash
npm run db:push
```
Ver `migrations/README_MIGRATION.md` para más detalles.

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción (con minificación)
- `npm start` - Iniciar servidor en producción
- `npm run check` - Verificar tipos de TypeScript
- `npm run db:push` - Actualizar schema de base de datos
- `npm run health` - Verificar health check del servidor

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://usuario:contraseña@host/database
SESSION_SECRET=tu-secret-key-aqui
NODE_ENV=development
PORT=5000
```

Ver `.env.example` para más detalles.

## Deployment en Railway

Esta aplicación está **optimizada para Railway** con las siguientes características:

### ✨ Optimizaciones Implementadas
- **Consumo CPU reducido**: <1% en idle, solo se activa con usuarios
- **Sleep mode automático**: Se duerme después de 5 minutos sin actividad
- **Graceful shutdown**: Cierre ordenado y seguro
- **Health checks ligeros**: Endpoint `/api/health` para monitoreo
- **Build optimizado**: Código minificado y bundle pequeño

### 📋 Archivos de Configuración
- `railway.json` - Configuración de Railway
- `nixpacks.toml` - Build configuration
- `.dockerignore` - Archivos excluidos del deploy

### 🚀 Cómo deployar

1. **Conecta tu repositorio a Railway**
2. **Configura las variables de entorno**:
   - `DATABASE_URL` - Connection string de PostgreSQL (Neon recomendado)
   - `SESSION_SECRET` - Clave secreta aleatoria
   - `NODE_ENV=production` (Railway lo hace automáticamente)

3. **Railway detectará automáticamente** los archivos de configuración y hará el build

### 📚 Documentación Detallada
- **Guía completa**: Ver `OPTIMIZACIONES_RAILWAY.md`
- **Configuración**: Ver `RAILWAY_CONFIG.md`
- **Deployment básico**: Ver `DEPLOYMENT.md`

### 🎯 Resultados Esperados
- Cold start: ~10-15 segundos
- Requests normales: <100ms
- CPU en idle: <1%
- Memoria: ~100-150 MB
- **Costo en idle: $0** (modo sleep)

## Clientes del Cotizador

El cotizador maneja precios personalizados para 7 clientes:

1. **MAFARA** - CLB: $320,000
2. **SIN FRONTERAS** - CLB: $320,000
3. **ARMA TU VIAJE** - CLB: $250,000
4. **CONEXION** - CLB: $260,000
5. **JUAN CARLOS** - CLB: $300,000
6. **CIKIS** - CLB: $260,000
7. **AURITOURS** - CLB: $400,000

## Tarifas de Conversión

**Cotizador de Millas:**
- 1,000 Millas = $16.90 USD
- 1 USD = $3,900 COP
- CLB Cancelable = $170,000 COP (costo)

## Cambios Recientes

### v1.1.0 - Aislamiento por Usuario + Optimizaciones Railway

**Nuevas características:**
- 🔒 Datos aislados por usuario (no se mezclan entre usuarios)
- 💾 Persistencia real en base de datos (no depende de sesión)
- 🗑️ Borrado permanente funcional
- ⚡ Optimizado para Railway (sleep mode, <1% CPU idle)
- 🏥 Health check endpoint (`/api/health`)

**Archivos de guía:**
- `GUIA_RAPIDA_CAMBIOS.md` - Empieza aquí (15 min)
- `CAMBIOS_AISLAMIENTO_USUARIOS.md` - Cambios técnicos detallados
- `OPTIMIZACIONES_RAILWAY.md` - Optimizaciones completas
- `migrations/README_MIGRATION.md` - Guía de migración de DB

## Autor

Desarrollado para **Tomas Cosmos**

---

© 2026 Cosmos Tools - Todos los derechos reservados

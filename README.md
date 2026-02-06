# Módulo de Herramientas Cosmos

Aplicación web unificada que contiene múltiples herramientas para la gestión de viajes y servicios de Tomas Cosmos.

## Herramientas Disponibles

### 1. Contador de Días
Calculadora de itinerarios de 25 días / 24 noches con gestión de eventos por día.

**Características:**
- Selección de fecha de inicio
- Vista de calendario interactivo
- Gestión de eventos por día
- Guardado automático en base de datos
- Tema claro/oscuro

**Ruta:** `/contador` o `/`

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

# Push del schema a la base de datos
npm run db:push

# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm start` - Iniciar servidor en producción
- `npm run check` - Verificar tipos de TypeScript
- `npm run db:push` - Actualizar schema de base de datos

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://usuario:contraseña@host/database
NODE_ENV=development
```

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

## Autor

Desarrollado para **Tomas Cosmos**

---

© 2026 Cosmos Tools - Todos los derechos reservados

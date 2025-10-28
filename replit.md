# Travel Itinerary Calculator - 25 Day COSMOS Trip Planner

## Overview

This is a web application for planning a 25-day travel itinerary (COSMOS trip). Users can select a start date via an interactive calendar, view a detailed timeline of all 25 days, and add/edit custom events for each day. The application features a responsive design with light/dark theme support and persists itinerary data to allow users to continue planning across sessions.

**Core Purpose**: Provide an intuitive, visual way to plan and organize a 25-day trip with day-by-day event tracking.

**Key Features**:
- Interactive calendar date picker (Flatpickr integration)
- 25-day timeline view with customizable events
- Real-time date range calculation
- Trip summary (total days/nights)
- Persistent storage of itinerary data
- Dark/light theme switching
- Mobile-responsive layout

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript

**Build Tool**: Vite for fast development and optimized production builds

**Routing**: Wouter for lightweight client-side routing

**UI Component Library**: Shadcn/ui (Radix UI primitives) with Tailwind CSS
- Design system follows Material Design principles with custom enhancements
- Extensive use of Radix UI components for accessibility
- Custom theme system supporting light/dark modes with CSS variables

**State Management**:
- React Query (@tanstack/react-query) for server state management and caching
- Local React hooks for UI state
- Custom hooks pattern (`use-itinerary`, `use-theme`, `use-mobile`)

**Styling Approach**:
- Tailwind CSS utility-first framework
- CSS custom properties for theming
- Design tokens defined in `index.css` and `tailwind.config.ts`
- Typography: Inter font family via Google Fonts

**Key Libraries**:
- Flatpickr for calendar date picking with Spanish localization
- date-fns for date manipulation
- react-hook-form with zod for form validation
- Embla Carousel for potential carousel functionality

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Pattern**: RESTful JSON API
- GET `/api/itinerary` - Fetch current session's itinerary
- POST `/api/itinerary` - Save/update itinerary
- DELETE `/api/itinerary` - Clear itinerary

**Session Management**: Express sessions with session ID tracking for user isolation

**Data Validation**: Zod schemas for runtime type validation
- Shared schema definitions between client and server (`shared/schema.ts`)
- Validates itinerary structure: start date and events record

**Development Setup**:
- Vite middleware integration in development mode
- Hot module replacement (HMR) support
- Custom error overlay for runtime errors (Replit plugins)

### Data Storage Solutions

**Current Implementation**: In-memory storage (MemStorage class)
- Simple Map-based storage keyed by session ID
- Data persists only during server runtime
- Suitable for development and single-server deployments

**Database Ready**: Architecture prepared for PostgreSQL integration
- Drizzle ORM configured with PostgreSQL dialect
- Schema definitions ready in `shared/schema.ts`
- Migration system configured via `drizzle.config.ts`
- @neondatabase/serverless package included for serverless Postgres

**Data Model**:
```typescript
Itinerary {
  startDate: string (ISO date YYYY-MM-DD)
  events: Record<string, string> (dateKey -> event text)
}
```

**Design Decision**: Started with in-memory storage for simplicity and rapid prototyping. The storage interface (IStorage) abstracts the implementation, allowing easy swap to database persistence without changing business logic.

### External Dependencies

**Third-Party UI Libraries**:
- Radix UI component primitives (@radix-ui/*) - Accessible, unstyled UI components
- Flatpickr - Calendar/date picker with inline mode support
- Lucide React - Icon library

**Styling & Design**:
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority - Type-safe variant system
- clsx & tailwind-merge - Conditional className utilities

**Data & Forms**:
- Zod - Schema validation library
- React Hook Form - Form state management
- @hookform/resolvers - Zod integration for forms

**State Management**:
- TanStack Query (React Query) - Server state management, caching, and synchronization

**Database (Configured)**:
- Drizzle ORM - TypeScript ORM
- @neondatabase/serverless - Serverless PostgreSQL client
- drizzle-zod - Generate Zod schemas from Drizzle tables

**Build & Development Tools**:
- Vite - Frontend build tool and dev server
- esbuild - JavaScript bundler for server code
- TypeScript - Type safety across the stack
- @replit/vite-plugin-* - Replit-specific development enhancements

**Date Handling**:
- date-fns - Modern date utility library

**Utilities**:
- nanoid - Unique ID generation
- connect-pg-simple - PostgreSQL session store (for future use)

**Rationale**: Dependencies chosen for:
1. Developer experience (TypeScript, type-safe components)
2. Accessibility (Radix UI primitives)
3. Performance (Vite, React Query caching)
4. Design system consistency (Tailwind + shadcn/ui)
5. Future scalability (Database-ready with Drizzle ORM)

## Recent Changes

### October 28, 2025 - UI Improvements & Simplification

**Latest Changes:**
- ✅ Removed notes and budget features (simplified to events only)
- ✅ Event tags now all GREEN regardless of category for maximum visibility
- ✅ Event tags repositioned INLINE with dates (appearing before the date)
- ✅ Significantly improved dark mode contrast:
  - Foreground text: 96% lightness (much brighter)
  - Muted text: 80% lightness (much more readable)
  - Background: 10% lightness (darker for better contrast)
  - Card backgrounds: 14% lightness (better separation)
- ✅ Event tags use bright green (bg-green-600 dark:bg-green-500) with white text
- ✅ Larger, more visible event badges with better shadow and padding
- ✅ Flatpickr calendar fully styled for dark mode:
  - All text elements (days, months, year) are white/light colored
  - Month dropdown selector has proper dark background and light text
  - Navigation arrows are visible and properly styled
  - Selected dates use primary color with high contrast
- ✅ Title updated to "Calculadora de Días Cosmos" with "(25 Días)" on separate line
- ✅ Clear itinerary button now works instantly without confirmation dialog
- ✅ **Optimistic updates implemented**: Event saving is now INSTANTANEOUS
  - UI updates immediately when saving/editing/deleting events
  - No waiting for server response
  - Automatic rollback on errors

**Design Decisions:**
- All event tags are green to maintain visual consistency
- Tags appear BEFORE the date for better visual hierarchy
- Dark mode now has excellent text contrast for readability across all components
- Removed unnecessary complexity (notes/budget) per user request
- Instant clear action improves user experience by reducing friction
- Optimistic updates for instantaneous UI feedback (saves occur in background)

### October 28, 2025 - MVP Completed

**Features Implemented:**
- ✅ Full React frontend with professional Material Design approach
- ✅ Interactive Flatpickr calendar with Spanish localization
- ✅ Timeline component displaying all 25 days with dates and weekdays
- ✅ Weekend highlighting (visual distinction for Saturdays/Sundays)
- ✅ Inline event management system (add/edit/delete events per day)
- ✅ Complete dark/light mode theming with toggle button
- ✅ Responsive design (2-column desktop, stacked mobile)
- ✅ Express backend API with full CRUD endpoints
- ✅ React Query integration for data persistence
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Loading states with skeleton loaders
- ✅ Saving indicators during mutations
- ✅ Error handling with toast notifications
- ✅ Custom Flatpickr styles for both themes
- ✅ Test IDs on all interactive elements

**Technical Highlights:**
- React Query with global queryFn configuration
- PostgreSQL storage with atomic upserts
- Zod validation on all API endpoints
- Type-safe schema sharing between frontend/backend
- Hover states and animations following design guidelines
# Maranatha SDA Church Website

## Overview

A church community web application for Maranatha Seventh-day Adventist Church. The platform manages service programs (orders of worship), events, and announcements. It features a public-facing site for congregation members to view upcoming services and events, plus a password-protected admin dashboard for church staff to manage content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Fonts**: Playfair Display (headings) + Lato (body text) - warm, welcoming aesthetic

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints under `/api/*`
- **Validation**: Zod schemas for request/response validation
- **Build Tool**: esbuild for server bundling, Vite for client

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client/server)
- **Migrations**: Drizzle Kit with `db:push` command
- **Type Safety**: `drizzle-zod` generates Zod schemas from database tables

### Data Models
1. **Events**: Church events with title, description, date, location, optional image
2. **Announcements**: News items with title, content, auto-dated
3. **Service Programs**: Worship service orders (title, date, theme)
4. **Program Items**: Individual items within a program (prayers, hymns, sermons) with ordering

### Authentication
- Simple password-based admin authentication
- Express session middleware with cookie storage
- Session secret via `SESSION_SECRET` environment variable
- Admin password via `ADMIN_PASSWORD` environment variable

### Project Structure
```
client/           # React frontend
  src/
    components/   # Reusable UI components
    pages/        # Route pages
    hooks/        # Custom React hooks (data fetching)
    lib/          # Utilities and query client
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Database operations
  db.ts           # Database connection
shared/           # Shared code
  schema.ts       # Drizzle table definitions
  routes.ts       # API route type definitions
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database (connection via `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage in PostgreSQL

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `ADMIN_PASSWORD`: Password for admin dashboard access

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `express` / `express-session`: Web server and sessions
- `@tanstack/react-query`: Client-side data fetching
- `date-fns`: Date formatting and manipulation
- `framer-motion`: Animation library
- `zod`: Runtime type validation
# Tots and Teens Child Care Clinic - Appointment Booking System

## Overview

This is a single-page appointment booking web application for Tots and Teens Child Care Clinic, a pediatric healthcare facility in Salem. The application allows parents to book appointments with Dr. Amudhadevi S., an experienced pediatrician with 13 years of clinical experience. The system features a streamlined booking flow with comprehensive service information, doctor credentials, and automated email confirmations for both clients and the clinic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**Routing**: Wouter for lightweight client-side routing with a simple single-page application structure.

**UI Component System**: 
- shadcn/ui components (New York style variant) built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom color scheme featuring warm coral (#FF6B6B), teal (#4ECDC4), and sky blue (#45B7D1)
- Typography stack: Poppins for headings, Inter for body text
- Responsive mobile-first design approach

**State Management**: TanStack Query (React Query) v5 for server state management, form state handled by React Hook Form with Zod validation.

**Form Handling**: React Hook Form with @hookform/resolvers for Zod schema integration, providing type-safe form validation.

**Design Philosophy**: Single-page layout optimized for conversion, combining professional medical aesthetics with child-friendly warmth. Reference-based design inspired by modern booking platforms (Zocdoc).

### Backend Architecture

**Runtime**: Node.js with Express.js framework using ES modules.

**API Design**: RESTful API with a single primary endpoint (`POST /api/appointments`) for appointment booking.

**Request Processing**:
- JSON body parsing with raw body capture for potential webhook verification
- Zod schema validation for all incoming appointment data
- Comprehensive error handling with appropriate HTTP status codes

**Development Server**: Vite middleware integration in development mode for hot module replacement and seamless frontend-backend integration.

### Data Storage

**Database**: PostgreSQL accessed through Neon's serverless driver (`@neondatabase/serverless`).

**ORM**: Drizzle ORM v0.39+ with the following characteristics:
- Type-safe database operations with TypeScript
- Schema-first approach with migrations stored in `./migrations`
- Schema defined in `shared/schema.ts` for code sharing between frontend and backend
- Connection pooling via Neon's Pool implementation

**Schema Design**:
- Single `appointments` table with UUID primary keys
- Fields: parent name, child name, child age, phone number, email, service type, preferred date/time, additional notes, timestamps
- Validation constraints enforced at both database and application levels through Zod schemas

**Migration Strategy**: Drizzle Kit for schema migrations with `db:push` command for development.

### Authentication & Authorization

**Current Implementation**: No authentication system implemented. The application is publicly accessible for appointment booking.

**Session Management**: Session infrastructure is present (connect-pg-simple) but not actively used for authentication. This suggests future plans for administrative features or user accounts.

### External Dependencies

#### Email Service Integration

**Provider**: Resend email service for transactional emails.

**Connection Method**: Replit Connectors API for secure credential management:
- Credentials fetched dynamically from Replit's connection API
- Authentication via Repl Identity or Web Repl Renewal tokens
- Supports configurable "from" email address

**Email Templates**: 
- Client confirmation emails with appointment details and clinic information
- Clinic notification emails sent to `rakeshrevathi2006@gmail.com`
- HTML email templates with gradient headers and structured appointment information

**Error Handling**: Email failures are logged but don't block appointment creation (fire-and-forget pattern).

#### Development Tools

**Replit Integration**: 
- Runtime error modal overlay for development
- Cartographer plugin for enhanced debugging
- Development banner for Replit environment awareness

#### Third-Party UI Libraries

- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives (accordion, dialog, dropdown, select, etc.)
- **React Icons**: Icon library (specifically using SimpleIcons for WhatsApp)
- **Lucide React**: Icon system for UI elements
- **Embla Carousel**: Touch-friendly carousel component
- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Variant-based component styling
- **Vaul**: Drawer component for mobile interactions

#### Asset Management

**Images**: Stored in `attached_assets/` directory with static imports in components.

**Font Loading**: Google Fonts (Poppins and Inter) loaded via HTML link tags for optimal performance.

### Deployment Configuration

**Build Process**: 
1. Frontend: Vite builds React application to `dist/public`
2. Backend: esbuild bundles server code to `dist/index.js` with external packages

**Production Server**: Express serves static files from build output in production mode.

**Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)
- `REPLIT_CONNECTORS_HOSTNAME`: Replit connectors API endpoint
- `REPL_IDENTITY` or `WEB_REPL_RENEWAL`: Authentication tokens for Replit services

### Code Organization

**Monorepo Structure**:
- `client/`: Frontend React application
- `server/`: Backend Express application
- `shared/`: Code shared between frontend and backend (schemas, types)
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**Type Safety**: Full TypeScript coverage with strict mode enabled, shared types between frontend and backend through Drizzle schema inference.
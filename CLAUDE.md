# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run check` - Run type checking with svelte-check
- `bun run check:watch` - Run type checking in watch mode
- `bun run lint` - Run linting (prettier + eslint)
- `bun run format` - Format code with prettier

## Architecture Overview

This is a SvelteKit application for an influencer scanning platform called Influscan. The app helps businesses grow by connecting with local influencers.

### Tech Stack
- **Framework**: SvelteKit with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **UI**: Tailwind CSS + shadcn-svelte components
- **Deployment**: Cloudflare Pages (adapter-cloudflare)
- **AI**: OpenAI integration for scan analysis

### Key Architecture Patterns

**Database Layer** (`src/lib/server/database/`):
- Centralized Supabase client in `index.ts`
- Table enum defines database tables: `scans`, `users`, `scans_settings`, `users_stats`, `scans_view_settings`
- Separate modules for each table's operations

**Authentication** (`src/lib/server/authentication.ts`):
- Custom Clerk integration with JWT verification
- Session management through locals
- Protected routes configuration
- User metadata synchronization between Clerk and database

**Route Structure**:
- `/scans` - Main scan management interface with data tables
- `/scans/[scan_id]` - Individual scan details
- `/settings` - User configuration
- `/plan` - Subscription management
- `/integrations` - Third-party integrations
- API routes under `/api/` for server-side operations

**Component Architecture**:
- `src/lib/components/ui/` - Base shadcn-svelte components
- `src/lib/components/` - Application-specific components
- `src/lib/components/app-table/` - Custom data table implementation
- Scan-specific components: `scan-result-status`, `scan-result-rankings`, `scan-result-explanation`

**Data Models** (`src/lib/models/`):
- `ScanResult` interface defines core scan data structure
- Includes status, details, estimation, rankings, and AI-generated content
- Table configurations define column definitions and interactions

**Server-Side Features**:
- CSV parsing for bulk scan imports
- AI-powered scan analysis via OpenAI
- Real-time scan status updates
- User statistics and plan management

### Environment Variables
- `DB_URL`, `DB_API_KEY` - Supabase configuration
- Clerk authentication keys
- OpenAI API keys for scan analysis
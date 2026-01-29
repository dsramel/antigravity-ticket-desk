# Ticket Desk

A minimal dynamic website for ticket management.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```
   Or for production-ready installation:
   ```bash
   npm ci
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Set `ADMIN_PASSWORD` (default: `secret`)
   - Optionally set `PORT` (default: `3000`)
   - Optionally set `SESSION_SECRET` for session security

3. **Run the Application**
   
   **Development mode** (with auto-restart on file changes):
   ```bash
   npm run dev
   ```
   
   **Production mode**:
   ```bash
   npm start
   ```
   
   Server will start at `http://localhost:3000` (or the configured PORT).

## Project Structure

- **`app.js`**: Main application entry point. Configures Express server, middleware, session management, and routes.
- **`routes/`**: Contains route handlers:
  - `index.js`: Public routes for home page, ticket submission, and ticket list
  - `admin.js`: Admin authentication and ticket management routes
  - `api.js`: API endpoints for ticket operations (admin-only)
- **`views/`**: EJS templates for rendering HTML pages (header, footer, forms, ticket lists, etc.)
- **`public/`**: Static assets (CSS, images, client-side JavaScript)
- **`data/`**: JSON file storage for ticket persistence (`tickets.json`)
- **`src/lib/`**: Core business logic:
  - `ticketStore.js`: Thread-safe ticket storage operations with file-based persistence

## Features
- **Public**: Submit tickets and view list.
- **Admin**: Login (password in `.env`), update status, delete tickets.
- **API**: `GET /api/tickets` (admin-only)
- **Persistence**: Data saved to `data/tickets.json`.

## Manual Testing
1. Visit `http://localhost:3000`
2. Submit a ticket.
3. Visit `http://localhost:3000/tickets` to see it.
4. Visit `http://localhost:3000/admin`, login with password `secret`.
5. Update and delete tickets.

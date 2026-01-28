# Ticket Desk

A minimal dynamic website for ticket management.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Set `ADMIN_PASSWORD` (default: `secret`)

3. **Start Server**
   ```bash
   npm run dev
   ```
   Server will start at `http://localhost:3000`.

## Features
- **Public**: Submit tickets and view list.
- **Admin**: Login (password in `.env`), update status, delete tickets.
- **API**: `GET /api/tickets`
- **Persistence**: Data saved to `data/tickets.json`.

## Testing
1. Visit `http://localhost:3000`
2. Submit a ticket.
3. Visit `http://localhost:3000/tickets` to see it.
4. Visit `http://localhost:3000/admin`, login with password `secret`.
5. Update and delete tickets.

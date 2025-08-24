# Einstein Server (Node + Express + Prisma + MySQL)

## Quick Start

1. Copy `.env.example` to `.env` and set `DATABASE_URL` (MySQL) and `PORT` if desired.
2. Put your Excel at `server/data/Einstein3.0.xlsx`.
3. Install & generate Prisma client:
   ```bash
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   ```
4. Seed data from Excel:
   ```bash
   npm run seed
   ```
5. Start the API:
   ```bash
   npm run dev   # or npm start
   ```

## Endpoints
- `GET /api/health` – ping
- `GET /api/salespeople`
- `GET /api/finance-managers`
- `GET /api/deals?recentDays=90&funded=false|true|all&search=...`
- `PATCH /api/deals/:id` – update basic fields (Entry/Funding)
- `GET /api/funding/unfunded` – contracts in transit (unfunded)
- `POST /api/deals/:id/mark-funded` – set fundedDate = today

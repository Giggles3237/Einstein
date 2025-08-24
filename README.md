# Einstein App (Starter)

This repo contains a minimal, working **server** (Node/Express/Prisma/MySQL) and **client** (React/Vite) that mirror your Excel workflow:

- **Deal Entry** – inline edit for coordinator
- **Funding (CIT)** – contracts in transit, with Days Out and mark-funded action

## Folder layout
```
einstein-app/
  server/   # API + Prisma + seed from Excel
  client/   # React UI
```

## End-to-end Setup

### 1) Database
- Create a MySQL database (local or Azure).
- Copy `server/.env.example` to `server/.env` and set `DATABASE_URL`.

### 2) Server
```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
# Put your Excel file at server/data/Einstein3.0.xlsx
npm run seed
npm run dev   # starts http://localhost:4000
```

### 3) Client
```bash
cd ../client
cp .env.example .env
npm install
npm run dev   # opens http://localhost:5173
```

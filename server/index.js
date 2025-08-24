require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off*60000);
  return local.toISOString().slice(0,10);
}

// Simple health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ---- People ----
app.get('/api/salespeople', async (req, res) => {
  const list = await prisma.salesperson.findMany({ orderBy: { name: 'asc' } });
  res.json(list);
});

app.get('/api/finance-managers', async (req, res) => {
  const list = await prisma.financeManager.findMany({ orderBy: { name: 'asc' } });
  res.json(list);
});

// ---- Deals (list) ----
app.get('/api/deals', async (req, res) => {
  const { from, to, funded, search, recentDays } = req.query;

  const where = {};
  if (from || to) {
    where.dealDate = {};
    if (from) where.dealDate.gte = new Date(from);
    if (to) where.dealDate.lte = new Date(to);
  } else if (recentDays) {
    const days = parseInt(recentDays, 10) || 90;
    const start = new Date();
    start.setDate(start.getDate() - days);
    where.dealDate = { gte: start };
  }

  if (funded === 'true') {
    where.fundedDate = { not: null };
  } else if (funded === 'false') {
    where.fundedDate = null;
  }

  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: 'insensitive' } },
      { stockNo: { contains: search, mode: 'insensitive' } },
      { bank: { contains: search, mode: 'insensitive' } },
      { salesperson: { name: { contains: search, mode: 'insensitive' } } },
      { financeManager: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const deals = await prisma.deal.findMany({
    where,
    orderBy: { dealDate: 'desc' },
    include: { salesperson: true, financeManager: true },
    take: 500
  });

  res.json(deals.map(d => ({
    ...d,
    salespersonName: d.salesperson?.name || null,
    financeManagerName: d.financeManager?.name || null,
  })));
});

// ---- Deals (update basic fields) ----
app.patch('/api/deals/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const {
    dealDate, bank, fundedDate, stockNo, customerName,
    salespersonId, financeManagerId, fundingNotes
  } = req.body;

  const data = {};
  if (dealDate !== undefined) data.dealDate = dealDate ? new Date(dealDate) : null;
  if (bank !== undefined) data.bank = bank;
  if (fundedDate !== undefined) data.fundedDate = fundedDate ? new Date(fundedDate) : null;
  if (stockNo !== undefined) data.stockNo = stockNo;
  if (customerName !== undefined) data.customerName = customerName;
  if (salespersonId !== undefined) data.salespersonId = salespersonId || null;
  if (financeManagerId !== undefined) data.financeManagerId = financeManagerId || null;
  if (fundingNotes !== undefined) data.fundingNotes = fundingNotes;

  const updated = await prisma.deal.update({ where: { id }, data, include: { salesperson: true, financeManager: true } });
  res.json({
    ...updated,
    salespersonName: updated.salesperson?.name || null,
    financeManagerName: updated.financeManager?.name || null,
  });
});

// ---- Funding (unfunded) ----
app.get('/api/funding/unfunded', async (req, res) => {
  const rows = await prisma.deal.findMany({
    where: { fundedDate: null },
    orderBy: { dealDate: 'asc' },
    include: { salesperson: true, financeManager: true }
  });
  const today = new Date();
  const addDaysOut = rows.map(d => {
    const dealDate = d.dealDate ? new Date(d.dealDate) : null;
    let daysOut = null;
    if (dealDate) {
      const diff = Math.floor((today - dealDate) / (1000*60*60*24));
      daysOut = diff;
    }
    return {
      ...d,
      salespersonName: d.salesperson?.name || null,
      financeManagerName: d.financeManager?.name || null,
      daysOut
    };
  });
  res.json(addDaysOut);
});

// Quick action: mark funded today
app.post('/api/deals/:id/mark-funded', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = await prisma.deal.update({
    where: { id },
    data: { fundedDate: new Date() },
    include: { salesperson: true, financeManager: true }
  });
  res.json({
    ...updated,
    salespersonName: updated.salesperson?.name || null,
    financeManagerName: updated.financeManager?.name || null,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

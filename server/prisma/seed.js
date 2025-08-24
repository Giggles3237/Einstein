// Seed script: imports deals from Excel into MySQL via Prisma
// Usage: npm run prisma:generate && npm run prisma:migrate && npm run seed
require('dotenv').config();
const path = require('path');
const xlsx = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Adjust this if your file is elsewhere:
const EXCEL_PATH = path.join(__dirname, '../data/Einstein3.0.xlsx');

function toNumber(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const t = v.replace(/[,\$]/g, '').trim();
    if (t === '') return null;
    const n = Number(t);
    return isNaN(n) ? null : n;
  }
  return null;
}

function toDate(v) {
  if (!v && v !== 0) return null;
  if (v instanceof Date) return v;
  if (typeof v === 'number') {
    // Excel serial to JS date (assuming 1900 date system)
    const base = new Date(Date.UTC(1899, 11, 30));
    const ms = v * 24 * 60 * 60 * 1000;
    return new Date(base.getTime() + ms);
  }
  if (typeof v === 'string') {
    const d = new Date(v);
    return isNaN(d) ? null : d;
  }
  return null;
}

function normType(t) {
  if (!t) return null;
  const s = String(t).trim().toLowerCase();
  const map = {
    'new bmw': 'New BMW',
    'used bmw': 'Used BMW',
    'cpo bmw': 'CPO BMW',
    'new mini': 'New MINI',
    'used mini': 'Used MINI',
    'cpo mini': 'CPO MINI'
  };
  if (map[s]) return map[s];
  // Try heuristics
  if (s.includes('new') && s.includes('bmw')) return 'New BMW';
  if (s.includes('used') && s.includes('bmw')) return 'Used BMW';
  if (s.includes('cpo') && s.includes('bmw')) return 'CPO BMW';
  if (s.includes('new') && s.includes('mini')) return 'New MINI';
  if (s.includes('used') && s.includes('mini')) return 'Used MINI';
  if (s.includes('cpo') && s.includes('mini')) return 'CPO MINI';
  return t;
}

function getFirst(row, keys) {
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(row, k) && row[k] !== undefined) {
      const v = row[k];
      if (v !== '') return v;
    }
  }
  return undefined;
}

async function main() {
  console.log('Reading Excel:', EXCEL_PATH);
  const wb = xlsx.readFile(EXCEL_PATH, { cellDates: true });
  const sheetNamesPriority = ['Data Master', 'DataMaster', 'DATAMASTER', 'Master', 'All'];
  let sheetName = wb.SheetNames.find(n => sheetNamesPriority.includes(n)) || wb.SheetNames[0];
  console.log('Using sheet:', sheetName);

  const ws = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(ws, { defval: null });

  console.log('Rows found:', rows.length);

  // Maps to cache created people
  const spMap = new Map();
  const fmMap = new Map();

  let inserted = 0;
  for (const row of rows) {
    // Required-ish fields:
    const dealDate = toDate(getFirst(row, ['Date', 'Deal Date', 'DELIVERED', 'Delivered Date']));
    const stockNo = getFirst(row, ['Stock #', 'Stock', 'STOCK #', 'STOCK']);
    const customerName = getFirst(row, ['Name', 'Client', 'Customer', 'Customer Name']);
    const salespersonName = getFirst(row, ['Salesperson', 'Advisor', 'Client Advisor', 'Sales Person']);
    const financeManagerName = getFirst(row, ['Finance Manager', 'F&I Manager', 'FI Manager']);
    const bank = getFirst(row, ['Bank', 'Lender']);
    const fundedCell = getFirst(row, ['Funded', 'Funded Date', 'FUNDED']);
    const fundedDate = toDate(fundedCell);
    const dealType = normType(getFirst(row, ['Type', 'Vehicle Type', 'TYPE']));
    const age = toNumber(getFirst(row, ['Age', 'DAYS OUT', 'Age (days)']));

    // Skip totally empty lines
    if (!dealDate && !stockNo && !customerName) continue;

    let spId = null;
    if (salespersonName) {
      const key = String(salespersonName).trim();
      if (spMap.has(key)) spId = spMap.get(key);
      else {
        const sp = await prisma.salesperson.upsert({
          where: { name: key },
          create: { name: key, active: true },
          update: {}
        });
        spId = sp.id;
        spMap.set(key, spId);
      }
    }

    let fmId = null;
    if (financeManagerName) {
      const key = String(financeManagerName).trim();
      if (fmMap.has(key)) fmId = fmMap.get(key);
      else {
        const fm = await prisma.financeManager.upsert({
          where: { name: key },
          create: { name: key, active: true },
          update: {}
        });
        fmId = fm.id;
        fmMap.set(key, fmId);
      }
    }

    const data = {
      dealDate,
      bank: bank ? String(bank) : null,
      fundedDate,
      stockNo: stockNo ? String(stockNo) : null,
      customerName: customerName ? String(customerName) : null,
      salespersonId: spId,
      financeManagerId: fmId,
      dealType,
      age: age !== null ? Math.round(age) : null,
      split: toNumber(getFirst(row, ['Split'])),
      feGross: toNumber(getFirst(row, ['FE Gross', 'Front Gross', 'Front'])), 
      avp: toNumber(getFirst(row, ['AVP'])),
      beGross: toNumber(getFirst(row, ['BE Gross', 'Back Gross', 'Back'])),
      reserveAmt: toNumber(getFirst(row, ['Reserve'])),
      rewardsAmt: toNumber(getFirst(row, ['Rewards'])),
      vscAmt: toNumber(getFirst(row, ['VSC'])),
      maintenanceAmt: toNumber(getFirst(row, ['Maintenance'])),
      gapAmt: toNumber(getFirst(row, ['GAP'])),
      cilajetAmt: toNumber(getFirst(row, ['Cilajet'])),
      lojackAmt: toNumber(getFirst(row, ['LoJack', 'Lojack'])),
      keyAmt: toNumber(getFirst(row, ['Key'])),
      collisionAmt: toNumber(getFirst(row, ['Collision'])),
      dentAmt: toNumber(getFirst(row, ['Dent'])),
      excessWearAmt: toNumber(getFirst(row, ['Excess', 'Excess Wear'])),
      ppfAmt: toNumber(getFirst(row, ['PPF'])),
      wheelTireAmt: toNumber(getFirst(row, ['Wheel and Tire', 'Wheel & Tire', 'Wheel/Tire'])),
      moneyFlag: Boolean(getFirst(row, ['MONEY'])) || null,
      titlingFlag: Boolean(getFirst(row, ['TITLING'])) || null,
      mileageFlag: Boolean(getFirst(row, ['MILEAGE'])) || null,
      licenseInsuranceFlag: Boolean(getFirst(row, ['LICENSE/INSURANCE', 'LICENSE & INSURANCE'])) || null,
      feesFlag: Boolean(getFirst(row, ['FEES'])) || null,
      cleanFlag: Boolean(getFirst(row, ['Clean', 'CLEAN'])) || null,
      payoffFlag: Boolean(getFirst(row, ['Payoff Flag', 'PAYOFF'])) || null,
      payoffSent: toDate(getFirst(row, ['Payoff Sent'])),
      atcFlag: Boolean(getFirst(row, ['ATC Flag', 'ATC'])) || null,
      registrationSent: toDate(getFirst(row, ['Registration Sent'])),
      notes: getFirst(row, ['Notes']),
      fundingNotes: getFirst(row, ['Funding Notes', 'FUNDING NOTES'])
    };

    await prisma.deal.create({ data });
    inserted++;
  }

  console.log('Inserted deals:', inserted);
}

main()
  .then(async () => {
    console.log('Seeding complete.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

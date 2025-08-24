const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function http(path, options = {}) {
  const res = await fetch(API_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  return res.json();
}

export const api = {
  getSalespeople: () => http('/api/salespeople'),
  getFinanceManagers: () => http('/api/finance-managers'),
  getDeals: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return http('/api/deals' + (q ? ('?' + q) : ''));
  },
  patchDeal: (id, body) => http('/api/deals/' + id, { method: 'PATCH', body }),
  getUnfunded: () => http('/api/funding/unfunded'),
  markFunded: (id) => http('/api/deals/' + id + '/mark-funded', { method: 'POST' })
}

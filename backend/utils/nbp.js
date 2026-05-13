const axios = require('axios');
const pool = require('../config/database');

const NBP_BASE = 'https://api.nbp.pl/api/exchangerates/rates/A';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function fetchRateFromNBP(currency) {
  const { data } = await axios.get(`${NBP_BASE}/${currency}/?format=json`, { timeout: 5000 });
  return parseFloat(data.rates[0].mid);
}

async function upsertRate(currency, rate) {
  await pool.query(
    `INSERT INTO rates (currency, rate, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (currency) DO UPDATE SET rate = $2, updated_at = NOW()`,
    [currency, rate]
  );
}

async function getCachedRate(currency) {
  const { rows } = await pool.query('SELECT * FROM rates WHERE currency = $1', [currency]);
  return rows[0] || null;
}

/**
 * Returns the PLN rate for a currency.
 * Fetches from NBP if cache is stale (> 1h), falls back to DB cache on error.
 */
async function getRate(currency) {
  const cached = await getCachedRate(currency);
  const isStale = !cached || Date.now() - new Date(cached.updated_at).getTime() > CACHE_TTL_MS;

  if (!isStale) return parseFloat(cached.rate);

  try {
    const rate = await fetchRateFromNBP(currency);
    await upsertRate(currency, rate);
    return rate;
  } catch (err) {
    console.warn(`NBP fetch failed for ${currency}, using cached value:`, err.message);
    if (cached) return parseFloat(cached.rate);
    throw new Error(`No rate available for ${currency}`);
  }
}

async function getAllRates() {
  const [usd, eur] = await Promise.all([getRate('USD'), getRate('EUR')]);
  return { USD: usd, EUR: eur, PLN: 1 };
}

module.exports = { getRate, getAllRates };

const { validationResult } = require('express-validator');
const pool = require('../config/database');
const { getAllRates } = require('../utils/nbp');

const VALID_CURRENCIES = ['PLN', 'USD', 'EUR'];

exports.list = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, error: errors.array()[0].msg, status: 422 });
  }

  const { name, cost, currency = 'PLN', dueDay, active = true } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO subscriptions (user_id, name, cost, currency, due_day, active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.userId, name, cost, currency.toUpperCase(), dueDay || null, active]
    );
    res.status(201).json({ success: true, data: rows[0], message: 'Subscription created' });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, error: errors.array()[0].msg, status: 422 });
  }

  const { id } = req.params;
  const { name, cost, currency, dueDay, active } = req.body;

  try {
    // Ownership check
    const check = await pool.query(
      'SELECT id FROM subscriptions WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Subscription not found', status: 404 });
    }

    const { rows } = await pool.query(
      `UPDATE subscriptions
       SET name = COALESCE($1, name),
           cost = COALESCE($2, cost),
           currency = COALESCE($3, currency),
           due_day = COALESCE($4, due_day),
           active = COALESCE($5, active),
           updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [
        name || null,
        cost || null,
        currency ? currency.toUpperCase() : null,
        dueDay !== undefined ? dueDay : null,
        active !== undefined ? active : null,
        id,
        req.user.userId,
      ]
    );
    res.json({ success: true, data: rows[0], message: 'Subscription updated' });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM subscriptions WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Subscription not found', status: 404 });
    }
    res.json({ success: true, data: null, message: 'Subscription deleted' });
  } catch (err) {
    next(err);
  }
};

exports.stats = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT cost, currency FROM subscriptions WHERE user_id = $1 AND active = true',
      [req.user.userId]
    );

    const rates = await getAllRates();

    let totalPLN = 0;
    for (const sub of rows) {
      const rate = rates[sub.currency] ?? 1;
      totalPLN += parseFloat(sub.cost) * rate;
    }

    res.json({
      success: true,
      data: {
        totalPLN: parseFloat(totalPLN.toFixed(2)),
        activeCount: rows.length,
        rates,
      },
    });
  } catch (err) {
    next(err);
  }
};

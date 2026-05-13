const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const pool = require('../config/database');
const { sign } = require('../utils/jwt');

const SALT_ROUNDS = 10;

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, error: errors.array()[0].msg, status: 422 });
  }

  const { email, password } = req.body;
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already exists', status: 409 });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, password_hash]
    );

    const token = sign({ userId: rows[0].id, email: rows[0].email });
    res.status(201).json({
      success: true,
      data: { user: rows[0], token },
      message: 'Registration successful',
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, error: errors.array()[0].msg, status: 422 });
  }

  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials', status: 401 });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials', status: 401 });
    }

    const token = sign({ userId: user.id, email: user.email });
    res.json({
      success: true,
      data: { token, user: { id: user.id, email: user.email, created_at: user.created_at } },
      message: 'Login successful',
    });
  } catch (err) {
    next(err);
  }
};

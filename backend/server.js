require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const subsRoutes = require('./routes/subscriptions');
const ratesRoutes = require('./routes/rates');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS – allow frontend dev server
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());

// Request logger in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Health check (no auth required)
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subs', subsRoutes);
app.use('/api/rates', ratesRoutes);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found', status: 404 });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SubTrack API running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

// Global error handler — must be registered last in Express middleware chain
module.exports = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err);

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: status === 500 ? 'Internal server error' : err.message,
    status,
  });
};

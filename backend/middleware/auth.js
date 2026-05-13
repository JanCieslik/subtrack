const { verify } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided', status: 401 });
  }

  const token = header.slice(7);
  try {
    req.user = verify(token);
    next();
  } catch (err) {
    const expired = err.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      error: expired ? 'Token expired' : 'Invalid token',
      status: 401,
    });
  }
};

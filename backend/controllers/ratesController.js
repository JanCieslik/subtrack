const { getAllRates } = require('../utils/nbp');

exports.getRates = async (req, res, next) => {
  try {
    const rates = await getAllRates();
    res.json({ success: true, data: rates });
  } catch (err) {
    next(err);
  }
};

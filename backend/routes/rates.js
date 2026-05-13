const { Router } = require('express');
const auth = require('../middleware/auth');
const { getRates } = require('../controllers/ratesController');

const router = Router();

router.get('/', auth, getRates);

module.exports = router;

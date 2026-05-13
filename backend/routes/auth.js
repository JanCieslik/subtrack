const { Router } = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = Router();

const emailRule = body('email').isEmail().normalizeEmail().withMessage('Invalid email address');
const passwordRule = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');

router.post('/register', emailRule, passwordRule, register);
router.post('/login', emailRule, passwordRule, login);

module.exports = router;

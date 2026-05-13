const { Router } = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { list, create, update, remove, stats } = require('../controllers/subsController');

const router = Router();

// All subscription routes require authentication
router.use(auth);

const createRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('cost').isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('currency')
    .optional()
    .isIn(['PLN', 'USD', 'EUR'])
    .withMessage('Currency must be PLN, USD, or EUR'),
  body('dueDay')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 31 })
    .withMessage('Due day must be between 1 and 31'),
];

const updateRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('currency')
    .optional()
    .isIn(['PLN', 'USD', 'EUR'])
    .withMessage('Currency must be PLN, USD, or EUR'),
  body('dueDay')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 31 })
    .withMessage('Due day must be between 1 and 31'),
];

// /api/subs/stats must be defined before /:id to avoid route collision
router.get('/stats', stats);

router.get('/', list);
router.post('/', createRules, create);
router.put('/:id', updateRules, update);
router.delete('/:id', remove);

module.exports = router;

const express = require('express');
const { authenticate, authorizeRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  queryRouteSchema,
  createRouteSchema,
  updateRouteSchema,
} = require('../validators/route.schema');
const {
  listRoutesCtrl,
  getRouteCtrl,
  createRouteCtrl,
  updateRouteCtrl,
  softDeleteRouteCtrl,
  getRouteStatsCtrl,
} = require('../controllers/route.controller');

const router = express.Router();

router.use(authenticate);

// Dispatchers can view routes; only admins can change them.
const staff = authorizeRole('admin', 'dispatcher');
const adminOnly = authorizeRole('admin');

router.get('/', staff, validate(queryRouteSchema, 'query'), listRoutesCtrl);
router.post('/', adminOnly, validate(createRouteSchema), createRouteCtrl);
router.get('/:id', staff, getRouteCtrl);
router.patch('/:id', adminOnly, validate(updateRouteSchema), updateRouteCtrl);
router.delete('/:id', adminOnly, softDeleteRouteCtrl);
router.get('/:id/stats', staff, getRouteStatsCtrl);

module.exports = router;

const express = require('express');
const { authenticate, authorizeRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createVehicleSchema,
  updateVehicleSchema,
  queryVehicleSchema,
  createMaintenanceSchema,
} = require('../validators/vehicle.schema');
const {
  listVehiclesCtrl,
  getVehicleCtrl,
  createVehicleCtrl,
  updateVehicleCtrl,
  softDeleteVehicleCtrl,
  getMaintenanceHistoryCtrl,
  addMaintenanceCtrl,
  getVehicleStatsCtrl,
} = require('../controllers/vehicle.controller');

const router = express.Router();

router.use(authenticate);

// Dispatchers can view the fleet; only admins can change it.
const staff = authorizeRole('admin', 'dispatcher');
const adminOnly = authorizeRole('admin');

router.get('/', staff, validate(queryVehicleSchema, 'query'), listVehiclesCtrl);
router.post('/', adminOnly, validate(createVehicleSchema), createVehicleCtrl);
router.get('/:id', staff, getVehicleCtrl);
router.patch('/:id', adminOnly, validate(updateVehicleSchema), updateVehicleCtrl);
router.delete('/:id', adminOnly, softDeleteVehicleCtrl);
router.get('/:id/maintenance', staff, getMaintenanceHistoryCtrl);
router.post('/:id/maintenance', adminOnly, validate(createMaintenanceSchema), addMaintenanceCtrl);
router.get('/:id/stats', staff, getVehicleStatsCtrl);

module.exports = router;

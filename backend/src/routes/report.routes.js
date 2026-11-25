const express = require('express');
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  getKpisCtrl,
  getFuelEfficiencyCtrl,
  getMaintenanceCostCtrl,
  getRevenueCtrl,
  getTripVolumeCtrl,
  getDriverLeaderboardCtrl,
  exportAllCsvCtrl,
} = require('../controllers/report.controller');

const router = express.Router();

router.use(authenticate);

// Dashboard widgets: visible to admins and dispatchers (the dispatcher dashboard uses them).
const dashboardAccess = authorizeRole('admin', 'dispatcher');
// Financial / export reports: admin only.
const adminOnly = authorizeRole('admin');

router.get('/kpis', dashboardAccess, getKpisCtrl);
router.get('/fuel-efficiency', dashboardAccess, getFuelEfficiencyCtrl);
router.get('/trip-volume', dashboardAccess, getTripVolumeCtrl);
router.get('/maintenance-cost', adminOnly, getMaintenanceCostCtrl);
router.get('/revenue', adminOnly, getRevenueCtrl);
router.get('/driver-leaderboard', adminOnly, getDriverLeaderboardCtrl);
router.get('/export', adminOnly, exportAllCsvCtrl);

module.exports = router;

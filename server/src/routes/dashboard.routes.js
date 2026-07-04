const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');

const router = Router();

router.get('/resumen', dashboardController.resumen);

module.exports = router;

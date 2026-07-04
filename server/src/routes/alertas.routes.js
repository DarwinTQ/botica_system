const { Router } = require('express');
const alertasController = require('../controllers/alertas.controller');

const router = Router();

router.get('/', alertasController.getAll);

module.exports = router;

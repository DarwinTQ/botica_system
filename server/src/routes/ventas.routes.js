const { Router } = require('express');
const ventasController = require('../controllers/ventas.controller');

const router = Router();

router.get('/', ventasController.getAll);
router.get('/:id', ventasController.getById);
router.post('/', ventasController.create);

module.exports = router;

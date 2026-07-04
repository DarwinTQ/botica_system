const { Router } = require('express');
const reportesController = require('../controllers/reportes.controller');

const router = Router();

router.get('/ventas', reportesController.ventasPorRango);
router.get('/productos-mas-vendidos', reportesController.productosMasVendidos);
router.get('/valor-inventario', reportesController.valorInventario);

module.exports = router;

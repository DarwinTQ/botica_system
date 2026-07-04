const { Router } = require('express');
const productosController = require('../controllers/productos.controller');

const router = Router();

router.get('/', productosController.getAll);
router.get('/:id', productosController.getById);
router.post('/', productosController.create);
router.put('/:id', productosController.update);
router.delete('/:id', productosController.remove);

module.exports = router;

const { Router } = require('express');
const clientesController = require('../controllers/clientes.controller');

const router = Router();

router.get('/', clientesController.getAll);
router.get('/:id', clientesController.getById);
router.post('/', clientesController.create);
router.put('/:id', clientesController.update);
router.delete('/:id', clientesController.remove);

module.exports = router;

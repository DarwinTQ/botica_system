const { Router } = require('express');
const categoriasController = require('../controllers/categorias.controller');

const router = Router();

router.get('/', categoriasController.getAll);
router.post('/', categoriasController.create);
router.put('/:id', categoriasController.update);
router.delete('/:id', categoriasController.remove);

module.exports = router;

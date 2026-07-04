const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');

const router = Router();

router.get('/', usuariosController.getAll);
router.post('/', usuariosController.create);
router.put('/:id', usuariosController.update);
router.delete('/:id', usuariosController.remove);

module.exports = router;

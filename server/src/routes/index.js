const { Router } = require('express');

const authRoutes = require('./auth.routes');
const productosRoutes = require('./productos.routes');
const categoriasRoutes = require('./categorias.routes');
const ventasRoutes = require('./ventas.routes');
const clientesRoutes = require('./clientes.routes');
const alertasRoutes = require('./alertas.routes');
const dashboardRoutes = require('./dashboard.routes');
const reportesRoutes = require('./reportes.routes');
const usuariosRoutes = require('./usuarios.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/productos', productosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/ventas', ventasRoutes);
router.use('/clientes', clientesRoutes);
router.use('/alertas', alertasRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reportes', reportesRoutes);
router.use('/usuarios', usuariosRoutes);

module.exports = router;

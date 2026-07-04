const productosService = require('./productos.service');

const DIAS_VENCIMIENTO_ALERTA = 60;

function diasHasta(fechaISO) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = new Date(fechaISO);
  fecha.setHours(0, 0, 0, 0);
  return Math.round((fecha - hoy) / (1000 * 60 * 60 * 24));
}

async function getAll() {
  const productos = await productosService.getAll();
  const alertas = [];

  productos.forEach((p) => {
    if (p.stockActual <= p.stockMinimo) {
      alertas.push({
        id: `stock-${p.id}`,
        tipo: 'STOCK_BAJO',
        nivel: p.stockActual === 0 ? 'critico' : 'advertencia',
        productoId: p.id,
        productoNombre: p.nombre,
        mensaje:
          p.stockActual === 0
            ? `${p.nombre} está agotado`
            : `${p.nombre} tiene stock bajo (${p.stockActual}/${p.stockMinimo})`,
      });
    }

    const dias = diasHasta(p.fechaVencimiento);
    if (dias <= DIAS_VENCIMIENTO_ALERTA) {
      alertas.push({
        id: `venc-${p.id}`,
        tipo: 'VENCIMIENTO',
        nivel: dias <= 15 ? 'critico' : 'advertencia',
        productoId: p.id,
        productoNombre: p.nombre,
        mensaje:
          dias < 0
            ? `${p.nombre} ya venció`
            : `${p.nombre} vence en ${dias} día${dias === 1 ? '' : 's'}`,
      });
    }
  });

  return alertas;
}

module.exports = { getAll, DIAS_VENCIMIENTO_ALERTA };

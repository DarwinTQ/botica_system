const productosService = require('./productos.service');
const ventasService = require('./ventas.service');
const alertasService = require('./alertas.service');

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

async function resumen() {
  const [productos, ventas, alertas] = await Promise.all([
    productosService.getAll(),
    ventasService.getAll(),
    alertasService.getAll(),
  ]);

  const hoy = hoyISO();
  const ventasHoy = ventas.filter((v) => v.fecha.slice(0, 10) === hoy);
  const ventasHoyTotal = ventasHoy.reduce((sum, v) => sum + v.total, 0);

  const productosStockBajo = productos.filter((p) => p.stockActual <= p.stockMinimo).length;
  const productosPorVencer = alertas.filter((a) => a.tipo === 'VENCIMIENTO').length;

  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dias.push(d.toISOString().slice(0, 10));
  }
  const ventasUltimos7Dias = dias.map((fecha) => {
    const total = ventas
      .filter((v) => v.fecha.slice(0, 10) === fecha)
      .reduce((sum, v) => sum + v.total, 0);
    return { fecha, total: Math.round(total * 100) / 100 };
  });

  const cantidadPorProducto = {};
  ventas.forEach((v) => {
    v.items.forEach((item) => {
      cantidadPorProducto[item.productoId] =
        (cantidadPorProducto[item.productoId] || 0) + item.cantidad;
    });
  });
  const topProductos = Object.entries(cantidadPorProducto)
    .map(([productoId, cantidad]) => {
      const producto = productos.find((p) => p.id === Number(productoId));
      return { productoId: Number(productoId), nombre: producto ? producto.nombre : 'Desconocido', cantidad };
    })
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  return {
    ventasHoyTotal: Math.round(ventasHoyTotal * 100) / 100,
    numeroVentasHoy: ventasHoy.length,
    productosStockBajo,
    productosPorVencer,
    ventasUltimos7Dias,
    topProductos,
    alertasActivas: alertas.slice(0, 5),
  };
}

module.exports = { resumen };

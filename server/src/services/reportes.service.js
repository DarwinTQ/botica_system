const productosService = require('./productos.service');
const ventasService = require('./ventas.service');

async function ventasPorRango(desde, hasta) {
  const ventas = await ventasService.getAll({ desde, hasta });
  const total = ventas.reduce((sum, v) => sum + v.total, 0);
  return { ventas, total: Math.round(total * 100) / 100, cantidad: ventas.length };
}

async function productosMasVendidos(desde, hasta) {
  const [ventas, productos] = await Promise.all([
    ventasService.getAll({ desde, hasta }),
    productosService.getAll(),
  ]);

  const cantidadPorProducto = {};
  ventas.forEach((v) => {
    v.items.forEach((item) => {
      cantidadPorProducto[item.productoId] =
        (cantidadPorProducto[item.productoId] || 0) + item.cantidad;
    });
  });

  return Object.entries(cantidadPorProducto)
    .map(([productoId, cantidad]) => {
      const producto = productos.find((p) => p.id === Number(productoId));
      return {
        productoId: Number(productoId),
        nombre: producto ? producto.nombre : 'Desconocido',
        cantidad,
        ingresos: producto ? Math.round(producto.precioVenta * cantidad * 100) / 100 : 0,
      };
    })
    .sort((a, b) => b.cantidad - a.cantidad);
}

async function valorTotalInventario() {
  const productos = await productosService.getAll();
  const valorCosto = productos.reduce((sum, p) => sum + p.precioCompra * p.stockActual, 0);
  const valorVenta = productos.reduce((sum, p) => sum + p.precioVenta * p.stockActual, 0);
  return {
    valorCosto: Math.round(valorCosto * 100) / 100,
    valorVenta: Math.round(valorVenta * 100) / 100,
    unidadesTotales: productos.reduce((sum, p) => sum + p.stockActual, 0),
  };
}

module.exports = { ventasPorRango, productosMasVendidos, valorTotalInventario };

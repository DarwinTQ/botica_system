const { createRepository } = require('./_repository');
const productosService = require('./productos.service');
const clientesService = require('./clientes.service');

const repo = createRepository('ventas.json');

const IGV_RATE = 0.18;

function round2(n) {
  return Math.round(n * 100) / 100;
}

async function getAll({ desde, hasta, metodoPago } = {}) {
  let ventas = repo.getAll();

  if (desde) {
    ventas = ventas.filter((v) => v.fecha.slice(0, 10) >= desde);
  }
  if (hasta) {
    ventas = ventas.filter((v) => v.fecha.slice(0, 10) <= hasta);
  }
  if (metodoPago) {
    ventas = ventas.filter((v) => v.metodoPago === metodoPago);
  }

  return [...ventas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

async function getById(id) {
  return repo.getById(id);
}

async function create(data) {
  const { clienteId, metodoPago, items, vendedorId, vendedorNombre } = data;

  if (!items || items.length === 0) {
    throw new Error('La venta debe tener al menos un producto');
  }

  const productos = await productosService.getAll();
  const detalles = [];

  for (const item of items) {
    const producto = productos.find((p) => p.id === Number(item.productoId));
    if (!producto) throw new Error(`Producto ${item.productoId} no encontrado`);
    if (producto.stockActual < item.cantidad) {
      throw new Error(`Stock insuficiente para ${producto.nombre}`);
    }
    detalles.push({
      productoId: producto.id,
      nombre: producto.nombre,
      cantidad: item.cantidad,
      precioUnitario: producto.precioVenta,
      subtotal: round2(producto.precioVenta * item.cantidad),
    });
  }

  for (const detalle of detalles) {
    await productosService.decrementStock(detalle.productoId, detalle.cantidad);
  }

  let clienteNombre = 'Cliente general';
  if (clienteId) {
    const cliente = await clientesService.getById(clienteId);
    if (cliente) clienteNombre = cliente.nombre;
  }

  const subtotal = round2(detalles.reduce((sum, d) => sum + d.subtotal, 0));
  const igv = round2(subtotal * IGV_RATE);
  const total = round2(subtotal + igv);

  const venta = repo.insert({
    fecha: new Date().toISOString(),
    clienteId: clienteId || null,
    clienteNombre,
    metodoPago,
    vendedorId: vendedorId || null,
    vendedorNombre: vendedorNombre || 'Vendedor Nova Salud',
    items: detalles,
    subtotal,
    igv,
    total,
  });

  return venta;
}

module.exports = { getAll, getById, create, IGV_RATE };

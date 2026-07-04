const { createRepository } = require('./_repository');
const categoriasService = require('./categorias.service');

const repo = createRepository('productos.json');

async function attachCategoria(producto) {
  if (!producto) return producto;
  const categoria = await categoriasService.getById(producto.categoriaId);
  return { ...producto, categoriaNombre: categoria ? categoria.nombre : 'Sin categoría' };
}

async function getAll() {
  const productos = repo.getAll();
  return Promise.all(productos.map(attachCategoria));
}

async function getById(id) {
  const producto = repo.getById(id);
  if (!producto) return null;
  return attachCategoria(producto);
}

async function create(data) {
  const created = repo.insert({
    codigo: data.codigo,
    nombre: data.nombre,
    categoriaId: Number(data.categoriaId),
    laboratorio: data.laboratorio,
    presentacion: data.presentacion,
    precioCompra: Number(data.precioCompra),
    precioVenta: Number(data.precioVenta),
    stockActual: Number(data.stockActual),
    stockMinimo: Number(data.stockMinimo),
    fechaVencimiento: data.fechaVencimiento,
    requiereReceta: Boolean(data.requiereReceta),
    imagen: data.imagen || null,
  });
  return attachCategoria(created);
}

async function update(id, data) {
  const updated = repo.update(id, {
    codigo: data.codigo,
    nombre: data.nombre,
    categoriaId: Number(data.categoriaId),
    laboratorio: data.laboratorio,
    presentacion: data.presentacion,
    precioCompra: Number(data.precioCompra),
    precioVenta: Number(data.precioVenta),
    stockActual: Number(data.stockActual),
    stockMinimo: Number(data.stockMinimo),
    fechaVencimiento: data.fechaVencimiento,
    requiereReceta: Boolean(data.requiereReceta),
    imagen: data.imagen ?? null,
  });
  if (!updated) return null;
  return attachCategoria(updated);
}

async function remove(id) {
  return repo.remove(id);
}

async function decrementStock(id, cantidad) {
  const producto = repo.getById(id);
  if (!producto) throw new Error(`Producto ${id} no encontrado`);
  if (producto.stockActual < cantidad) {
    throw new Error(`Stock insuficiente para ${producto.nombre}`);
  }
  return repo.update(id, { stockActual: producto.stockActual - cantidad });
}

module.exports = { getAll, getById, create, update, remove, decrementStock };

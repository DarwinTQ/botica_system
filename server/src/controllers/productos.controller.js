const productosService = require('../services/productos.service');

async function getAll(req, res) {
  const productos = await productosService.getAll();
  res.json(productos);
}

async function getById(req, res) {
  const producto = await productosService.getById(req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
}

async function create(req, res) {
  try {
    const producto = await productosService.create(req.body);
    res.status(201).json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const producto = await productosService.update(req.params.id, req.body);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function remove(req, res) {
  const ok = await productosService.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Producto no encontrado' });
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };

const ventasService = require('../services/ventas.service');

async function getAll(req, res) {
  const { desde, hasta, metodoPago } = req.query;
  const ventas = await ventasService.getAll({ desde, hasta, metodoPago });
  res.json(ventas);
}

async function getById(req, res) {
  const venta = await ventasService.getById(req.params.id);
  if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
  res.json(venta);
}

async function create(req, res) {
  try {
    const venta = await ventasService.create(req.body);
    res.status(201).json(venta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { getAll, getById, create };

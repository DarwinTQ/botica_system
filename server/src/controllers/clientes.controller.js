const clientesService = require('../services/clientes.service');
const ventasService = require('../services/ventas.service');

async function getAll(req, res) {
  const clientes = await clientesService.getAll();
  res.json(clientes);
}

async function getById(req, res) {
  const cliente = await clientesService.getById(req.params.id);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  const ventas = await ventasService.getAll();
  const historial = ventas.filter((v) => v.clienteId === Number(req.params.id));
  res.json({ ...cliente, historialCompras: historial });
}

async function create(req, res) {
  const cliente = await clientesService.create(req.body);
  res.status(201).json(cliente);
}

async function update(req, res) {
  const cliente = await clientesService.update(req.params.id, req.body);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(cliente);
}

async function remove(req, res) {
  const ok = await clientesService.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };

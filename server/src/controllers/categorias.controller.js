const categoriasService = require('../services/categorias.service');

async function getAll(req, res) {
  const categorias = await categoriasService.getAll();
  res.json(categorias);
}

async function create(req, res) {
  const categoria = await categoriasService.create(req.body);
  res.status(201).json(categoria);
}

async function update(req, res) {
  const categoria = await categoriasService.update(req.params.id, req.body);
  if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.json(categoria);
}

async function remove(req, res) {
  const ok = await categoriasService.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.status(204).send();
}

module.exports = { getAll, create, update, remove };

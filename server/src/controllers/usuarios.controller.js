const usuariosService = require('../services/usuarios.service');

async function getAll(req, res) {
  const usuarios = await usuariosService.getAll();
  res.json(usuarios);
}

async function create(req, res) {
  const usuario = await usuariosService.create(req.body);
  res.status(201).json(usuario);
}

async function update(req, res) {
  const usuario = await usuariosService.update(req.params.id, req.body);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
}

async function remove(req, res) {
  const ok = await usuariosService.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.status(204).send();
}

module.exports = { getAll, create, update, remove };

const { createRepository } = require('./_repository');

const repo = createRepository('usuarios.json');

async function getAll() {
  return repo.getAll().map(({ password, ...rest }) => rest);
}

async function getById(id) {
  const user = repo.getById(id);
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

async function findByEmail(email) {
  return repo.getAll().find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

async function create(data) {
  const created = repo.insert({
    nombre: data.nombre,
    email: data.email,
    password: data.password,
    rol: data.rol,
  });
  const { password, ...rest } = created;
  return rest;
}

async function update(id, data) {
  const updated = repo.update(id, {
    nombre: data.nombre,
    email: data.email,
    rol: data.rol,
    ...(data.password ? { password: data.password } : {}),
  });
  if (!updated) return null;
  const { password, ...rest } = updated;
  return rest;
}

async function remove(id) {
  return repo.remove(id);
}

module.exports = { getAll, getById, findByEmail, create, update, remove };

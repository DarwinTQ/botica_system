const { createRepository } = require('./_repository');

const repo = createRepository('clientes.json');

async function getAll() {
  return repo.getAll();
}

async function getById(id) {
  return repo.getById(id);
}

async function create(data) {
  return repo.insert({
    nombre: data.nombre,
    dni: data.dni,
    telefono: data.telefono,
    correo: data.correo,
  });
}

async function update(id, data) {
  return repo.update(id, {
    nombre: data.nombre,
    dni: data.dni,
    telefono: data.telefono,
    correo: data.correo,
  });
}

async function remove(id) {
  return repo.remove(id);
}

module.exports = { getAll, getById, create, update, remove };

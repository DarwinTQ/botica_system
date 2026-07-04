const fs = require('fs');
const path = require('path');

/**
 * Repositorio genérico en memoria, sembrado desde un archivo JSON mock.
 * Cada servicio de dominio (productos, clientes, etc.) envuelve una instancia
 * de esto. Cuando se migre a Supabase, solo se reescribe el archivo de
 * servicio correspondiente para que use el cliente de Supabase en vez de
 * este repositorio — controladores y frontend no cambian.
 */
function createRepository(mockFileName) {
  const filePath = path.join(__dirname, '..', 'data', 'mock', mockFileName);
  const seed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let items = JSON.parse(JSON.stringify(seed));

  const nextId = () => items.reduce((max, item) => Math.max(max, item.id), 0) + 1;

  return {
    getAll: () => items,
    getById: (id) => items.find((item) => item.id === Number(id)),
    insert: (data) => {
      const newItem = { id: nextId(), ...data };
      items.push(newItem);
      return newItem;
    },
    update: (id, data) => {
      const index = items.findIndex((item) => item.id === Number(id));
      if (index === -1) return null;
      items[index] = { ...items[index], ...data, id: items[index].id };
      return items[index];
    },
    remove: (id) => {
      const index = items.findIndex((item) => item.id === Number(id));
      if (index === -1) return false;
      items.splice(index, 1);
      return true;
    },
    replaceAll: (newItems) => {
      items = newItems;
    },
  };
}

module.exports = { createRepository };

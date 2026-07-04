const alertasService = require('../services/alertas.service');

async function getAll(req, res) {
  const alertas = await alertasService.getAll();
  res.json(alertas);
}

module.exports = { getAll };

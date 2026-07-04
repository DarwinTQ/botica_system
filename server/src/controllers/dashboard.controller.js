const dashboardService = require('../services/dashboard.service');

async function resumen(req, res) {
  const data = await dashboardService.resumen();
  res.json(data);
}

module.exports = { resumen };

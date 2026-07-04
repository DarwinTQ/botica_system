const reportesService = require('../services/reportes.service');

async function ventasPorRango(req, res) {
  const { desde, hasta } = req.query;
  const data = await reportesService.ventasPorRango(desde, hasta);
  res.json(data);
}

async function productosMasVendidos(req, res) {
  const { desde, hasta } = req.query;
  const data = await reportesService.productosMasVendidos(desde, hasta);
  res.json(data);
}

async function valorInventario(req, res) {
  const data = await reportesService.valorTotalInventario();
  res.json(data);
}

module.exports = { ventasPorRango, productosMasVendidos, valorInventario };

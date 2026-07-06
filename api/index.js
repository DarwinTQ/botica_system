// Punto de entrada serverless para Vercel.
// Envuelve la app Express completa: Vercel invoca esta función para
// cualquier ruta /api/* (ver rewrites en vercel.json) y Express enruta
// internamente igual que en local.
const app = require('../server/src/app');

module.exports = app;

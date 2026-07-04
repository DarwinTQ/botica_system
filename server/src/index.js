const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Botica Nova Salud API corriendo en http://localhost:${PORT}`);
});

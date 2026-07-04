const usuariosService = require('./usuarios.service');

/**
 * Autenticación simulada. Cuando se migre a Supabase Auth, esta función
 * se reemplaza por una llamada a supabase.auth.signInWithPassword,
 * sin tocar el controlador ni el frontend.
 */
async function login(email, password) {
  const usuario = await usuariosService.findByEmail(email);
  if (!usuario || usuario.password !== password) {
    return null;
  }
  const { password: _pw, ...usuarioSinPassword } = usuario;
  const token = Buffer.from(`${usuario.id}:${usuario.email}:${Date.now()}`).toString('base64');
  return { usuario: usuarioSinPassword, token };
}

module.exports = { login };

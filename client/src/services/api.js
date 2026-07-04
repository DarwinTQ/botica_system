const BASE_URL = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Error ${res.status}`);
  }

  return data;
}

function toQueryString(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (entries.length === 0) return '';
  return `?${new URLSearchParams(entries).toString()}`;
}

export const authApi = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

export const productosApi = {
  getAll: () => request('/productos'),
  getById: (id) => request(`/productos/${id}`),
  create: (data) => request('/productos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/productos/${id}`, { method: 'DELETE' }),
};

export const categoriasApi = {
  getAll: () => request('/categorias'),
  create: (data) => request('/categorias', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/categorias/${id}`, { method: 'DELETE' }),
};

export const clientesApi = {
  getAll: () => request('/clientes'),
  getById: (id) => request(`/clientes/${id}`),
  create: (data) => request('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),
};

export const ventasApi = {
  getAll: (params) => request(`/ventas${toQueryString(params)}`),
  getById: (id) => request(`/ventas/${id}`),
  create: (data) => request('/ventas', { method: 'POST', body: JSON.stringify(data) }),
};

export const alertasApi = {
  getAll: () => request('/alertas'),
};

export const dashboardApi = {
  resumen: () => request('/dashboard/resumen'),
};

export const reportesApi = {
  ventasPorRango: (desde, hasta) => request(`/reportes/ventas${toQueryString({ desde, hasta })}`),
  productosMasVendidos: (desde, hasta) =>
    request(`/reportes/productos-mas-vendidos${toQueryString({ desde, hasta })}`),
  valorInventario: () => request('/reportes/valor-inventario'),
};

export const usuariosApi = {
  getAll: () => request('/usuarios'),
  create: (data) => request('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/usuarios/${id}`, { method: 'DELETE' }),
};

export function formatoMoneda(valor) {
  return `S/ ${Number(valor ?? 0).toFixed(2)}`;
}

export function formatoFecha(fechaISO) {
  if (!fechaISO) return '—';
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatoFechaHora(fechaISO) {
  if (!fechaISO) return '—';
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function diasHastaFecha(fechaISO) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = new Date(fechaISO);
  fecha.setHours(0, 0, 0, 0);
  return Math.round((fecha - hoy) / (1000 * 60 * 60 * 24));
}

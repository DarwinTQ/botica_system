const VARIANTES = {
  verde: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  ambar: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  rojo: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  gris: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  azul: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
};

export default function Badge({ variante = 'gris', children }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${VARIANTES[variante]}`}>
      {children}
    </span>
  );
}

export function estadoStockBadge(stockActual, stockMinimo) {
  if (stockActual === 0) return { variante: 'rojo', texto: 'Agotado' };
  if (stockActual <= stockMinimo) return { variante: 'ambar', texto: 'Stock bajo' };
  return { variante: 'verde', texto: 'Disponible' };
}

export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200/70 rounded-lg ${className}`} />;
}

export function SkeletonTabla({ filas = 5, columnas = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: filas }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columnas }).map((__, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonTarjetas({ cantidad = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: cantidad }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
  );
}

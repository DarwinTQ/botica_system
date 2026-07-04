export default function EmptyState({ icon: Icon, titulo, descripcion, accion }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        {Icon && <Icon size={28} className="text-slate-400" />}
      </div>
      <h3 className="text-slate-800 font-semibold text-base mb-1">{titulo}</h3>
      {descripcion && <p className="text-slate-500 text-sm max-w-sm">{descripcion}</p>}
      {accion && <div className="mt-4">{accion}</div>}
    </div>
  );
}

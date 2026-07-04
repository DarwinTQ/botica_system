import { Pill } from 'lucide-react';

export default function PlaceholderImage({ className = 'w-14 h-14', iconSize = 22 }) {
  return (
    <div className={`${className} rounded-xl bg-slate-100 flex items-center justify-center shrink-0`}>
      <Pill className="text-slate-300" size={iconSize} />
    </div>
  );
}

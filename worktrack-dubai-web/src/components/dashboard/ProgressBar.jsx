import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0, max = 100, label, sublabel }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-cream font-medium">{label}</span>
        <span className="text-slate tabular">{value} / {max}</span>
      </div>
      <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      {sublabel && <p className="text-slate text-xs">{sublabel}</p>}
    </div>
  );
}

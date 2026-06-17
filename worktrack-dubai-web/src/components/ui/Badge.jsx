const variants = {
  high: 'bg-rose/15 text-rose border-rose/30',
  medium: 'bg-gold/15 text-gold-soft border-gold/30',
  low: 'bg-slate/15 text-slate border-slate/30',
  done: 'bg-emerald/15 text-emerald border-emerald/30',
  pending: 'bg-slate/15 text-slate border-slate/30',
  active: 'bg-emerald/15 text-emerald border-emerald/30',
  inactive: 'bg-rose/15 text-rose border-rose/30',
  overdue: 'bg-rose/15 text-rose border-rose/30',
  admin: 'bg-gold/15 text-gold border-gold/30',
  user: 'bg-slate/15 text-slate border-slate/30',
};

export default function Badge({ variant = 'pending', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.pending} ${className}`}>
      {children}
    </span>
  );
}

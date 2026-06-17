import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

export default function StatCard({ label, value, icon: Icon, color = 'gold', loading }) {
  const colors = {
    gold: 'text-gold bg-gold/10',
    emerald: 'text-emerald bg-emerald/10',
    rose: 'text-rose bg-rose/10',
    slate: 'text-slate bg-slate/10',
  };

  if (loading) {
    return (
      <div className="card space-y-3">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    );
  }

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate text-sm">{label}</p>
          <motion.p
            className="tabular font-display text-3xl text-cream font-semibold mt-1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {value ?? 0}
          </motion.p>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-control ${colors[color]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </Card>
  );
}

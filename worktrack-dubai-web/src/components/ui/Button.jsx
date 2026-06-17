import { Loader2 } from 'lucide-react';

export default function Button({ variant = 'primary', loading, children, className = '', ...props }) {
  const base = variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-ghost' : 'btn-danger';
  return (
    <button className={`${base} inline-flex items-center gap-2 ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}

import { InboxIcon } from 'lucide-react';

export default function EmptyState({ icon: Icon = InboxIcon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-surface-raised flex items-center justify-center">
        <Icon size={28} className="text-slate" />
      </div>
      <div>
        <p className="text-cream font-medium">{title}</p>
        {description && <p className="text-slate text-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

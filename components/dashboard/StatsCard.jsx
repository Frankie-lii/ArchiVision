import { Card } from '@/components/ui/card';

export default function StatsCard({ title, value, subtitle, icon: Icon, accentColor }) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${accentColor || 'bg-accent/10'}`}>
            <Icon className="w-4 h-4 text-accent" />
          </div>
        )}
      </div>
    </Card>
  );
}

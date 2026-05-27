'use client';
import { Progress } from '@/components/ui/progress';

interface UsageDisplayProps {
  title: string;
  used: number;
  limit: number;
  unit?: string;
}

export default function UsageDisplay({ title, used, limit, unit = '' }: UsageDisplayProps) {
  const percentage = limit > 0 ? (used / limit) * 100 : 0;
  const isUnlimited = limit === Infinity || limit === -1;
  const displayLimit = isUnlimited ? 'Unlimited' : limit;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{used}</span>
          {!isUnlimited && <span> / {displayLimit}</span>}
          {unit && <span className="ml-1">{unit}</span>}
        </p>
      </div>
      {!isUnlimited && limit > 0 && <Progress value={percentage} />}
    </div>
  );
}

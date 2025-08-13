import { DisputeStatus } from '@/app/(shared)/stores/use-dispute-store';
import { STATUS_LABELS } from '../lib/constants';

const STATUS_COLOR_MAP: Record<DisputeStatus, string> = {
  IN_PROGRESS: 'bg-yellow-500',
  NEED_MORE: 'bg-orange-500',
  ANSWERED: 'bg-green-500',
};

export const StatusBadge = ({ status }: { status: DisputeStatus }) => (
  <div className="flex items-center">
    <span
      className={`h-2 w-2 rounded-full mr-2 ${STATUS_COLOR_MAP[status]}`}
    ></span>
    <span className="text-regular-sm text-foreground">
      {STATUS_LABELS[status]}
    </span>
  </div>
);

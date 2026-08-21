import { cn } from '@/lib/utils';

import type { WorkStream } from './scenario';

const avatarStyles: Record<WorkStream['avatar'], string> = {
  blue: 'from-sky-400 to-blue-700 shadow-blue-950/20',
  violet: 'from-violet-400 to-violet-700 shadow-violet-950/20',
  emerald: 'from-emerald-400 to-teal-700 shadow-emerald-950/20',
  amber: 'from-amber-300 to-orange-600 shadow-orange-950/20',
};

export function Avatar({
  initials,
  palette,
  size = 'medium',
}: {
  initials: string;
  palette: WorkStream['avatar'];
  size?: 'small' | 'medium' | 'large';
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-semibold tracking-tight text-white shadow-lg ring-1 ring-white/20',
        avatarStyles[palette],
        size === 'small' && 'size-9 text-[11px]',
        size === 'medium' && 'size-11 text-xs',
        size === 'large' && 'size-14 text-sm',
      )}
    >
      {initials}
    </span>
  );
}

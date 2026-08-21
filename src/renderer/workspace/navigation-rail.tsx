import {
  Bell,
  BriefcaseBusiness,
  Landmark,
  MessageSquareText,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import type { WorkspaceView, WorkspaceViewId } from './scenario';

const viewIcons: Record<WorkspaceViewId, LucideIcon> = {
  all: MessageSquareText,
  'needs-you': Bell,
  working: BriefcaseBusiness,
  finance: Landmark,
  customers: UsersRound,
};

export function NavigationRail({
  selectedViewId,
  views,
}: {
  selectedViewId: WorkspaceViewId;
  views: WorkspaceView[];
}) {
  return (
    <nav
      aria-label="Workspace views"
      className="flex w-[94px] shrink-0 flex-col border-r border-white/8 bg-[#111a2e] px-2.5 py-4 text-slate-400"
    >
      <div className="mx-auto mb-7 grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-xs font-bold tracking-[0.08em] text-white shadow-lg shadow-blue-950/40">
        WB
      </div>

      <ul className="space-y-1.5">
        {views.map((view) => {
          const Icon = viewIcons[view.id];
          const selected = view.id === selectedViewId;

          return (
            <li key={view.id}>
              <div
                aria-current={selected ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-[62px] flex-col items-center justify-center gap-1.5 rounded-xl px-1 text-center',
                  selected ? 'bg-white/10 text-white' : 'text-slate-400',
                )}
              >
                {selected && (
                  <span className="absolute inset-y-3 -left-2.5 w-0.5 rounded-r-full bg-sky-400" />
                )}
                <span className="relative">
                  <Icon className="size-[18px]" strokeWidth={1.8} />
                  {view.count !== undefined && (
                    <span
                      className={cn(
                        'absolute -top-2 -right-3 grid min-w-4 place-items-center rounded-full px-1 text-[9px] leading-4 font-bold',
                        view.id === 'needs-you'
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-sky-500 text-white',
                      )}
                    >
                      {view.count}
                    </span>
                  )}
                </span>
                <span className="max-w-full text-[10px] leading-3 font-medium">
                  {view.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-white/8 pt-4 text-center">
        <p className="text-[9px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
          Executive
        </p>
        <div className="mx-auto mt-2 grid size-8 place-items-center rounded-xl bg-slate-700 text-[10px] font-semibold text-slate-200">
          CC
        </div>
      </div>
    </nav>
  );
}

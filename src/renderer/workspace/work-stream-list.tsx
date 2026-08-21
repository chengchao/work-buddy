import { Pin } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Avatar } from './avatar';
import type { WorkStream, WorkStreamId } from './scenario';

const statusStyles: Record<WorkStream['status'], string> = {
  Monitoring: 'text-sky-700',
  'Needs Approval': 'text-amber-700',
  Working: 'text-blue-700',
  'At Risk': 'text-orange-700',
  Completed: 'text-emerald-700',
};

export function WorkStreamList({
  selectedWorkStreamId,
  workStreams,
}: {
  selectedWorkStreamId: WorkStreamId;
  workStreams: WorkStream[];
}) {
  return (
    <section
      aria-labelledby="work-streams-heading"
      className="flex w-[342px] shrink-0 flex-col border-r border-slate-200/80 bg-[#f7f9fc]"
    >
      <header className="border-b border-slate-200/80 px-5 pt-5 pb-4">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-700 uppercase">
          Work Buddy
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h1
            className="text-xl font-semibold tracking-tight text-slate-950"
            id="work-streams-heading"
          >
            Work streams
          </h1>
          <span className="pb-0.5 text-[11px] font-medium text-slate-500">
            {workStreams.length} conversations
          </span>
        </div>
      </header>

      <ol className="min-h-0 flex-1 overflow-y-auto px-2.5 py-3">
        {workStreams.map((workStream) => {
          const selected = workStream.id === selectedWorkStreamId;

          return (
            <li className="mb-1" key={workStream.id}>
              <article
                aria-current={selected ? 'true' : undefined}
                className={cn(
                  'relative flex gap-3 rounded-2xl px-3 py-3.5',
                  selected
                    ? 'bg-white shadow-[0_7px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80'
                    : 'text-slate-700',
                )}
              >
                {selected && (
                  <span className="absolute inset-y-4 left-0 w-0.5 rounded-r-full bg-sky-500" />
                )}
                <Avatar
                  initials={workStream.initials}
                  palette={workStream.avatar}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <h2 className="min-w-0 flex-1 truncate text-[13px] font-semibold text-slate-950">
                      {workStream.title}
                    </h2>
                    <time className="shrink-0 text-[10px] text-slate-400">
                      {workStream.timestamp}
                    </time>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">
                    {workStream.accountableOwner}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-[11px] text-slate-500">
                      {workStream.preview}
                    </p>
                    {workStream.permanent && (
                      <Pin
                        aria-label="Permanent conversation"
                        className="size-3.5 shrink-0 text-sky-600"
                      />
                    )}
                    {workStream.unread !== undefined && (
                      <span className="grid min-w-5 shrink-0 place-items-center rounded-full bg-sky-600 px-1 text-[9px] leading-5 font-bold text-white">
                        {workStream.unread}
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      'mt-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase',
                      statusStyles[workStream.status],
                    )}
                  >
                    {workStream.status}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

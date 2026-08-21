import { CheckCircle2, Clock3, ShieldCheck, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Avatar } from './avatar';
import type {
  BriefingMetric,
  ChiefOfStaffBriefing,
  FocusItem,
  WorkStream,
} from './scenario';

const metricStyles: Record<BriefingMetric['tone'], string> = {
  default: 'text-sky-700 bg-sky-50 border-sky-100',
  attention: 'text-amber-800 bg-amber-50 border-amber-100',
  risk: 'text-orange-800 bg-orange-50 border-orange-100',
};

const focusStyles: Record<FocusItem['tone'], string> = {
  attention: 'bg-amber-400',
  progress: 'bg-sky-500',
  risk: 'bg-orange-500',
};

export function ConversationSurface({
  briefing,
  chiefOfStaff,
}: {
  briefing: ChiefOfStaffBriefing;
  chiefOfStaff: WorkStream;
}) {
  return (
    <main
      aria-label="Chief of Staff conversation"
      className="flex min-w-0 flex-1 flex-col bg-[#eef3f8]"
    >
      <header className="flex h-[76px] shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/95 px-6 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur">
        <Avatar
          initials={chiefOfStaff.initials}
          palette={chiefOfStaff.avatar}
          size="medium"
        />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[15px] font-semibold text-slate-950">
            {chiefOfStaff.title}
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-sky-700">
            <ShieldCheck className="size-3.5" />
            {chiefOfStaff.permanent && 'Permanent'}
            {chiefOfStaff.permanent && chiefOfStaff.builtIn && ' · '}
            {chiefOfStaff.builtIn && 'Built in'}
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-800 sm:flex">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {briefing.supervisionSummary}
        </div>
      </header>

      <section
        aria-labelledby="workspace-overview-heading"
        className="flex shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-6 py-3"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3
            className="text-[10px] font-semibold tracking-[0.12em] text-sky-700 uppercase"
            id="workspace-overview-heading"
          >
            Workspace overview
          </h3>
          <p className="mt-0.5 truncate text-[11px] text-slate-600">
            {chiefOfStaff.title} · {briefing.contextSummary}
          </p>
        </div>
        <p className="hidden items-center gap-1.5 text-[10px] font-medium text-slate-500 lg:flex">
          <Clock3 className="size-3.5" />
          {briefing.nextMilestone}
        </p>
      </section>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 lg:px-8">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-end">
          <time className="mb-5 self-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[9px] font-semibold tracking-[0.08em] text-slate-500 uppercase shadow-sm">
            {briefing.dateLabel}
          </time>

          <article className="max-w-[660px] self-start rounded-3xl rounded-tl-lg border border-slate-200/80 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <header className="mb-4 flex items-center gap-3">
              <Avatar
                initials={chiefOfStaff.initials}
                palette={chiefOfStaff.avatar}
                size="small"
              />
              <div>
                <h3 className="text-xs font-semibold text-slate-950">
                  {chiefOfStaff.title}
                </h3>
                <time className="text-[10px] text-slate-400">
                  {briefing.messageTimestamp}
                </time>
              </div>
            </header>

            <p className="text-[15px] leading-6 font-semibold text-slate-950">
              {briefing.greeting}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-slate-600">
              {briefing.summary}
            </p>

            <dl className="mt-5 grid grid-cols-3 gap-2.5">
              {briefing.metrics.map((metric) => (
                <div
                  className={cn(
                    'rounded-2xl border px-3 py-3',
                    metricStyles[metric.tone],
                  )}
                  key={metric.label}
                >
                  <dd className="text-xl leading-none font-semibold">
                    {metric.value}
                  </dd>
                  <dt className="mt-1.5 text-[10px] font-semibold">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>

            <section
              aria-labelledby="focus-heading"
              className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80"
            >
              <header className="flex items-center justify-between bg-slate-50 px-4 py-3">
                <h4
                  className="text-[10px] font-semibold tracking-[0.12em] text-slate-600 uppercase"
                  id="focus-heading"
                >
                  Today’s focus
                </h4>
                <span className="flex items-center gap-1 text-[9px] font-medium text-slate-400">
                  <CheckCircle2 className="size-3" />
                  Prioritized
                </span>
              </header>
              <ul className="divide-y divide-slate-100">
                {briefing.focusItems.map((item) => (
                  <li className="flex gap-3 px-4 py-3" key={item.title}>
                    <span
                      className={cn(
                        'mt-1.5 size-2 shrink-0 rounded-full',
                        focusStyles[item.tone],
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-[9px] font-semibold text-slate-500">
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <p className="mt-4 text-[10px] leading-4 text-slate-500">
              {briefing.closingNote}
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}

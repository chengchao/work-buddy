import {
  AlertTriangle,
  ArrowUp,
  Bot,
  Check,
  ChevronDown,
  Circle,
  Clock3,
  FileText,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

import {
  employees,
  intent,
  nextPhase,
  phaseDetails,
  type PrototypePhase,
  workItems,
} from './prototype-data';

type Props = {
  phase: PrototypePhase;
  setPhase: Dispatch<SetStateAction<PrototypePhase>>;
};

export function VariantA({ phase, setPhase }: Props) {
  const isProposed = phase === 'proposed';
  const detail = phaseDetails[phase];

  return (
    <main className="flex min-h-screen bg-[#f8f8f6] font-sans text-[#20211e]">
      <aside className="flex w-[232px] shrink-0 flex-col bg-[#191a18] px-3 py-4 text-white">
        <div className="mb-7 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-xl bg-[#b7f463] text-[#192116]">
              <Sparkles className="size-4" />
            </div>
            <span className="font-semibold tracking-tight">Work Buddy</span>
          </div>
          <Search className="size-4 text-white/40" />
        </div>

        <nav className="space-y-1 text-sm">
          <button className="flex w-full items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-left font-medium">
            <Bot className="size-4 text-[#b7f463]" /> Chief of Staff
            <span className="ml-auto size-2 rounded-full bg-[#b7f463]" />
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-white/55 hover:bg-white/5">
            <Clock3 className="size-4" /> All work
          </button>
        </nav>

        <div className="mt-7 flex items-center justify-between px-3">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-white/35 uppercase">
            AI employees
          </p>
          <Plus className="size-3.5 text-white/35" />
        </div>
        <div className="mt-2 space-y-0.5">
          {employees.map((employee) => (
            <button
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-white/5"
              key={employee.name}
            >
              <span
                className={`grid size-6 place-items-center rounded-md text-[9px] font-bold text-white ${employee.color}`}
              >
                {employee.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium">
                  {employee.name}
                </span>
                <span className="block truncate text-[10px] text-white/35">
                  {employee.state}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-auto rounded-xl border border-white/8 bg-white/5 p-3">
          <p className="text-xs font-medium">3 AI employees</p>
          <p className="mt-1 text-[10px] leading-relaxed text-white/40">
            Your Chief of Staff is monitoring their work.
          </p>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col border-r border-black/8 bg-white">
        <header className="flex h-[68px] items-center justify-between border-b border-black/8 px-7">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold tracking-tight">Chief of Staff</h1>
              <span className="size-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs text-neutral-400">
              Your executive front door
            </p>
          </div>
          <button className="grid size-8 place-items-center rounded-full border border-black/8">
            <MoreHorizontal className="size-4 text-neutral-500" />
          </button>
        </header>

        <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col px-8 pb-7 pt-10">
          <div className="flex-1 space-y-7">
            <div className="ml-auto max-w-[530px] rounded-2xl rounded-br-md bg-[#eff0ed] px-4 py-3 text-sm leading-6">
              {intent}
            </div>

            <div className="flex max-w-[620px] gap-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#20211e] text-[#b7f463]">
                <Sparkles className="size-4" />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-semibold">Chief of Staff</span>
                  <span className="text-[10px] text-neutral-400">Just now</span>
                </div>
                <p className="text-sm leading-6 text-neutral-700">
                  I checked the team. No current AI Employee owns competitive
                  intelligence, so I recommend creating <b>Scout</b>. Scout will
                  own the weekly brief and bring only material changes to your
                  attention.
                </p>
              </div>
            </div>

            <div className="ml-11 overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/45 shadow-sm">
              <div className="flex items-start justify-between border-b border-violet-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-violet-600 text-xs font-bold text-white">
                    SC
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Scout</p>
                    <p className="text-xs text-neutral-500">
                      Competitive Intelligence Analyst
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-violet-700 ring-1 ring-violet-200">
                  New AI Employee
                </span>
              </div>
              <div className="grid grid-cols-2 gap-5 px-5 py-4 text-xs">
                <div>
                  <p className="mb-1 text-[10px] font-semibold tracking-wide text-neutral-400 uppercase">
                    Owns
                  </p>
                  <p className="font-medium">Weekly competitor brief</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-semibold tracking-wide text-neutral-400 uppercase">
                    First delivery
                  </p>
                  <p className="font-medium">Monday, Aug 24</p>
                </div>
              </div>
            </div>

            {!isProposed && (
              <div className="ml-11 flex items-center gap-3 rounded-2xl border border-neutral-200 px-5 py-4">
                <div className="grid size-8 place-items-center rounded-full bg-emerald-50">
                  <Check className="size-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{detail.label}</p>
                  <p className="text-xs text-neutral-500">{detail.note}</p>
                </div>
                <button
                  className="ml-auto rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
                  onClick={() => setPhase(nextPhase(phase))}
                  type="button"
                >
                  Advance demo
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-3 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
            <textarea
              className="h-14 w-full resize-none bg-transparent px-2 text-sm outline-none placeholder:text-neutral-400"
              placeholder="Tell your Chief of Staff what you need…"
            />
            <div className="flex items-center justify-between">
              <button className="grid size-8 place-items-center rounded-lg text-neutral-400 hover:bg-neutral-50">
                <Paperclip className="size-4" />
              </button>
              <button className="grid size-8 place-items-center rounded-lg bg-[#20211e] text-white">
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside className="hidden w-[316px] shrink-0 bg-[#f8f8f6] px-5 pb-20 pt-6 xl:block">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Needs your attention</h2>
          <span className="rounded-full bg-[#20211e] px-2 py-0.5 text-[10px] font-semibold text-white">
            1
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
          <div className="border-b border-black/6 px-4 py-3">
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wide text-violet-700 uppercase">
              <Circle className="size-2.5 fill-violet-600" /> Routed request
            </div>
            <h3 className="mt-2 text-sm font-semibold">
              Approve Scout and first brief
            </h3>
          </div>
          <div className="space-y-3 px-4 py-4 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-neutral-400">Owner</span>
              <span className="font-medium">Scout</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-neutral-400">External actions</span>
              <span className="font-medium">None</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-neutral-400">State</span>
              <span className="font-medium">{detail.label}</span>
            </div>
          </div>
          <div className="flex gap-2 border-t border-black/6 p-3">
            <button className="flex-1 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-neutral-50">
              Revise
            </button>
            <button
              className="flex-1 rounded-lg bg-[#20211e] px-3 py-2 text-xs font-semibold text-white disabled:bg-neutral-300"
              disabled={!isProposed}
              onClick={() => setPhase('queued')}
              type="button"
            >
              {isProposed ? 'Approve' : detail.label}
            </button>
          </div>
        </div>

        <div className="mb-3 mt-7 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Active work</h2>
          <ChevronDown className="size-4 text-neutral-400" />
        </div>
        <div className="space-y-2">
          {workItems.slice(1).map((item) => (
            <div
              className="rounded-xl border border-black/6 bg-white p-3"
              key={item.title}
            >
              <div className="flex items-start gap-2.5">
                {item.status === 'At risk' ? (
                  <AlertTriangle className="mt-0.5 size-3.5 text-amber-600" />
                ) : (
                  <FileText className="mt-0.5 size-3.5 text-blue-500" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{item.title}</p>
                  <p className="mt-1 text-[10px] text-neutral-400">
                    {item.owner} · {item.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}

import {
  AlertTriangle,
  ArrowUp,
  Bell,
  Bot,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  FileText,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

import { nextPhase, phaseDetails, type PrototypePhase } from './prototype-data';

type Props = {
  phase: PrototypePhase;
  setPhase: Dispatch<SetStateAction<PrototypePhase>>;
};

type StreamKey =
  | 'chief'
  | 'competitor'
  | 'invoices'
  | 'onboarding'
  | 'renewals';

const streams = {
  chief: {
    title: 'Chief of Staff',
    shortTitle: 'Chief of Staff',
    summary: 'Executive coordination across every AI Employee',
    owner: 'Chief of Staff',
    initials: 'CS',
    ownerColor: 'bg-[#20382c]',
    state: 'Available',
    milestone: 'Monitoring all active work',
    navStatus: 'Available',
  },
  competitor: {
    title: 'Weekly competitor brief',
    shortTitle: 'Competitor brief',
    summary: 'Product moves, pricing changes, and material decisions',
    owner: 'Scout',
    initials: 'SC',
    ownerColor: 'bg-violet-600',
    state: 'Needs approval',
    milestone: 'First brief · Monday, Aug 24',
    navStatus: 'Needs you',
  },
  invoices: {
    title: 'Invoice reconciliation',
    shortTitle: 'Invoice reconciliation',
    summary: 'August invoice matching and finance exceptions',
    owner: 'Ledger',
    initials: 'LE',
    ownerColor: 'bg-emerald-500',
    state: 'Working',
    milestone: 'Exception review · Tomorrow',
    navStatus: 'Working',
  },
  onboarding: {
    title: 'Enterprise onboarding audit',
    shortTitle: 'Onboarding audit',
    summary: 'Audit enterprise onboarding requirements and handoffs',
    owner: 'Harbor',
    initials: 'HA',
    ownerColor: 'bg-amber-500',
    state: 'At risk',
    milestone: 'Requirements decision · Wednesday',
    navStatus: 'At risk',
  },
  renewals: {
    title: 'Q3 renewal pipeline review',
    shortTitle: 'Renewal pipeline',
    summary: 'Renewal risk and executive sponsorship',
    owner: 'Harbor',
    initials: 'HA',
    ownerColor: 'bg-amber-500',
    state: 'Completed',
    milestone: 'Completed · Friday',
    navStatus: 'Done',
  },
} as const;

export function VariantD({ phase, setPhase }: Props) {
  const [selectedStream, setSelectedStream] = useState<StreamKey>('competitor');
  const stream = streams[selectedStream];
  const isCompetitor = selectedStream === 'competitor';
  const streamState = isCompetitor ? phaseDetails[phase].label : stream.state;

  return (
    <main className="flex h-screen overflow-hidden bg-[#f7f5ef] pb-16 text-[#20251f]">
      <aside className="flex w-[296px] shrink-0 flex-col border-r border-[#d8d9d1] bg-[#eff0eb]">
        <div className="flex h-[70px] shrink-0 items-center border-b border-[#d8d9d1] px-4">
          <span className="grid size-9 place-items-center rounded-xl bg-[#20382c] text-[#d9f586]">
            <Sparkles className="size-4" />
          </span>
          <div className="ml-3">
            <p className="text-sm font-bold tracking-tight">Work Buddy</p>
            <p className="text-[10px] text-[#747a71]">Executive workroom</p>
          </div>
          <button className="ml-auto grid size-8 place-items-center rounded-lg text-[#73786f] hover:bg-black/5">
            <Search className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 pb-24">
          <button
            className="mb-4 flex w-full items-center gap-3 rounded-xl border border-[#ead2bd] bg-[#fff8ef] p-3 text-left shadow-sm"
            onClick={() => setSelectedStream('competitor')}
            type="button"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#f5e2cd] text-[#a74c28]">
              <Bell className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold">
                Needs your attention
              </span>
              <span className="mt-0.5 block truncate text-[10px] text-[#8a6e5c]">
                Approve Scout and the first brief
              </span>
            </span>
            <span className="grid size-5 place-items-center rounded-full bg-[#b8502b] text-[10px] font-bold text-white">
              1
            </span>
          </button>

          <SectionHeading
            icon={<Bot className="size-3.5" />}
            label="Executive"
          />
          <button
            className={`mb-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
              selectedStream === 'chief'
                ? 'bg-[#dfe8dc] ring-1 ring-[#bacbb4]'
                : 'hover:bg-black/4'
            }`}
            onClick={() => setSelectedStream('chief')}
            type="button"
          >
            <span className="relative grid size-8 place-items-center rounded-xl bg-[#20382c] text-[10px] font-bold text-[#d9f586]">
              CS
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#eff0eb] bg-emerald-500" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold">Chief of Staff</span>
              <span className="mt-0.5 block truncate text-[10px] text-[#747a71]">
                Supervising all work
              </span>
            </span>
            <ChevronRight className="size-3.5 text-[#9ba097]" />
          </button>

          <SectionHeading
            action={<Plus className="size-3.5" />}
            icon={<BriefcaseBusiness className="size-3.5" />}
            label="Work streams"
          />
          <div className="space-y-1.5">
            <StreamButton
              active={selectedStream === 'competitor'}
              iconClass="bg-violet-100 text-violet-700"
              label="Competitor brief"
              onClick={() => setSelectedStream('competitor')}
              status={
                phase === 'proposed' ? 'Needs you' : phaseDetails[phase].label
              }
              tone="attention"
            />
            <StreamButton
              active={selectedStream === 'invoices'}
              iconClass="bg-emerald-100 text-emerald-700"
              label="Invoice reconciliation"
              onClick={() => setSelectedStream('invoices')}
              status="Working"
            />
            <StreamButton
              active={selectedStream === 'onboarding'}
              iconClass="bg-amber-100 text-amber-700"
              label="Onboarding audit"
              onClick={() => setSelectedStream('onboarding')}
              status="At risk"
              tone="risk"
            />
            <StreamButton
              active={selectedStream === 'renewals'}
              iconClass="bg-slate-200 text-slate-600"
              label="Renewal pipeline"
              onClick={() => setSelectedStream('renewals')}
              status="Done"
            />
          </div>

          <SectionHeading
            action={<Plus className="size-3.5" />}
            icon={<UsersRound className="size-3.5" />}
            label="AI Employees"
          />
          <div className="grid grid-cols-3 gap-2">
            <EmployeeCard color="bg-violet-600" initials="SC" name="Scout" />
            <EmployeeCard color="bg-emerald-500" initials="LE" name="Ledger" />
            <EmployeeCard color="bg-amber-500" initials="HA" name="Harbor" />
          </div>
        </div>

        <div className="border-t border-[#d8d9d1] bg-[#e7e9e2] p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-1.5">
            <span className="grid size-8 place-items-center rounded-full bg-[#d9f586] text-[10px] font-bold text-[#20382c]">
              CC
            </span>
            <div>
              <p className="text-xs font-bold">Chengchao</p>
              <p className="text-[10px] text-[#747a71]">Executive</p>
            </div>
            <MoreHorizontal className="ml-auto size-4 text-[#747a71]" />
          </div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 bg-white">
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[70px] shrink-0 items-center border-b border-[#e2e2dd] px-6">
            <div className="min-w-0">
              <p className="text-[9px] font-bold tracking-[0.14em] text-[#92978f] uppercase">
                {selectedStream === 'chief'
                  ? 'Executive conversation'
                  : 'Work stream'}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <h1 className="truncate text-base font-bold">{stream.title}</h1>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${statusTone(streamState)}`}
                >
                  {streamState}
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="flex h-8 items-center gap-2 rounded-lg border border-[#deded8] px-3 text-xs font-semibold text-[#5f655d] hover:bg-[#f7f5ef]">
                <FileText className="size-3.5" /> Files & decisions
              </button>
              <button className="grid size-8 place-items-center rounded-lg border border-[#deded8] text-[#5f655d] hover:bg-[#f7f5ef]">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#fdfdfb] px-7 py-6">
            {selectedStream === 'chief' ? (
              <ChiefConversation />
            ) : (
              <WorkConversation
                phase={phase}
                selectedStream={selectedStream}
                setPhase={setPhase}
              />
            )}
          </div>

          <div className="shrink-0 border-t border-[#e7e7e2] bg-white px-6 pb-4 pt-3">
            <div className="rounded-2xl border border-[#cfd1ca] bg-white p-3 shadow-[0_7px_24px_rgba(35,45,37,0.07)] focus-within:border-[#70866e]">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-[#767b73]">
                <span
                  className={`grid size-5 place-items-center rounded-md text-[8px] font-bold text-white ${stream.ownerColor}`}
                >
                  {stream.initials}
                </span>
                Talking with {stream.owner} in {stream.shortTitle}
              </div>
              <textarea
                className="h-10 w-full resize-none bg-transparent text-sm outline-none placeholder:text-[#a3a69f]"
                placeholder={`Message about ${stream.shortTitle}…`}
              />
              <div className="flex items-center gap-1 text-[#747a71]">
                <button className="grid size-7 place-items-center rounded-lg hover:bg-[#f0f1ec]">
                  <Plus className="size-4" />
                </button>
                <button className="grid size-7 place-items-center rounded-lg hover:bg-[#f0f1ec]">
                  <Paperclip className="size-4" />
                </button>
                <button className="ml-auto grid size-8 place-items-center rounded-xl bg-[#20382c] text-white">
                  <ArrowUp className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden w-[312px] shrink-0 border-l border-[#dfdfd9] bg-[#f6f3ec] xl:flex xl:flex-col">
          <div className="flex h-[70px] items-center border-b border-[#dfdfd9] px-5">
            <div>
              <p className="text-[9px] font-bold tracking-[0.14em] text-[#92978f] uppercase">
                At a glance
              </p>
              <h2 className="mt-1 text-sm font-bold">Work stream details</h2>
            </div>
            <ChevronDown className="ml-auto size-4 text-[#777c74]" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 pb-24">
            <div className="rounded-2xl border border-[#deded7] bg-white p-4 shadow-sm">
              <p className="text-[9px] font-bold tracking-[0.12em] text-[#989c95] uppercase">
                Accountable owner
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span
                  className={`grid size-11 place-items-center rounded-2xl text-xs font-bold text-white ${stream.ownerColor}`}
                >
                  {stream.initials}
                </span>
                <div>
                  <p className="text-sm font-bold">{stream.owner}</p>
                  <p className="text-[10px] text-[#7c8179]">AI Employee</p>
                </div>
              </div>
            </div>

            <div className="mt-3 divide-y divide-[#e6e5df] rounded-2xl border border-[#deded7] bg-white px-4 shadow-sm">
              <DetailRow
                icon={<Circle className="size-3.5" />}
                label="State"
                value={streamState}
              />
              <DetailRow
                icon={<Clock3 className="size-3.5" />}
                label="Next"
                value={stream.milestone}
              />
              <DetailRow
                icon={<AlertTriangle className="size-3.5" />}
                label="Risk"
                value={selectedStream === 'onboarding' ? 'Schedule' : 'None'}
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold tracking-[0.14em] text-[#767b73] uppercase">
                  Follow-through
                </p>
                <span className="text-[9px] text-[#9b9f98]">Today</span>
              </div>
              <div className="mt-3 space-y-4 border-l border-[#d5d8d0] pl-4">
                <TimelineItem label="Chief of Staff checked ownership" />
                <TimelineItem label={`${stream.owner} posted an update`} />
                <TimelineItem label="Next milestone scheduled" muted />
              </div>
            </div>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d8d9d2] bg-white px-3 py-2.5 text-xs font-bold shadow-sm hover:bg-[#fbfaf7]">
              Open work record <ChevronRight className="size-3.5" />
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

function WorkConversation({
  phase,
  selectedStream,
  setPhase,
}: {
  phase: PrototypePhase;
  selectedStream: Exclude<StreamKey, 'chief'>;
  setPhase: Dispatch<SetStateAction<PrototypePhase>>;
}) {
  const stream = streams[selectedStream];

  if (selectedStream !== 'competitor') {
    const body =
      selectedStream === 'invoices'
        ? 'I matched 184 of 192 invoices. Eight exceptions remain, and I am grouping them by resolution path before tomorrow’s review.'
        : selectedStream === 'onboarding'
          ? 'Two requirements conflict. I am testing a safe interpretation with the Chief of Staff. I will ask for judgment only if the schedule risk becomes material.'
          : 'The Q3 renewal review is complete. Three accounts need executive sponsorship; the final brief and evidence are attached.';

    return (
      <div className="mx-auto max-w-[760px]">
        <ConversationDivider label="Today" />
        <ConversationMessage
          avatar={stream.initials}
          avatarClass={stream.ownerColor}
          name={stream.owner}
          time="9:42 AM"
        >
          {body}
        </ConversationMessage>
        <ConversationMessage
          avatar="CS"
          avatarClass="bg-[#20382c]"
          name="Chief of Staff"
          time="9:47 AM"
        >
          I’m monitoring this work stream. No executive action is needed right
          now.
        </ConversationMessage>
      </div>
    );
  }

  const isProposed = phase === 'proposed';
  const detail = phaseDetails[phase];

  return (
    <div className="mx-auto max-w-[760px]">
      <ConversationDivider label="Today" />
      <ConversationMessage
        avatar="CC"
        avatarClass="bg-[#d9f586] text-[#20382c]"
        name="You"
        time="9:04 AM"
      >
        Launch a weekly competitor brief. Focus on key product moves, pricing
        changes, and what needs my attention every Monday.
      </ConversationMessage>
      <ConversationMessage
        avatar="CS"
        avatarClass="bg-[#20382c]"
        name="Chief of Staff"
        time="9:05 AM"
      >
        I checked the team. No current AI Employee owns competitive
        intelligence, so I recommend creating Scout as the accountable owner.
      </ConversationMessage>

      <div className="ml-12 mt-4 overflow-hidden rounded-2xl border border-[#d9d0e4] bg-[#fbf8fd] shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#e7dfea] px-4 py-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-violet-600 text-xs font-bold text-white">
            SC
          </span>
          <div>
            <p className="text-sm font-bold">Create Scout</p>
            <p className="text-[10px] text-[#70756d]">
              Competitive Intelligence Analyst
            </p>
          </div>
          <span className="ml-auto rounded-full bg-[#eee5f3] px-2.5 py-1 text-[9px] font-bold text-[#6e2f76]">
            {detail.label}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 px-4 py-3 text-xs">
          <ApprovalField label="Owns" value="Weekly competitor brief" />
          <ApprovalField label="First delivery" value="Mon, Aug 24" />
          <ApprovalField label="External actions" value="None" />
        </div>
        <div className="flex items-center border-t border-[#e7dfea] bg-white px-4 py-3">
          <div>
            <p className="text-xs font-bold">{detail.label}</p>
            <p className="text-[10px] text-[#777c74]">{detail.note}</p>
          </div>
          <div className="ml-auto flex gap-2">
            {isProposed && (
              <button className="rounded-lg border border-[#d9d9d3] px-3 py-1.5 text-xs font-bold hover:bg-[#f7f5ef]">
                Revise
              </button>
            )}
            <button
              className="rounded-lg bg-[#20382c] px-3 py-1.5 text-xs font-bold text-white"
              onClick={() => setPhase(nextPhase(phase))}
              type="button"
            >
              {isProposed ? 'Approve & assign' : 'Advance demo'}
            </button>
          </div>
        </div>
      </div>

      {!isProposed && (
        <ConversationMessage
          avatar="SC"
          avatarClass="bg-violet-600"
          name="Scout"
          time="Just now"
        >
          {phase === 'queued'
            ? 'I have the request. I’m setting up the sources and preparing the first brief.'
            : phase === 'working'
              ? 'The first brief is in progress. I’ll post the result here and escalate only material decisions.'
              : 'The first brief is ready. I added the summary and supporting evidence to this work stream.'}
        </ConversationMessage>
      )}
    </div>
  );
}

function ChiefConversation() {
  return (
    <div className="mx-auto max-w-[760px]">
      <ConversationDivider label="Today" />
      <ConversationMessage
        avatar="CS"
        avatarClass="bg-[#20382c]"
        name="Chief of Staff"
        time="9:00 AM"
      >
        Good morning. Three work streams are active. Scout needs approval for
        the competitor brief; I’m handling the other work without interruption.
      </ConversationMessage>
    </div>
  );
}

function ConversationMessage({
  avatar,
  avatarClass,
  children,
  name,
  time,
}: {
  avatar: string;
  avatarClass: string;
  children: React.ReactNode;
  name: string;
  time: string;
}) {
  return (
    <div className="relative flex gap-3 py-3">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-xl text-[10px] font-bold text-white ${avatarClass}`}
      >
        {avatar}
      </span>
      <div className="min-w-0 pt-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold">{name}</span>
          <span className="text-[9px] text-[#9ca098]">{time}</span>
        </div>
        <p className="mt-1 text-sm leading-5 text-[#51574f]">{children}</p>
      </div>
    </div>
  );
}

function ConversationDivider({ label }: { label: string }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <span className="h-px flex-1 bg-[#e7e7e2]" />
      <span className="text-[9px] font-bold tracking-[0.12em] text-[#9b9f98] uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-[#e7e7e2]" />
    </div>
  );
}

function SectionHeading({
  action,
  icon,
  label,
}: {
  action?: React.ReactNode;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="mb-2 mt-5 flex items-center gap-2 px-2 text-[9px] font-bold tracking-[0.13em] text-[#848980] uppercase first:mt-0">
      {icon} {label}
      {action && (
        <button className="ml-auto grid size-6 place-items-center rounded-md hover:bg-black/5">
          {action}
        </button>
      )}
    </div>
  );
}

function StreamButton({
  active,
  iconClass,
  label,
  onClick,
  status,
  tone,
}: {
  active: boolean;
  iconClass: string;
  label: string;
  onClick: () => void;
  status: string;
  tone?: 'attention' | 'risk';
}) {
  return (
    <button
      className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        active ? 'bg-white shadow-sm ring-1 ring-[#d5d7cf]' : 'hover:bg-black/4'
      }`}
      onClick={onClick}
      type="button"
    >
      {active && (
        <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#4f745b]" />
      )}
      <span
        className={`grid size-8 place-items-center rounded-xl ${iconClass}`}
      >
        <BriefcaseBusiness className="size-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-bold">{label}</span>
        <span
          className={`mt-0.5 block text-[9px] font-semibold ${
            tone === 'attention'
              ? 'text-[#ad4b28]'
              : tone === 'risk'
                ? 'text-amber-700'
                : 'text-[#7b8078]'
          }`}
        >
          {status}
        </span>
      </span>
      <ChevronRight className="size-3.5 text-[#a1a59e]" />
    </button>
  );
}

function EmployeeCard({
  color,
  initials,
  name,
}: {
  color: string;
  initials: string;
  name: string;
}) {
  return (
    <button className="rounded-xl border border-[#d9dad3] bg-white px-2 py-2.5 text-center shadow-sm hover:border-[#bfc3b9]">
      <span
        className={`mx-auto grid size-7 place-items-center rounded-lg text-[9px] font-bold text-white ${color}`}
      >
        {initials}
      </span>
      <span className="mt-1.5 block truncate text-[9px] font-bold">{name}</span>
    </button>
  );
}

function ApprovalField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[8px] font-bold tracking-wide text-[#9b9f98] uppercase">
        {label}
      </p>
      <p className="mt-1 text-[10px] font-bold">{value}</p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5">
      <span className="mt-0.5 text-[#8e938a]">{icon}</span>
      <div>
        <p className="text-[9px] text-[#999d96]">{label}</p>
        <p className="mt-1 text-xs font-bold">{value}</p>
      </div>
    </div>
  );
}

function TimelineItem({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <div className="relative">
      <span
        className={`absolute -left-[21px] top-1 size-2 rounded-full ring-4 ring-[#f6f3ec] ${
          muted ? 'bg-[#c7cac3]' : 'bg-[#4f745b]'
        }`}
      />
      <p
        className={`text-[10px] ${muted ? 'text-[#a0a49d]' : 'text-[#61675f]'}`}
      >
        {label}
      </p>
    </div>
  );
}

function statusTone(state: string) {
  if (state === 'Proposed' || state === 'Needs approval') {
    return 'bg-[#f8e7db] text-[#9e4728]';
  }
  if (state === 'At risk') return 'bg-amber-100 text-amber-800';
  if (state === 'Completed') return 'bg-emerald-100 text-emerald-700';
  return 'bg-[#e5eee2] text-[#3f694c]';
}

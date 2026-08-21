import {
  Bell,
  Bot,
  BriefcaseBusiness,
  CheckCheck,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  MessageCircle,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Pin,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useState } from 'react';

import { nextPhase, phaseDetails, type PrototypePhase } from './prototype-data';

type Props = {
  phase: PrototypePhase;
  setPhase: Dispatch<SetStateAction<PrototypePhase>>;
};

type WorkKey = 'chief' | 'competitor' | 'invoices' | 'onboarding' | 'renewals';
type FolderKey = 'all' | 'attention' | 'working' | 'finance' | 'customers';

const folderWork: Record<FolderKey, WorkKey[]> = {
  all: ['chief', 'competitor', 'invoices', 'onboarding', 'renewals'],
  attention: ['competitor', 'onboarding'],
  working: ['chief', 'invoices', 'onboarding'],
  finance: ['invoices'],
  customers: ['onboarding', 'renewals'],
};

const workStreams = {
  chief: {
    title: 'Chief of Staff',
    owner: 'Chief of Staff',
    role: 'Executive coordinator',
    initials: 'CS',
    avatar: 'bg-gradient-to-br from-sky-500 to-blue-700',
    preview: '3 work streams active · 1 needs you',
    time: '9:08 AM',
    state: 'Monitoring 3 AI Employees',
    next: 'Watching every active work stream',
  },
  competitor: {
    title: 'Weekly competitor brief',
    owner: 'Scout',
    role: 'Competitive Intelligence Analyst',
    initials: 'SC',
    avatar: 'bg-gradient-to-br from-violet-400 to-violet-700',
    preview: 'Chief of Staff: Approval ready',
    time: '9:05 AM',
    state: 'Needs approval',
    next: 'First brief · Mon, Aug 24',
  },
  invoices: {
    title: 'Invoice reconciliation',
    owner: 'Ledger',
    role: 'Finance Operations',
    initials: 'LE',
    avatar: 'bg-gradient-to-br from-emerald-400 to-teal-700',
    preview: 'Ledger: 8 exceptions remain',
    time: '8:42 AM',
    state: 'Working',
    next: 'Exception review · Tomorrow',
  },
  onboarding: {
    title: 'Enterprise onboarding audit',
    owner: 'Harbor',
    role: 'Customer Operations',
    initials: 'HA',
    avatar: 'bg-gradient-to-br from-amber-400 to-orange-600',
    preview: 'Chief is monitoring schedule risk',
    time: 'Wed',
    state: 'At risk',
    next: 'Requirements decision · Wed',
  },
  renewals: {
    title: 'Q3 renewal pipeline review',
    owner: 'Harbor',
    role: 'Customer Operations',
    initials: 'HA',
    avatar: 'bg-gradient-to-br from-amber-400 to-orange-600',
    preview: 'Harbor: Final review attached',
    time: 'Fri',
    state: 'Completed',
    next: 'Completed · Friday',
  },
} as const;

export function VariantF({ phase, setPhase }: Props) {
  const [selectedFolder, setSelectedFolder] = useState<FolderKey>('all');
  const [selectedWork, setSelectedWork] = useState<WorkKey>('competitor');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const work = workStreams[selectedWork];
  const state =
    selectedWork === 'competitor' ? phaseDetails[phase].label : work.state;

  function selectWork(key: WorkKey) {
    setSelectedWork(key);
    setDetailsOpen(false);
  }

  function selectFolder(folder: FolderKey) {
    setSelectedFolder(folder);
    const visibleWork = folderWork[folder];
    if (!visibleWork.includes(selectedWork)) {
      selectWork(visibleWork[0]);
    }
  }

  return (
    <main className="flex h-screen overflow-hidden bg-[#d7e3ec] pb-16 text-[#17212b]">
      <aside className="flex w-[438px] shrink-0 bg-white">
        <FolderRail selected={selectedFolder} select={selectFolder} />

        <div className="relative flex min-w-0 flex-1 flex-col border-r border-[#d9e1e7]">
          <header className="flex h-[62px] shrink-0 items-center px-3">
            <label className="flex h-10 min-w-0 flex-1 items-center rounded-full bg-[#f1f3f5] px-4 text-[#8796a1] focus-within:ring-2 focus-within:ring-[#3390ec]/25">
              <Search className="size-4 shrink-0" />
              <input
                className="ml-3 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8796a1]"
                placeholder="Search"
              />
            </label>
            <IconButton label="Chat list options">
              <MoreVertical className="size-5" />
            </IconButton>
          </header>

          <div className="flex-1 overflow-y-auto py-1">
            {folderWork[selectedFolder].map((key) => (
              <ChatRow
                active={selectedWork === key}
                key={key}
                onClick={() => selectWork(key)}
                pinned={key === 'chief'}
                unread={
                  key === 'competitor' && phase === 'proposed' ? 1 : undefined
                }
                warning={key === 'onboarding'}
                workKey={key}
              />
            ))}
          </div>

          <button
            className="absolute right-5 bottom-5 grid size-14 place-items-center rounded-full bg-[#3390ec] text-white shadow-[0_4px_16px_rgba(51,144,236,0.35)] transition hover:bg-[#2b80d2]"
            type="button"
          >
            <Sparkles className="size-5" />
            <span className="sr-only">Start new work</span>
          </button>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[62px] shrink-0 items-center border-b border-[#dfe6eb] bg-white px-4 shadow-sm">
            <button
              className="flex min-w-0 flex-1 items-center text-left"
              onClick={() => setDetailsOpen(true)}
              type="button"
            >
              <Avatar
                avatar={work.avatar}
                initials={work.initials}
                size="small"
              />
              <span className="ml-3 min-w-0">
                <span className="block truncate text-sm font-semibold">
                  {work.title}
                </span>
                <span className="block truncate text-xs text-[#3390ec]">
                  {work.owner} · {state}
                </span>
              </span>
            </button>
            <div className="flex items-center gap-1 text-[#70808c]">
              <IconButton label="Search conversation">
                <Search className="size-5" />
              </IconButton>
              <IconButton label="Open activity call">
                <Phone className="size-5" />
              </IconButton>
              <IconButton label="More options">
                <MoreVertical className="size-5" />
              </IconButton>
            </div>
          </header>

          <button
            className="flex h-[52px] shrink-0 items-center border-b border-[#dce5eb] bg-white px-4 text-left shadow-sm"
            onClick={() => setDetailsOpen(true)}
            type="button"
          >
            <span className="mr-3 h-8 w-0.5 rounded-full bg-[#3390ec]" />
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e7f3fd] text-[#3390ec]">
              <Pin className="size-4" />
            </span>
            <span className="ml-3 min-w-0 flex-1">
              <span className="block text-[11px] font-semibold text-[#3390ec]">
                Pinned work context
              </span>
              <span className="block truncate text-xs text-[#5f6f7a]">
                {state} · Owner: {work.owner} · {work.next}
              </span>
            </span>
            <ChevronRight className="size-4 text-[#9aa8b2]" />
          </button>

          <div
            className="min-h-0 flex-1 overflow-y-auto px-6 py-5"
            style={{
              backgroundColor: '#d8e6ef',
              backgroundImage:
                'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.38) 2px, transparent 2.5px), radial-gradient(circle at 65px 70px, rgba(93,131,157,0.08) 1.5px, transparent 2px)',
              backgroundSize: '92px 92px',
            }}
          >
            {selectedWork === 'chief' ? (
              <ChiefConversation />
            ) : (
              <WorkConversation
                phase={phase}
                selectedWork={selectedWork}
                setPhase={setPhase}
              />
            )}
          </div>

          <footer className="flex h-[64px] shrink-0 items-center gap-1 border-t border-[#dce5eb] bg-white px-3">
            <IconButton label="Attach file">
              <Paperclip className="size-5" />
            </IconButton>
            <input
              className="min-w-0 flex-1 px-2 text-sm outline-none placeholder:text-[#8b9aa5]"
              placeholder={`Message ${work.owner} about this work stream`}
            />
            <IconButton label="Add reaction">
              <Smile className="size-5" />
            </IconButton>
            <button
              className="grid size-10 place-items-center rounded-full text-[#3390ec] transition hover:bg-[#e7f3fd]"
              type="button"
            >
              {selectedWork === 'competitor' ? (
                <Send className="size-5" />
              ) : (
                <Mic className="size-5" />
              )}
            </button>
          </footer>
        </div>

        {detailsOpen && (
          <WorkDetails
            close={() => setDetailsOpen(false)}
            phase={phase}
            workKey={selectedWork}
          />
        )}
      </section>
    </main>
  );
}

function WorkConversation({
  phase,
  selectedWork,
  setPhase,
}: {
  phase: PrototypePhase;
  selectedWork: Exclude<WorkKey, 'chief'>;
  setPhase: Dispatch<SetStateAction<PrototypePhase>>;
}) {
  const work = workStreams[selectedWork];

  if (selectedWork !== 'competitor') {
    const update =
      selectedWork === 'invoices'
        ? 'I matched 184 of 192 invoices. Eight exceptions remain, and I’m grouping them by resolution path before tomorrow’s review.'
        : selectedWork === 'onboarding'
          ? 'Two requirements conflict. I’m testing the safest interpretation with the Chief of Staff and will escalate only if executive judgment is required.'
          : 'The renewal review is complete. Three accounts need executive sponsorship; the final brief and evidence are attached.';

    return (
      <ConversationFrame>
        <DateChip />
        <MessageBubble incoming name={work.owner} time="9:42 AM">
          {update}
        </MessageBubble>
        <MessageBubble incoming name="Chief of Staff" time="9:47 AM">
          I’m monitoring this work stream. No executive action is needed right
          now.
        </MessageBubble>
      </ConversationFrame>
    );
  }

  const proposed = phase === 'proposed';
  const detail = phaseDetails[phase];

  return (
    <ConversationFrame>
      <DateChip />
      <MessageBubble time="9:04 AM">
        Launch a weekly competitor brief. Focus on product moves, pricing
        changes, and what needs my attention every Monday.
      </MessageBubble>
      <MessageBubble incoming name="Chief of Staff" time="9:05 AM">
        No current AI Employee owns competitive intelligence. I recommend
        creating Scout as the accountable owner.
      </MessageBubble>

      <div className="mb-2 w-full max-w-[560px] self-start overflow-hidden rounded-xl rounded-tl-sm bg-white shadow-[0_1px_2px_rgba(34,58,76,0.18)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar
            avatar={workStreams.competitor.avatar}
            initials="SC"
            size="small"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Create Scout</p>
            <p className="truncate text-[11px] text-[#778690]">
              Competitive Intelligence Analyst
            </p>
          </div>
          <span className="rounded-full bg-[#e7f3fd] px-2.5 py-1 text-[10px] font-semibold text-[#2b83cb]">
            {detail.label}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 border-y border-[#edf1f4] px-4 py-3">
          <ApprovalField label="Owns" value="Competitor brief" />
          <ApprovalField label="First delivery" value="Mon, Aug 24" />
          <ApprovalField label="External actions" value="None" />
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">{detail.label}</p>
            <p className="truncate text-[10px] text-[#778690]">{detail.note}</p>
          </div>
          {proposed && (
            <button
              className="rounded-lg px-3 py-2 text-xs font-semibold text-[#3390ec] hover:bg-[#e7f3fd]"
              type="button"
            >
              REVISE
            </button>
          )}
          <button
            className="rounded-lg bg-[#3390ec] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2b80d2]"
            onClick={() => setPhase(nextPhase(phase))}
            type="button"
          >
            {proposed ? 'APPROVE & ASSIGN' : 'ADVANCE DEMO'}
          </button>
        </div>
      </div>

      {!proposed && (
        <MessageBubble incoming name="Scout" time="Just now">
          {phase === 'queued'
            ? 'I have the request. I’m preparing the sources and the first brief.'
            : phase === 'working'
              ? 'The first brief is in progress. I’ll post the result here and escalate only material decisions.'
              : 'The first brief is ready. The summary and supporting evidence are attached.'}
        </MessageBubble>
      )}
    </ConversationFrame>
  );
}

function ChiefConversation() {
  return (
    <ConversationFrame>
      <DateChip />
      <MessageBubble incoming name="Chief of Staff" time="9:00 AM">
        Good morning. Three work streams are active. Scout needs approval for
        the competitor brief; I’m supervising the other work without
        interruption.
      </MessageBubble>
      <div className="mt-1 grid max-w-[560px] grid-cols-3 gap-2 self-start">
        <SummaryChip label="Working" value="2" />
        <SummaryChip label="Needs you" value="1" />
        <SummaryChip label="At risk" value="1" warning />
      </div>
    </ConversationFrame>
  );
}

function WorkDetails({
  close,
  phase,
  workKey,
}: {
  close: () => void;
  phase: PrototypePhase;
  workKey: WorkKey;
}) {
  const work = workStreams[workKey];
  const state =
    workKey === 'competitor' ? phaseDetails[phase].label : work.state;

  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-l border-[#d9e1e7] bg-white">
      <header className="flex h-[62px] items-center border-b border-[#e7ecef] px-3">
        <IconButton label="Close details" onClick={close}>
          <X className="size-5" />
        </IconButton>
        <h2 className="ml-3 text-sm font-semibold">Work stream info</h2>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-[#e7ecef] px-5 py-6 text-center">
          <Avatar avatar={work.avatar} initials={work.initials} size="large" />
          <h3 className="mt-3 text-base font-semibold">{work.title}</h3>
          <p className="mt-1 text-xs text-[#778690]">Owner: {work.owner}</p>
        </div>

        <div className="border-b border-[#e7ecef] px-4 py-3">
          <DetailRow icon={<BriefcaseBusiness />} label="State" value={state} />
          <DetailRow
            icon={<Clock3 />}
            label="Next milestone"
            value={work.next}
          />
          <DetailRow
            icon={<ShieldCheck />}
            label="Supervision"
            value="Chief of Staff monitoring"
          />
        </div>

        <div className="border-b border-[#e7ecef] px-4 py-3">
          <p className="px-2 py-2 text-xs font-semibold text-[#3390ec]">
            3 PARTICIPANTS
          </p>
          <Participant
            avatar="bg-gradient-to-br from-sky-500 to-blue-700"
            initials="CS"
            name="Chief of Staff"
            role="Supervisor"
          />
          <Participant
            avatar={work.avatar}
            initials={work.initials}
            name={work.owner}
            role="Accountable owner"
          />
          <Participant
            avatar="bg-gradient-to-br from-slate-400 to-slate-600"
            initials="CC"
            name="You"
            role="Executive"
          />
        </div>

        <div className="px-4 py-3">
          <p className="px-2 py-2 text-xs font-semibold text-[#3390ec]">
            SHARED WORK
          </p>
          <DetailRow
            icon={<FileText />}
            label="Evidence"
            value="4 linked files"
          />
          <DetailRow
            icon={<Bell />}
            label="Updates"
            value="Material changes only"
          />
          <DetailRow
            icon={<Info />}
            label="Risk"
            value={workKey === 'onboarding' ? 'Schedule' : 'None'}
          />
        </div>
      </div>
    </aside>
  );
}

function ChatRow({
  active,
  onClick,
  pinned,
  unread,
  warning,
  workKey,
}: {
  active: boolean;
  onClick: () => void;
  pinned?: boolean;
  unread?: number;
  warning?: boolean;
  workKey: WorkKey;
}) {
  const work = workStreams[workKey];
  return (
    <button
      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${active ? 'bg-[#3390ec] text-white' : 'hover:bg-[#f3f5f7]'}`}
      onClick={onClick}
      type="button"
    >
      <Avatar avatar={work.avatar} initials={work.initials} size="medium" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {work.title}
          </span>
          <span
            className={`text-[10px] ${active ? 'text-blue-100' : unread ? 'text-[#3390ec]' : 'text-[#8b9aa5]'}`}
          >
            {work.time}
          </span>
        </span>
        <span className="mt-1 flex items-center gap-2">
          <span
            className={`min-w-0 flex-1 truncate text-xs ${active ? 'text-blue-50' : warning ? 'text-amber-600' : 'text-[#778690]'}`}
          >
            {work.preview}
          </span>
          {pinned && (
            <Pin
              className={`size-3.5 ${active ? 'text-white' : 'text-[#9aa8b2]'}`}
            />
          )}
          {unread && (
            <span
              className={`grid size-5 place-items-center rounded-full text-[10px] font-semibold ${active ? 'bg-white text-[#3390ec]' : 'bg-[#3390ec] text-white'}`}
            >
              {unread}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

function MessageBubble({
  children,
  incoming,
  name,
  time,
}: {
  children: ReactNode;
  incoming?: boolean;
  name?: string;
  time: string;
}) {
  return (
    <div
      className={`mb-2 max-w-[72%] rounded-xl px-3 py-2 shadow-[0_1px_2px_rgba(34,58,76,0.18)] ${incoming ? 'self-start rounded-tl-sm bg-white' : 'self-end rounded-br-sm bg-[#effdde]'}`}
    >
      {name && (
        <p className="mb-1 text-[11px] font-semibold text-[#3390ec]">{name}</p>
      )}
      <p className="text-[13px] leading-5">{children}</p>
      <span className="mt-0.5 flex items-center justify-end gap-1 text-[9px] text-[#81909a]">
        {time}
        {!incoming && <CheckCheck className="size-3 text-[#3390ec]" />}
      </span>
    </div>
  );
}

function ConversationFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full max-w-[820px] flex-col justify-end">
      {children}
    </div>
  );
}

function DateChip() {
  return (
    <span className="mb-4 self-center rounded-full bg-[#7996aa]/75 px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur">
      August 20
    </span>
  );
}

function FolderRail({
  select,
  selected,
}: {
  select: (folder: FolderKey) => void;
  selected: FolderKey;
}) {
  return (
    <nav
      aria-label="Chat folders"
      className="flex w-[78px] shrink-0 flex-col border-r border-[#dfe5e9] bg-[#f1f3f5]"
    >
      <button
        aria-label="Account menu"
        className="mx-auto my-3 grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-xs font-bold text-white shadow-sm"
        type="button"
      >
        WB
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto py-1">
        <FolderButton
          count="1"
          folder="all"
          icon={<MessageCircle />}
          label="All chats"
          select={select}
          selected={selected}
        />
        <FolderButton
          count="1"
          folder="attention"
          icon={<Bell />}
          label="Needs you"
          select={select}
          selected={selected}
        />
        <FolderButton
          folder="working"
          icon={<BriefcaseBusiness />}
          label="Working"
          select={select}
          selected={selected}
        />
        <FolderButton
          folder="finance"
          icon={<FileText />}
          label="Finance"
          select={select}
          selected={selected}
        />
        <FolderButton
          folder="customers"
          icon={<Users />}
          label="Customers"
          select={select}
          selected={selected}
        />
      </div>

      <button
        aria-label="Edit chat folders"
        className="flex h-16 shrink-0 flex-col items-center justify-center gap-1 text-[#778690] transition hover:bg-[#e5e9ec]"
        type="button"
      >
        <MoreVertical className="size-5" />
        <span className="text-[9px] font-medium">More</span>
      </button>
    </nav>
  );
}

function FolderButton({
  count,
  folder,
  icon,
  label,
  select,
  selected,
}: {
  count?: string;
  folder: FolderKey;
  icon: ReactNode;
  label: string;
  select: (folder: FolderKey) => void;
  selected: FolderKey;
}) {
  const active = folder === selected;
  return (
    <button
      aria-pressed={active}
      className={`relative flex h-[68px] w-full flex-col items-center justify-center gap-1 transition ${active ? 'bg-[#dfeaf4] text-[#3390ec]' : 'text-[#778690] hover:bg-[#e5e9ec]'}`}
      onClick={() => select(folder)}
      type="button"
    >
      {active && (
        <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-[#3390ec]" />
      )}
      <span className="relative [&>svg]:size-5">
        {icon}
        {count && (
          <span className="absolute -top-2 -right-3 grid size-4 place-items-center rounded-full bg-[#3390ec] text-[8px] font-bold text-white ring-2 ring-[#f1f3f5]">
            {count}
          </span>
        )}
      </span>
      <span className="max-w-[70px] truncate text-[9px] font-medium">
        {label}
      </span>
    </button>
  );
}

function Avatar({
  avatar,
  initials,
  size,
}: {
  avatar: string;
  initials: string;
  size: 'small' | 'medium' | 'large';
}) {
  const sizeClass =
    size === 'large'
      ? 'size-20 text-lg'
      : size === 'medium'
        ? 'size-12 text-xs'
        : 'size-10 text-[11px]';
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full font-bold text-white ${avatar} ${sizeClass}`}
    >
      {initials}
    </span>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="grid size-10 shrink-0 place-items-center rounded-full text-[#70808c] transition hover:bg-[#f0f3f5]"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ApprovalField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-semibold tracking-wide text-[#8b9aa5] uppercase">
        {label}
      </p>
      <p className="mt-1 text-[11px] font-medium">{value}</p>
    </div>
  );
}

function SummaryChip({
  label,
  value,
  warning,
}: {
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white px-3 py-2 shadow-[0_1px_2px_rgba(34,58,76,0.18)]">
      <p
        className={`text-lg font-semibold ${warning ? 'text-amber-600' : 'text-[#3390ec]'}`}
      >
        {value}
      </p>
      <p className="text-[10px] text-[#778690]">{label}</p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-[#f4f6f8]">
      <span className="text-[#778690] [&>svg]:size-5">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[10px] text-[#8b9aa5]">{label}</span>
        <span className="block truncate text-xs font-medium">{value}</span>
      </span>
    </div>
  );
}

function Participant({
  avatar,
  initials,
  name,
  role,
}: {
  avatar: string;
  initials: string;
  name: string;
  role: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[#f4f6f8]">
      <Avatar avatar={avatar} initials={initials} size="small" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">{name}</p>
        <p className="text-[10px] text-[#778690]">{role}</p>
      </div>
      {role === 'Supervisor' && <Bot className="size-4 text-[#3390ec]" />}
      {role === 'Accountable owner' && (
        <Users className="size-4 text-[#8b9aa5]" />
      )}
    </div>
  );
}

import {
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Clock3,
  Info,
  MessageCirclePlus,
  MoreVertical,
  Paperclip,
  Plus,
  Search,
  Send,
  Smile,
  UsersRound,
  Video,
  X,
} from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

import { nextPhase, phaseDetails, type PrototypePhase } from './prototype-data';

type Props = {
  phase: PrototypePhase;
  setPhase: Dispatch<SetStateAction<PrototypePhase>>;
};

type ChatKey = 'chief' | 'competitor' | 'invoices' | 'onboarding' | 'renewals';

const chats = {
  chief: {
    title: 'Chief of Staff',
    owner: 'Chief of Staff',
    role: 'Executive coordinator',
    initials: 'CS',
    color: 'bg-[#1f4d42]',
    preview: 'Three work streams are active.',
    time: '9:00 AM',
    status: 'Monitoring 3 AI Employees',
    next: 'Watching all active work',
  },
  competitor: {
    title: 'Weekly competitor brief',
    owner: 'Scout',
    role: 'Competitive Intelligence Analyst',
    initials: 'SC',
    color: 'bg-violet-600',
    preview: 'Chief of Staff: Approval ready',
    time: '9:05 AM',
    status: 'Needs approval',
    next: 'First brief · Mon, Aug 24',
  },
  invoices: {
    title: 'Invoice reconciliation',
    owner: 'Ledger',
    role: 'Finance Operations',
    initials: 'LE',
    color: 'bg-emerald-500',
    preview: 'Ledger: Eight exceptions remain.',
    time: '8:42 AM',
    status: 'Working',
    next: 'Exception review · Tomorrow',
  },
  onboarding: {
    title: 'Enterprise onboarding audit',
    owner: 'Harbor',
    role: 'Customer Operations',
    initials: 'HA',
    color: 'bg-amber-500',
    preview: 'Chief is monitoring a schedule risk.',
    time: 'Yesterday',
    status: 'At risk',
    next: 'Requirements decision · Wed',
  },
  renewals: {
    title: 'Q3 renewal pipeline review',
    owner: 'Harbor',
    role: 'Customer Operations',
    initials: 'HA',
    color: 'bg-amber-500',
    preview: 'Harbor: Final review attached.',
    time: 'Friday',
    status: 'Completed',
    next: 'Completed · Friday',
  },
} as const;

export function VariantE({ phase, setPhase }: Props) {
  const [selectedChat, setSelectedChat] = useState<ChatKey>('competitor');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const chat = chats[selectedChat];
  const chatStatus =
    selectedChat === 'competitor' ? phaseDetails[phase].label : chat.status;

  function selectChat(chatKey: ChatKey) {
    setSelectedChat(chatKey);
    setDetailsOpen(false);
  }

  return (
    <main className="flex h-screen overflow-hidden bg-[#d9dbd5] pb-16 text-[#111b21]">
      <aside className="flex w-[360px] shrink-0 flex-col border-r border-[#d4d7d5] bg-white">
        <header className="flex h-[62px] shrink-0 items-center bg-[#f0f2f5] px-4">
          <span className="grid size-10 place-items-center rounded-full bg-[#075e54] text-xs font-bold text-white">
            WB
          </span>
          <div className="ml-auto flex items-center gap-1 text-[#54656f]">
            <button className="grid size-9 place-items-center rounded-full hover:bg-black/5">
              <UsersRound className="size-5" />
            </button>
            <button className="grid size-9 place-items-center rounded-full hover:bg-black/5">
              <MessageCirclePlus className="size-5" />
            </button>
            <button className="grid size-9 place-items-center rounded-full hover:bg-black/5">
              <MoreVertical className="size-5" />
            </button>
          </div>
        </header>

        <div className="border-b border-[#eef0f1] bg-white px-3 py-2">
          <div className="flex h-9 items-center rounded-lg bg-[#f0f2f5] px-3 text-[#667781]">
            <Search className="size-4" />
            <input
              className="ml-4 min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#667781]"
              placeholder="Search or start new work"
            />
          </div>
          <div className="mt-2 flex gap-2">
            <Filter active label="All" />
            <Filter label="Unread" />
            <Filter label="Needs you" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 border-b border-[#eef0f1] px-4 py-3 text-[#008069]">
            <span className="grid size-10 place-items-center rounded-full bg-[#e7fce3]">
              <BriefcaseBusiness className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">Work streams</p>
              <p className="text-[11px] text-[#667781]">
                3 active · 1 needs you
              </p>
            </div>
            <ChevronRight className="size-4 text-[#8696a0]" />
          </div>

          <ChatRow
            active={selectedChat === 'chief'}
            chatKey="chief"
            onClick={() => selectChat('chief')}
          />
          <ChatRow
            active={selectedChat === 'competitor'}
            chatKey="competitor"
            onClick={() => selectChat('competitor')}
            status={
              phase === 'proposed'
                ? 'Approval ready'
                : phaseDetails[phase].label
            }
            unread={phase === 'proposed' ? 1 : undefined}
          />
          <ChatRow
            active={selectedChat === 'invoices'}
            chatKey="invoices"
            onClick={() => selectChat('invoices')}
          />
          <ChatRow
            active={selectedChat === 'onboarding'}
            chatKey="onboarding"
            onClick={() => selectChat('onboarding')}
            warning
          />
          <ChatRow
            active={selectedChat === 'renewals'}
            chatKey="renewals"
            onClick={() => selectChat('renewals')}
          />
        </div>
      </aside>

      <section className="flex min-w-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[62px] shrink-0 items-center bg-[#f0f2f5] px-4">
            <button
              className="flex min-w-0 flex-1 items-center text-left"
              onClick={() => setDetailsOpen(true)}
              type="button"
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${chat.color}`}
              >
                {chat.initials}
              </span>
              <span className="ml-3 min-w-0">
                <span className="block truncate text-sm font-medium">
                  {chat.title}
                </span>
                <span className="block truncate text-[11px] text-[#667781]">
                  {chat.owner} · {chatStatus}
                </span>
              </span>
            </button>
            <div className="flex items-center gap-1 text-[#54656f]">
              <button className="grid size-9 place-items-center rounded-full hover:bg-black/5">
                <Video className="size-5" />
              </button>
              <button className="grid size-9 place-items-center rounded-full hover:bg-black/5">
                <Search className="size-5" />
              </button>
              <button className="grid size-9 place-items-center rounded-full hover:bg-black/5">
                <MoreVertical className="size-5" />
              </button>
            </div>
          </header>

          <button
            className="flex h-[46px] shrink-0 items-center gap-3 border-b border-[#dfe2e0] bg-white/95 px-5 text-left shadow-sm"
            onClick={() => setDetailsOpen(true)}
            type="button"
          >
            <span className="grid size-7 place-items-center rounded-full bg-[#d9fdd3] text-[#008069]">
              <BriefcaseBusiness className="size-3.5" />
            </span>
            <span className="min-w-0 flex-1 truncate text-xs">
              <b>{chatStatus}</b>
              <span className="mx-2 text-[#aeb5b2]">•</span>
              Owner: {chat.owner}
              <span className="mx-2 text-[#aeb5b2]">•</span>
              {chat.next}
            </span>
            <Info className="size-4 text-[#667781]" />
          </button>

          <div
            className="min-h-0 flex-1 overflow-y-auto px-7 py-5"
            style={{
              backgroundColor: '#efeae2',
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(84,101,111,0.07) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          >
            {selectedChat === 'chief' ? (
              <ChiefChat />
            ) : (
              <WorkChat
                phase={phase}
                selectedChat={selectedChat}
                setPhase={setPhase}
              />
            )}
          </div>

          <footer className="flex h-[64px] shrink-0 items-center gap-2 bg-[#f0f2f5] px-3">
            <button className="grid size-10 place-items-center rounded-full text-[#54656f] hover:bg-black/5">
              <Smile className="size-6" />
            </button>
            <button className="grid size-10 place-items-center rounded-full text-[#54656f] hover:bg-black/5">
              <Plus className="size-6" />
            </button>
            <div className="flex h-10 min-w-0 flex-1 items-center rounded-lg bg-white px-4">
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#667781]"
                placeholder={`Message ${chat.owner} about this work stream`}
              />
              <Paperclip className="ml-3 size-5 text-[#8696a0]" />
            </div>
            <button className="grid size-10 place-items-center rounded-full bg-[#00a884] text-white">
              <Send className="size-4" />
            </button>
          </footer>
        </div>

        {detailsOpen && (
          <WorkInfo
            chatKey={selectedChat}
            close={() => setDetailsOpen(false)}
            phase={phase}
          />
        )}
      </section>
    </main>
  );
}

function WorkChat({
  phase,
  selectedChat,
  setPhase,
}: {
  phase: PrototypePhase;
  selectedChat: Exclude<ChatKey, 'chief'>;
  setPhase: Dispatch<SetStateAction<PrototypePhase>>;
}) {
  const chat = chats[selectedChat];

  if (selectedChat !== 'competitor') {
    const body =
      selectedChat === 'invoices'
        ? 'I matched 184 of 192 invoices. Eight exceptions remain, and I’m grouping them by resolution path before tomorrow’s review.'
        : selectedChat === 'onboarding'
          ? 'Two requirements conflict. I’m testing a safe interpretation with the Chief of Staff. I’ll ask for judgment only if the risk becomes material.'
          : 'The Q3 renewal review is complete. Three accounts need executive sponsorship; the final brief and evidence are attached.';

    return (
      <div className="mx-auto flex min-h-full max-w-[780px] flex-col justify-end">
        <DayPill />
        <Bubble incoming name={chat.owner} time="9:42 AM">
          {body}
        </Bubble>
        <Bubble incoming name="Chief of Staff" time="9:47 AM">
          I’m monitoring this work stream. No executive action is needed right
          now.
        </Bubble>
      </div>
    );
  }

  const isProposed = phase === 'proposed';
  const detail = phaseDetails[phase];

  return (
    <div className="mx-auto flex min-h-full max-w-[780px] flex-col justify-end">
      <DayPill />
      <Bubble time="9:04 AM">
        Launch a weekly competitor brief. Focus on key product moves, pricing
        changes, and what needs my attention every Monday.
      </Bubble>
      <Bubble incoming name="Chief of Staff" time="9:05 AM">
        I checked the team. No current AI Employee owns competitive
        intelligence, so I recommend creating Scout as the accountable owner.
      </Bubble>

      <div className="mb-2 w-full max-w-[540px] self-start overflow-hidden rounded-lg rounded-tl-sm bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#e9edef] px-4 py-3">
          <span className="grid size-10 place-items-center rounded-full bg-violet-600 text-xs font-bold text-white">
            SC
          </span>
          <div>
            <p className="text-sm font-medium">Create Scout</p>
            <p className="text-[11px] text-[#667781]">
              Competitive Intelligence Analyst
            </p>
          </div>
          <span className="ml-auto rounded-full bg-[#f3ecf7] px-2.5 py-1 text-[10px] font-bold text-[#713379]">
            {detail.label}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 px-4 py-3">
          <ApprovalField label="Owns" value="Weekly competitor brief" />
          <ApprovalField label="First delivery" value="Mon, Aug 24" />
          <ApprovalField label="External actions" value="None" />
        </div>
        <div className="flex items-center border-t border-[#e9edef] bg-[#f8f9fa] px-4 py-3">
          <div>
            <p className="text-xs font-medium">{detail.label}</p>
            <p className="text-[10px] text-[#667781]">{detail.note}</p>
          </div>
          <div className="ml-auto flex gap-2">
            {isProposed && (
              <button className="rounded-lg border border-[#d7dcda] bg-white px-3 py-1.5 text-xs font-medium">
                Revise
              </button>
            )}
            <button
              className="rounded-lg bg-[#008069] px-3 py-1.5 text-xs font-medium text-white"
              onClick={() => setPhase(nextPhase(phase))}
              type="button"
            >
              {isProposed ? 'Approve & assign' : 'Advance demo'}
            </button>
          </div>
        </div>
      </div>

      {!isProposed && (
        <Bubble incoming name="Scout" time="Just now">
          {phase === 'queued'
            ? 'I have the request. I’m preparing the sources and the first brief.'
            : phase === 'working'
              ? 'The first brief is in progress. I’ll post the result here and escalate only material decisions.'
              : 'The first brief is ready. The summary and supporting evidence are attached.'}
        </Bubble>
      )}
    </div>
  );
}

function ChiefChat() {
  return (
    <div className="mx-auto flex min-h-full max-w-[780px] flex-col justify-end">
      <DayPill />
      <Bubble incoming name="Chief of Staff" time="9:00 AM">
        Good morning. Three work streams are active. Scout needs approval for
        the competitor brief; I’m handling the other work without interruption.
      </Bubble>
    </div>
  );
}

function WorkInfo({
  chatKey,
  close,
  phase,
}: {
  chatKey: ChatKey;
  close: () => void;
  phase: PrototypePhase;
}) {
  const chat = chats[chatKey];
  const status =
    chatKey === 'competitor' ? phaseDetails[phase].label : chat.status;

  return (
    <aside className="flex w-[330px] shrink-0 flex-col border-l border-[#d4d7d5] bg-[#f0f2f5]">
      <header className="flex h-[62px] items-center bg-[#f0f2f5] px-4">
        <button
          className="grid size-9 place-items-center rounded-full hover:bg-black/5"
          onClick={close}
          type="button"
        >
          <X className="size-5" />
        </button>
        <h2 className="ml-4 text-sm font-medium">Work stream info</h2>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white px-5 py-7 text-center shadow-sm">
          <span
            className={`mx-auto grid size-20 place-items-center rounded-full text-xl font-bold text-white ${chat.color}`}
          >
            {chat.initials}
          </span>
          <h3 className="mt-4 text-lg font-medium">{chat.title}</h3>
          <p className="mt-1 text-xs text-[#667781]">
            Accountable owner: {chat.owner}
          </p>
        </div>

        <div className="mt-2 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs text-[#667781]">Work details</p>
          <InfoRow label="State" value={status} />
          <InfoRow label="Next" value={chat.next} />
          <InfoRow
            label="Risk"
            value={chatKey === 'onboarding' ? 'Schedule' : 'None'}
          />
        </div>

        <div className="mt-2 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs text-[#667781]">Participants</p>
          <Participant
            color="bg-[#1f4d42]"
            initials="CS"
            name="Chief of Staff"
            role="Supervisor"
          />
          <Participant
            color={chat.color}
            initials={chat.initials}
            name={chat.owner}
            role="Accountable owner"
          />
          <Participant
            color="bg-[#d9fdd3] text-[#075e54]"
            initials="CC"
            name="You"
            role="Executive"
          />
        </div>

        <div className="mt-2 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs text-[#667781]">Follow-through</p>
          <div className="mt-4 space-y-4">
            <FollowThrough done label="Chief of Staff checked ownership" />
            <FollowThrough done label={`${chat.owner} posted an update`} />
            <FollowThrough label="Next milestone scheduled" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function ChatRow({
  active,
  chatKey,
  onClick,
  status,
  unread,
  warning,
}: {
  active: boolean;
  chatKey: ChatKey;
  onClick: () => void;
  status?: string;
  unread?: number;
  warning?: boolean;
}) {
  const chat = chats[chatKey];
  return (
    <button
      className={`flex w-full items-center gap-3 px-3 py-3 text-left transition ${active ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f6f6]'}`}
      onClick={onClick}
      type="button"
    >
      <span
        className={`grid size-12 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${chat.color}`}
      >
        {chat.initials}
      </span>
      <span className="min-w-0 flex-1 border-b border-[#eef0f1] pb-3">
        <span className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {chat.title}
          </span>
          <span
            className={`text-[10px] ${unread ? 'text-[#00a884]' : 'text-[#667781]'}`}
          >
            {chat.time}
          </span>
        </span>
        <span className="mt-1 flex items-center gap-2">
          <span
            className={`min-w-0 flex-1 truncate text-xs ${warning ? 'text-amber-700' : 'text-[#667781]'}`}
          >
            {status ?? chat.preview}
          </span>
          {unread && (
            <span className="grid size-5 place-items-center rounded-full bg-[#25d366] text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

function Bubble({
  children,
  incoming,
  name,
  time,
}: {
  children: React.ReactNode;
  incoming?: boolean;
  name?: string;
  time: string;
}) {
  return (
    <div
      className={`mb-2 max-w-[72%] rounded-lg px-3 py-2 shadow-sm ${
        incoming
          ? 'self-start rounded-tl-sm bg-white'
          : 'self-end rounded-tr-sm bg-[#d9fdd3]'
      }`}
    >
      {name && (
        <p className="mb-1 text-[11px] font-medium text-[#008069]">{name}</p>
      )}
      <p className="text-[13px] leading-5">{children}</p>
      <p className="mt-1 flex items-center justify-end gap-1 text-[9px] text-[#667781]">
        {time} {!incoming && <Check className="size-3 text-[#53bdeb]" />}
      </p>
    </div>
  );
}

function DayPill() {
  return (
    <div className="mb-4 self-center rounded-lg bg-[#fffdf8] px-3 py-1.5 text-[10px] font-medium text-[#54656f] shadow-sm">
      TODAY
    </div>
  );
}

function Filter({ active, label }: { active?: boolean; label: string }) {
  return (
    <button
      className={`rounded-full px-3 py-1 text-[11px] ${
        active ? 'bg-[#e7fce3] text-[#008069]' : 'bg-[#f0f2f5] text-[#54656f]'
      }`}
    >
      {label}
    </button>
  );
}

function ApprovalField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[8px] font-bold tracking-wide text-[#8696a0] uppercase">
        {label}
      </p>
      <p className="mt-1 text-[10px] font-medium">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4 flex items-start gap-3">
      <Clock3 className="mt-0.5 size-4 text-[#8696a0]" />
      <div>
        <p className="text-[10px] text-[#8696a0]">{label}</p>
        <p className="mt-0.5 text-xs font-medium">{value}</p>
      </div>
    </div>
  );
}

function Participant({
  color,
  initials,
  name,
  role,
}: {
  color: string;
  initials: string;
  name: string;
  role: string;
}) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <span
        className={`grid size-9 place-items-center rounded-full text-[10px] font-bold text-white ${color}`}
      >
        {initials}
      </span>
      <div>
        <p className="text-xs font-medium">{name}</p>
        <p className="text-[10px] text-[#667781]">{role}</p>
      </div>
    </div>
  );
}

function FollowThrough({ done, label }: { done?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid size-5 place-items-center rounded-full ${done ? 'bg-[#d9fdd3] text-[#008069]' : 'bg-[#f0f2f5] text-[#8696a0]'}`}
      >
        {done ? <Check className="size-3" /> : <Clock3 className="size-3" />}
      </span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

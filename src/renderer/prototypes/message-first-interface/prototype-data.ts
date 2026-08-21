export type PrototypePhase =
  | 'proposed'
  | 'queued'
  | 'working'
  | 'completed'
  | 'cancelled';

export const intent =
  'Launch a weekly competitor brief. Focus on key product moves, pricing changes, and what needs my attention every Monday.';

export const phaseDetails: Record<
  PrototypePhase,
  { label: string; note: string }
> = {
  proposed: {
    label: 'Proposed',
    note: 'Waiting for your approval',
  },
  queued: {
    label: 'Queued',
    note: 'Scout is preparing the work',
  },
  working: {
    label: 'Working',
    note: 'First brief is in progress',
  },
  completed: {
    label: 'Completed',
    note: 'First brief is ready to review',
  },
  cancelled: {
    label: 'Cancelled',
    note: 'No further work will be done',
  },
};

export const employees = [
  {
    name: 'Scout',
    role: 'Competitive intelligence',
    state: 'Working',
    color: 'bg-violet-500',
    initials: 'SC',
  },
  {
    name: 'Ledger',
    role: 'Finance operations',
    state: 'Available',
    color: 'bg-emerald-500',
    initials: 'LE',
  },
  {
    name: 'Harbor',
    role: 'Customer operations',
    state: 'At capacity',
    color: 'bg-amber-500',
    initials: 'HA',
  },
];

export const workItems = [
  {
    title: 'Weekly competitor brief',
    owner: 'Scout',
    status: 'Needs approval',
    accent: 'text-violet-700 bg-violet-50',
  },
  {
    title: 'Invoice reconciliation',
    owner: 'Ledger',
    status: 'Working',
    accent: 'text-blue-700 bg-blue-50',
  },
  {
    title: 'Enterprise onboarding audit',
    owner: 'Harbor',
    status: 'At risk',
    accent: 'text-amber-800 bg-amber-50',
  },
];

export function nextPhase(phase: PrototypePhase): PrototypePhase {
  const sequence: PrototypePhase[] = [
    'proposed',
    'queued',
    'working',
    'completed',
  ];
  const index = sequence.indexOf(phase);
  return sequence[(index + 1) % sequence.length];
}

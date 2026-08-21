export type WorkspaceViewId =
  | 'all'
  | 'needs-you'
  | 'working'
  | 'finance'
  | 'customers';

export type WorkspaceView = {
  id: WorkspaceViewId;
  label: string;
  count?: number;
};

export type WorkStreamStatus =
  | 'Monitoring'
  | 'Needs Approval'
  | 'Working'
  | 'At Risk'
  | 'Completed';

export type WorkStream = {
  id: string;
  title: string;
  accountableOwner: string;
  preview: string;
  timestamp: string;
  status: WorkStreamStatus;
  initials: string;
  avatar: 'blue' | 'violet' | 'emerald' | 'amber';
  unread?: number;
};

export type BriefingMetric = {
  label: string;
  value: number;
  tone: 'default' | 'attention' | 'risk';
};

export type FocusItem = {
  title: string;
  detail: string;
  status: string;
  tone: 'attention' | 'progress' | 'risk';
};

export type ChiefOfStaffBriefing = {
  greeting: string;
  summary: string;
  metrics: BriefingMetric[];
  focusItems: FocusItem[];
  nextMilestone: string;
};

export type WorkspaceScenario = {
  selectedViewId: WorkspaceViewId;
  selectedWorkStreamId: string;
  views: WorkspaceView[];
  workStreams: WorkStream[];
  briefing: ChiefOfStaffBriefing;
};

export const executiveWorkspaceScenario: WorkspaceScenario = {
  selectedViewId: 'all',
  selectedWorkStreamId: 'chief-of-staff',
  views: [
    { id: 'all', label: 'All chats', count: 5 },
    { id: 'needs-you', label: 'Needs you', count: 1 },
    { id: 'working', label: 'Working', count: 2 },
    { id: 'finance', label: 'Finance' },
    { id: 'customers', label: 'Customers' },
  ],
  workStreams: [
    {
      id: 'chief-of-staff',
      title: 'Chief of Staff',
      accountableOwner: 'Chief of Staff',
      preview: 'Three active · one needs you',
      timestamp: '9:08 AM',
      status: 'Monitoring',
      initials: 'CS',
      avatar: 'blue',
      unread: 1,
    },
    {
      id: 'competitor-brief',
      title: 'Weekly competitor brief',
      accountableOwner: 'Scout',
      preview: 'Approval is ready for review',
      timestamp: '9:05 AM',
      status: 'Needs Approval',
      initials: 'SC',
      avatar: 'violet',
    },
    {
      id: 'invoice-reconciliation',
      title: 'Invoice reconciliation',
      accountableOwner: 'Ledger',
      preview: 'Eight exceptions remain',
      timestamp: '8:42 AM',
      status: 'Working',
      initials: 'LE',
      avatar: 'emerald',
    },
    {
      id: 'onboarding-audit',
      title: 'Enterprise onboarding audit',
      accountableOwner: 'Harbor',
      preview: 'Schedule risk is being monitored',
      timestamp: 'Wed',
      status: 'At Risk',
      initials: 'HA',
      avatar: 'amber',
    },
    {
      id: 'renewal-review',
      title: 'Q3 renewal pipeline review',
      accountableOwner: 'Harbor',
      preview: 'Final review and evidence posted',
      timestamp: 'Fri',
      status: 'Completed',
      initials: 'HA',
      avatar: 'amber',
    },
  ],
  briefing: {
    greeting: 'Good morning.',
    summary: 'Three work streams are active. One needs your attention.',
    metrics: [
      { label: 'Needs you', value: 1, tone: 'attention' },
      { label: 'Working', value: 2, tone: 'default' },
      { label: 'At Risk', value: 1, tone: 'risk' },
    ],
    focusItems: [
      {
        title: 'Weekly competitor brief',
        detail: 'Scout has prepared a bounded plan for the first brief.',
        status: 'Needs Approval',
        tone: 'attention',
      },
      {
        title: 'Invoice reconciliation',
        detail: 'Ledger matched 184 of 192 invoices.',
        status: 'Working',
        tone: 'progress',
      },
      {
        title: 'Enterprise onboarding audit',
        detail: 'Harbor is validating two conflicting requirements.',
        status: 'At Risk',
        tone: 'risk',
      },
    ],
    nextMilestone: 'Executive briefing · Monday, 9:00 AM',
  },
};

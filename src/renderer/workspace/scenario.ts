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

export type WorkStreamId =
  | 'chief-of-staff'
  | 'competitor-brief'
  | 'invoice-reconciliation'
  | 'onboarding-audit'
  | 'renewal-review';

export type WorkStream = {
  id: WorkStreamId;
  title: string;
  accountableOwner: string;
  preview: string;
  timestamp: string;
  status: WorkStreamStatus;
  initials: string;
  avatar: 'blue' | 'violet' | 'emerald' | 'amber';
  permanent: boolean;
  builtIn: boolean;
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
  status: WorkStreamStatus;
  tone: 'attention' | 'progress' | 'risk';
};

export type ChiefOfStaffBriefing = {
  dateLabel: string;
  messageTimestamp: string;
  greeting: string;
  summary: string;
  supervisionSummary: string;
  contextSummary: string;
  closingNote: string;
  metrics: BriefingMetric[];
  focusItems: FocusItem[];
  nextMilestone: string;
};

export type WorkspaceScenario = {
  selectedViewId: WorkspaceViewId;
  selectedWorkStreamId: WorkStreamId;
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
      permanent: true,
      builtIn: true,
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
      permanent: false,
      builtIn: false,
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
      permanent: false,
      builtIn: false,
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
      permanent: false,
      builtIn: false,
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
      permanent: false,
      builtIn: false,
    },
  ],
  briefing: {
    dateLabel: 'Today',
    messageTimestamp: '9:08 AM',
    greeting: 'Good morning.',
    summary: 'Three work streams are active. One needs your attention.',
    supervisionSummary: 'Supervising every work stream',
    contextSummary: 'Monitoring all active Routed Requests',
    closingNote:
      'I’m supervising routine Follow-through and will bring back only matters that need your Approval or judgment.',
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

import { ConversationSurface } from './conversation-surface';
import { NavigationRail } from './navigation-rail';
import { executiveWorkspaceScenario } from './scenario';
import { WorkStreamList } from './work-stream-list';

export function WorkspaceShell() {
  const scenario = executiveWorkspaceScenario;
  const chiefOfStaff = scenario.workStreams.find(
    (workStream) => workStream.id === scenario.selectedWorkStreamId,
  );

  if (!chiefOfStaff) {
    throw new Error('The workspace scenario requires a selected work stream.');
  }

  return (
    <div className="flex h-screen min-h-[600px] min-w-[800px] overflow-hidden bg-[#111a2e] text-slate-950">
      <NavigationRail
        selectedViewId={scenario.selectedViewId}
        views={scenario.views}
      />
      <WorkStreamList
        selectedWorkStreamId={scenario.selectedWorkStreamId}
        workStreams={scenario.workStreams}
      />
      <ConversationSurface
        briefing={scenario.briefing}
        chiefOfStaff={chiefOfStaff}
      />
    </div>
  );
}

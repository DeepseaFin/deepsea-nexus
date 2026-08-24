export type IntakeSession = {
  id: string;
  client: string;
  deal: string;
  numberOfDocuments: number;
  progress: number;
  assignedUser: string;
  dueDate: string;
};

type TodayIntakeSessionsProps = {
  sessions: IntakeSession[];
};

export default function TodayIntakeSessions({ sessions }: TodayIntakeSessionsProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Today&apos;s Intake Sessions</h2>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-300">
          {sessions.length} Sessions
        </span>
      </header>

      <div className="grid gap-2 md:grid-cols-2">
        {sessions.map((session) => (
          <article key={session.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{session.id}</p>
            <p className="mt-1 text-base font-semibold text-slate-100">{session.client}</p>
            <div className="mt-2 grid gap-1 text-sm text-slate-300">
              <p><span className="text-slate-500">Deal:</span> {session.deal}</p>
              <p><span className="text-slate-500">Number of Documents:</span> {session.numberOfDocuments}</p>
              <p><span className="text-slate-500">Assigned User:</span> {session.assignedUser}</p>
              <p><span className="text-slate-500">Due Date:</span> {session.dueDate}</p>
            </div>
            <div className="mt-2">
              <p className="mb-1 text-xs text-slate-500">Progress {session.progress}%</p>
              <div className="h-1.5 rounded bg-slate-800">
                <div className="h-1.5 rounded bg-cyan-500" style={{ width: `${session.progress}%` }} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

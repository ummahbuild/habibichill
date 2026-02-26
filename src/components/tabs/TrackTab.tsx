import { useApp } from "@/context/AppContext";

const achievements = [
  { name: "First Control", desc: "Controlled anger for the first time", icon: "🌱", threshold: 1 },
  { name: "Sabr Student", desc: "Earned 50 sabr points", icon: "📚", threshold: 50 },
  { name: "Silence Warrior", desc: "Stayed silent 5 times", icon: "🤫", threshold: 5 },
  { name: "Wudu Champion", desc: "Made wudu during anger", icon: "💧", threshold: 3 },
  { name: "Forgiveness Level 1", desc: "Forgave in 3 situations", icon: "🕊️", threshold: 3 },
  { name: "Sabr Master", desc: "Earned 300 sabr points", icon: "⭐", threshold: 300 },
];

const TrackTab = () => {
  const { sabrPoints, streak, angerLog } = useApp();
  const controlled = angerLog.filter((e) => e.controlled).length;
  const total = angerLog.length;

  return (
    <div className="container mx-auto max-w-lg px-4 pt-6">
      <h1 className="mb-6 font-heading text-xl font-bold text-foreground">Your Progress</h1>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="font-heading text-3xl font-bold text-primary">{sabrPoints}</p>
          <p className="text-xs text-muted-foreground">Sabr Points</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="font-heading text-3xl font-bold text-secondary">🔥 {streak}</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="font-heading text-3xl font-bold text-success">{controlled}</p>
          <p className="text-xs text-muted-foreground">Times Controlled</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="font-heading text-3xl font-bold text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground">Total Incidents</p>
        </div>
      </div>

      {/* Achievements */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Achievements</h2>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {achievements.map((a) => {
          const unlocked = sabrPoints >= a.threshold || controlled >= a.threshold;
          return (
            <div key={a.name} className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center ${unlocked ? "border-secondary/30 bg-secondary/5" : "border-border bg-card opacity-40"}`}>
              <span className="text-2xl">{a.icon}</span>
              <p className="text-xs font-medium text-foreground">{a.name}</p>
            </div>
          );
        })}
      </div>

      {/* Recent log */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent Activity</h2>
      {angerLog.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground">No entries yet. Use the emergency button when anger strikes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {angerLog.slice(0, 10).map((entry) => (
            <div key={entry.id} className={`flex items-center justify-between rounded-xl border p-3 ${entry.controlled ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}`}>
              <div>
                <p className="text-sm font-medium text-foreground">{entry.situation}</p>
                <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
              </div>
              <span className="text-lg">{entry.controlled ? "✅" : "⚠️"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackTab;

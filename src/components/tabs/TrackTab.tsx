import { useMemo, useRef } from "react";
import { useApp, AngerEntry } from "@/context/AppContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { format, subDays, startOfDay, parseISO, eachDayOfInterval } from "date-fns";

const achievements = [
  { name: "First Control", desc: "Controlled anger for the first time", icon: "🌱", threshold: 1 },
  { name: "Sabr Student", desc: "Earned 50 sabr points", icon: "📚", threshold: 50 },
  { name: "Silence Warrior", desc: "Stayed silent 5 times", icon: "🤫", threshold: 5 },
  { name: "Wudu Champion", desc: "Made wudu during anger", icon: "💧", threshold: 3 },
  { name: "Forgiveness Level 1", desc: "Forgave in 3 situations", icon: "🕊️", threshold: 3 },
  { name: "Sabr Master", desc: "Earned 300 sabr points", icon: "⭐", threshold: 300 },
];

const CHART_COLORS = {
  controlled: "hsl(160, 84%, 39%)",
  uncontrolled: "hsl(27, 96%, 61%)",
  primary: "hsl(175, 85%, 32%)",
};

const TrackTab = () => {
  const { sabrPoints, streak, angerLog } = useApp();
  const controlled = angerLog.filter((e) => e.controlled).length;
  const total = angerLog.length;

  // Weekly data (last 7 days)
  const weeklyData = useMemo(() => {
    const today = startOfDay(new Date());
    const days = eachDayOfInterval({ start: subDays(today, 6), end: today });
    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayEntries = angerLog.filter((e) => format(parseISO(e.date), "yyyy-MM-dd") === dayStr);
      return {
        day: format(day, "EEE"),
        controlled: dayEntries.filter((e) => e.controlled).length,
        uncontrolled: dayEntries.filter((e) => !e.controlled).length,
      };
    });
  }, [angerLog]);

  // Trigger breakdown
  const triggerData = useMemo(() => {
    const counts: Record<string, number> = {};
    angerLog.forEach((e) => {
      counts[e.trigger] = (counts[e.trigger] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [angerLog]);

  // Intensity over time (last 14 days)
  const intensityData = useMemo(() => {
    const today = startOfDay(new Date());
    const days = eachDayOfInterval({ start: subDays(today, 13), end: today });
    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayEntries = angerLog.filter((e) => format(parseISO(e.date), "yyyy-MM-dd") === dayStr);
      const avgIntensity = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + e.intensity, 0) / dayEntries.length
        : 0;
      return {
        day: format(day, "dd/MM"),
        intensity: Math.round(avgIntensity * 10) / 10,
      };
    });
  }, [angerLog]);

  const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.controlled, CHART_COLORS.uncontrolled, "hsl(258, 90%, 66%)", "hsl(38, 92%, 50%)"];

  // Insights
  const insights = useMemo(() => {
    const msgs: string[] = [];
    if (total === 0) return ["Start logging anger incidents to see personalized insights here."];
    const rate = total > 0 ? Math.round((controlled / total) * 100) : 0;
    msgs.push(`You've controlled your anger ${rate}% of the time. ${rate >= 70 ? "MashaAllah, keep it up!" : rate >= 40 ? "You're improving — keep striving." : "Every effort counts. Allah is with the patient."}`);
    if (triggerData.length > 0) msgs.push(`Your top anger trigger is "${triggerData[0].name}" with ${triggerData[0].value} incidents.`);
    if (streak > 0) msgs.push(`You're on a ${streak}-day control streak! 🔥`);
    const recentWeek = angerLog.filter((e) => parseISO(e.date) > subDays(new Date(), 7));
    const prevWeek = angerLog.filter((e) => {
      const d = parseISO(e.date);
      return d > subDays(new Date(), 14) && d <= subDays(new Date(), 7);
    });
    if (recentWeek.length > 0 && prevWeek.length > 0) {
      const diff = recentWeek.length - prevWeek.length;
      if (diff < 0) msgs.push(`${Math.abs(diff)} fewer incidents this week vs last week. Great progress!`);
      else if (diff > 0) msgs.push(`${diff} more incidents this week. Consider reviewing your triggers.`);
    }
    return msgs;
  }, [angerLog, controlled, total, streak, triggerData]);

  return (
    <div className="container mx-auto max-w-lg px-4 pt-6 pb-8">
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

      {/* Insights */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">💡 Insights</h2>
      <div className="mb-6 flex flex-col gap-2">
        {insights.map((msg, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-3">
            <p className="text-sm text-foreground">{msg}</p>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">📊 Weekly Pattern</h2>
      <div className="mb-6 rounded-2xl border border-border bg-card p-4">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barGap={2}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(200, 10%, 45%)" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(200, 10%, 45%)" }} axisLine={false} tickLine={false} width={20} />
              <Tooltip
                contentStyle={{ background: "hsl(220, 15%, 10%)", border: "none", borderRadius: 12, fontSize: 12, color: "#fff" }}
                cursor={{ fill: "hsl(175, 85%, 32%, 0.05)" }}
              />
              <Bar dataKey="controlled" name="Controlled" fill={CHART_COLORS.controlled} radius={[4, 4, 0, 0]} />
              <Bar dataKey="uncontrolled" name="Uncontrolled" fill={CHART_COLORS.uncontrolled} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">Log anger incidents to see weekly patterns</p>
        )}
        <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: CHART_COLORS.controlled }} /> Controlled</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: CHART_COLORS.uncontrolled }} /> Uncontrolled</span>
        </div>
      </div>

      {/* Intensity Trend */}
      {total > 0 && (
        <>
          <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">🌡️ Intensity Trend (14 days)</h2>
          <div className="mb-6 rounded-2xl border border-border bg-card p-4">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={intensityData}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(200, 10%, 45%)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: "hsl(200, 10%, 45%)" }} axisLine={false} tickLine={false} width={20} />
                <Tooltip contentStyle={{ background: "hsl(220, 15%, 10%)", border: "none", borderRadius: 12, fontSize: 12, color: "#fff" }} />
                <Area type="monotone" dataKey="intensity" name="Avg Intensity" stroke={CHART_COLORS.uncontrolled} fill={CHART_COLORS.uncontrolled} fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Trigger Breakdown */}
      {triggerData.length > 0 && (
        <>
          <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">🎯 Top Triggers</h2>
          <div className="mb-6 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={triggerData} dataKey="value" cx="50%" cy="50%" outerRadius={50} innerRadius={25} paddingAngle={3} strokeWidth={0}>
                      {triggerData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                {triggerData.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-2 text-sm">
                    <span className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-foreground truncate">{t.name}</span>
                    <span className="text-muted-foreground ml-auto">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Achievements */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">🏆 Achievements</h2>
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
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">📋 Recent Activity</h2>
      {angerLog.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground">No entries yet. Use the emergency button when anger strikes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {angerLog.slice(0, 10).map((entry) => (
            <div key={entry.id} className={`flex items-center justify-between rounded-xl border p-3 ${entry.controlled ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}`}>
              <div>
                <p className="text-sm font-medium text-foreground">{entry.situation || entry.trigger}</p>
                <p className="text-xs text-muted-foreground">{entry.trigger} · Intensity {entry.intensity}/5 · {new Date(entry.date).toLocaleDateString()}</p>
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

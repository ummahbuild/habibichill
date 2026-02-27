import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp, AngerEntry } from "@/context/AppContext";
import { useTerminology } from "@/hooks/use-terminology";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend } from "recharts";
import { format, subDays, startOfDay, parseISO, eachDayOfInterval } from "date-fns";
import logo from "@/assets/habibichill-logo.png";
import { PwaInstallCard } from "@/components/PwaInstallPrompt";

const moodEmojis = ["😊", "🙂", "😐", "😟", "😢"];
const moodLabels = ["Great", "Good", "Okay", "Low", "Struggling"];
const timeOfDayEmojis: Record<string, string> = { morning: "☀️", afternoon: "🌤️", evening: "🌅", night: "🌙" };

const CHART_COLORS = {
  controlled: "hsl(160, 84%, 39%)",
  uncontrolled: "hsl(27, 96%, 61%)",
  primary: "hsl(175, 85%, 32%)",
};

type SubTab = "progress" | "mood" | "journal" | "settings";

const MeTab = () => {
  const { sabrPoints, streak, angerLog, settings, updateSettings, setAppState, bookmarks, moodLog, updateMoodEntry, deleteMoodEntry } = useApp();
  const t = useTerminology();

  const achievements = [
    { name: "First Control", desc: "Controlled anger for the first time", icon: "🌱", threshold: 1 },
    { name: `${t.sabr} Student`, desc: `Earned 50 ${t.sabrPoints.toLowerCase()}`, icon: "📚", threshold: 50 },
    { name: "Silence Warrior", desc: "Stayed silent 5 times", icon: "🤫", threshold: 5 },
    { name: `${t.wudu} Champion`, desc: `Used ${t.wudu.toLowerCase()} during anger`, icon: "💧", threshold: 3 },
    { name: "Forgiveness Level 1", desc: "Forgave in 3 situations", icon: "🕊️", threshold: 3 },
    { name: `${t.sabr} Master`, desc: `Earned 300 ${t.sabrPoints.toLowerCase()}`, icon: "⭐", threshold: 300 },
  ];

  const [editingMoodId, setEditingMoodId] = useState<string | null>(null);
  const [editMoodValue, setEditMoodValue] = useState(3);
  const [editMoodNote, setEditMoodNote] = useState("");
  const [subTab, setSubTab] = useState<SubTab>("progress");
  const controlled = angerLog.filter((e) => e.controlled).length;
  const total = angerLog.length;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const controlRate = total > 0 ? Math.round((controlled / total) * 100) : 0;
  const avgMood = moodLog.length > 0 ? (moodLog.reduce((s, e) => s + e.mood, 0) / moodLog.length).toFixed(1) : null;
  const level = sabrPoints < 50 ? "🌱 Beginner" : sabrPoints < 150 ? "📚 Student" : sabrPoints < 300 ? "⭐ Practitioner" : "👑 Master";

  // Weekly data
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
    angerLog.forEach((e) => { counts[e.trigger] = (counts[e.trigger] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [angerLog]);

  // Intensity trend
  const intensityData = useMemo(() => {
    const today = startOfDay(new Date());
    const days = eachDayOfInterval({ start: subDays(today, 13), end: today });
    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayEntries = angerLog.filter((e) => format(parseISO(e.date), "yyyy-MM-dd") === dayStr);
      const avgIntensity = dayEntries.length > 0 ? dayEntries.reduce((sum, e) => sum + e.intensity, 0) / dayEntries.length : 0;
      return { day: format(day, "dd/MM"), intensity: Math.round(avgIntensity * 10) / 10 };
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
    return msgs;
  }, [angerLog, controlled, total, streak, triggerData]);

  // Mood trend (last 7 unique entries)
  const last7Moods = moodLog.slice(0, 7);

  // Mood daily averages (last 14 days)
  const moodDailyData = useMemo(() => {
    const today = startOfDay(new Date());
    const days = eachDayOfInterval({ start: subDays(today, 13), end: today });
    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayEntries = moodLog.filter((e) => e.date.slice(0, 10) === dayStr);
      const avg = dayEntries.length > 0 ? dayEntries.reduce((s, e) => s + e.mood, 0) / dayEntries.length : null;
      return { day: format(day, "dd/MM"), avg: avg ? Math.round(avg * 10) / 10 : null, count: dayEntries.length };
    });
  }, [moodLog]);

  // Today's mood timeline
  const todayMoodTimeline = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return moodLog
      .filter((e) => e.date.slice(0, 10) === todayStr)
      .reverse()
      .map((e) => ({
        time: new Date(e.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        mood: e.mood,
        note: e.note,
        timeOfDay: e.timeOfDay,
      }));
  }, [moodLog]);

  // Time-of-day mood averages
  const timeOfDayData = useMemo(() => {
    const buckets: Record<string, number[]> = { morning: [], afternoon: [], evening: [], night: [] };
    moodLog.forEach((e) => {
      const tod = e.timeOfDay || "morning";
      if (buckets[tod]) buckets[tod].push(e.mood);
    });
    return Object.entries(buckets).map(([period, moods]) => ({
      period: period.charAt(0).toUpperCase() + period.slice(1),
      emoji: timeOfDayEmojis[period],
      avg: moods.length > 0 ? Math.round((moods.reduce((s, m) => s + m, 0) / moods.length) * 10) / 10 : null,
      count: moods.length,
    }));
  }, [moodLog]);

  // Mood distribution
  const moodDistribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    moodLog.forEach((e) => { if (e.mood >= 1 && e.mood <= 5) counts[e.mood - 1]++; });
    return counts.map((count, i) => ({ name: moodLabels[i], emoji: moodEmojis[i], value: count }));
  }, [moodLog]);

  // Export/Import handlers
  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(), app: "HabibiChill", version: "1.1",
      sabrPoints, streak, angerLog, bookmarks, moodLog, settings,
      completedLessons: JSON.parse(localStorage.getItem("hc-completed-lessons") || "[]"),
      dhikrCounts: JSON.parse(localStorage.getItem("hc-dhikr-counts") || "[0,0,0]"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `habibichill-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (angerLog.length === 0) return alert("No entries to export.");
    const headers = "Date,Trigger,Situation,Intensity,Controlled,Reflection\n";
    const rows = angerLog.map((e) =>
      `"${new Date(e.date).toLocaleString()}","${e.trigger}","${(e.situation || "").replace(/"/g, '""')}",${e.intensity},${e.controlled ? "Yes" : "No"},"${(e.reflection || "").replace(/"/g, '""')}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `habibichill-journal-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.app !== "HabibiChill") { alert("This doesn't look like a HabibiChill backup file."); return; }
        if (!confirm(`Import backup from ${new Date(data.exportDate).toLocaleDateString()}? This will replace ALL current data.`)) return;
        if (data.angerLog) localStorage.setItem("hc-anger-log", JSON.stringify(data.angerLog));
        if (data.sabrPoints !== undefined) localStorage.setItem("hc-sabr-points", String(data.sabrPoints));
        if (data.streak !== undefined) localStorage.setItem("hc-streak", String(data.streak));
        if (data.settings) localStorage.setItem("hc-settings", JSON.stringify(data.settings));
        if (data.bookmarks) localStorage.setItem("hc-bookmarks", JSON.stringify(data.bookmarks));
        if (data.moodLog) localStorage.setItem("hc-mood-log", JSON.stringify(data.moodLog));
        window.location.reload();
      } catch { alert("Failed to read backup file."); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteJournal = () => {
    if (angerLog.length === 0) return;
    if (!confirm(`Delete all ${angerLog.length} journal entries? This cannot be undone.`)) return;
    localStorage.setItem("hc-anger-log", "[]");
    window.location.reload();
  };

  // Notification permission
  const [notifEnabled, setNotifEnabled] = useState(() => {
    return localStorage.getItem("hc-notif-enabled") === "true";
  });

  const toggleNotifications = async () => {
    if (!notifEnabled) {
      if (!("Notification" in window)) { alert("Your browser doesn't support notifications."); return; }
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setNotifEnabled(true);
        localStorage.setItem("hc-notif-enabled", "true");
        scheduleReminders();
      } else {
        alert("Please allow notifications in your browser settings.");
      }
    } else {
      setNotifEnabled(false);
      localStorage.setItem("hc-notif-enabled", "false");
      clearReminders();
    }
  };

  const subTabs: { id: SubTab; label: string; emoji: string }[] = [
    { id: "progress", label: "Progress", emoji: "📊" },
    { id: "mood", label: "Mood", emoji: "🧠" },
    { id: "journal", label: "Journal", emoji: "📋" },
    { id: "settings", label: "Settings", emoji: "⚙️" },
  ];

  return (
    <div className="container mx-auto max-w-lg px-4 pt-6 pb-8">
      {/* User Card */}
      <div className="mb-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <img src={logo} alt="Profile" className="h-14 w-14 rounded-full object-cover" />
        <div className="flex-1">
          <h1 className="font-heading text-lg font-bold text-foreground">HabibiChill User</h1>
          <p className="text-sm text-muted-foreground">{level} · {sabrPoints} SP · 🔥 {streak}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        <div className="group relative rounded-xl border border-border bg-card p-2.5 text-center">
          <p className="font-heading text-xl font-bold text-primary">{sabrPoints}</p>
           <p className="text-[9px] text-muted-foreground">{t.sabr} Pts</p>
           <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 w-48 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
             <p className="text-[10px] font-bold text-primary mb-0.5">{t.sabrPoints}</p>
            <p className="text-[10px] text-muted-foreground">Earned by controlling anger (+10 per incident). Unlock achievements as you grow.</p>
          </div>
        </div>
        <div className="group relative rounded-xl border border-border bg-card p-2.5 text-center">
          <p className="font-heading text-xl font-bold text-success">{controlRate}%</p>
          <p className="text-[9px] text-muted-foreground">Control</p>
          <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 w-48 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            <p className="text-[10px] font-bold text-success mb-0.5">Control Rate</p>
            <p className="text-[10px] text-muted-foreground">Percentage of anger incidents where you successfully controlled your emotions. {controlRate >= 70 ? "MashaAllah!" : "Keep striving!"}</p>
          </div>
        </div>
        <div className="group relative rounded-xl border border-border bg-card p-2.5 text-center">
          <p className="font-heading text-xl font-bold text-accent">{bookmarks.length}</p>
          <p className="text-[9px] text-muted-foreground">Saved</p>
          <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 w-48 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            <p className="text-[10px] font-bold text-accent mb-0.5">Bookmarks</p>
            <p className="text-[10px] text-muted-foreground">Ayahs, hadiths, and duas you've saved for quick reference.</p>
          </div>
        </div>
        <div className="group relative rounded-xl border border-border bg-card p-2.5 text-center">
          <p className="font-heading text-xl font-bold text-secondary">{avgMood || "—"}</p>
          <p className="text-[9px] text-muted-foreground">Mood</p>
          <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 w-48 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            <p className="text-[10px] font-bold text-secondary mb-0.5">Average Mood</p>
            <p className="text-[10px] text-muted-foreground">Your average mood score (1=struggling, 5=great) based on daily check-ins.</p>
          </div>
        </div>
      </div>

      {/* Mood History */}
      {last7Moods.length > 0 && (
        <div className="mb-4 flex items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xs text-muted-foreground mr-2">Mood:</span>
          {last7Moods.map((entry, i) => (
            <span key={i} className="text-lg" title={new Date(entry.date).toLocaleDateString()}>
              {moodEmojis[entry.mood - 1]}
            </span>
          ))}
        </div>
      )}

      {/* Sub-tabs */}
      <div className="mb-5 flex gap-1 rounded-xl bg-muted p-1">
        {subTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
              subTab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="mr-1">{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Progress ── */}
        {subTab === "progress" && (
          <motion.div key="progress" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Insights */}
            <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">💡 Insights</h2>
            <div className="mb-5 flex flex-col gap-2">
              {insights.map((msg, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-sm text-foreground">{msg}</p>
                </div>
              ))}
            </div>

            {/* Weekly Chart */}
            <div className="group relative mb-3">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground cursor-help">📊 Weekly Pattern</h2>
              <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 w-56 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                <p className="text-[10px] text-muted-foreground">Shows daily anger incidents over the past 7 days. Green = controlled, orange = uncontrolled. Helps identify patterns.</p>
              </div>
            </div>
            <div className="mb-5 rounded-2xl border border-border bg-card p-4">
              {total > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={weeklyData} barGap={2}>
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(200, 10%, 45%)" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(200, 10%, 45%)" }} axisLine={false} tickLine={false} width={20} />
                    <Tooltip contentStyle={{ background: "hsl(220, 15%, 10%)", border: "none", borderRadius: 12, fontSize: 12, color: "#fff" }} cursor={{ fill: "hsl(175, 85%, 32%, 0.05)" }} />
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
                <div className="group relative mb-3">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground cursor-help">🌡️ Intensity Trend</h2>
                  <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 w-56 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <p className="text-[10px] text-muted-foreground">Average anger intensity (1-5) over the past 14 days. Lower is better — it means your episodes are becoming less severe.</p>
                  </div>
                </div>
                <div className="mb-5 rounded-2xl border border-border bg-card p-4">
                  <ResponsiveContainer width="100%" height={140}>
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
                <div className="group relative mb-3">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground cursor-help">🎯 Top Triggers</h2>
                  <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 w-56 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <p className="text-[10px] text-muted-foreground">Your most common anger triggers ranked by frequency. Knowing your triggers helps you prepare and prevent anger before it starts.</p>
                  </div>
                </div>
                <div className="mb-5 rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-28 w-28 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={triggerData} dataKey="value" cx="50%" cy="50%" outerRadius={50} innerRadius={25} paddingAngle={3} strokeWidth={0}>
                            {triggerData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                      {triggerData.map((t, i) => (
                        <div key={t.name} className="flex items-center gap-2 text-sm">
                          <span className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="truncate text-foreground">{t.name}</span>
                          <span className="ml-auto text-muted-foreground">{t.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Achievements */}
            <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">🏆 Achievements</h2>
            <div className="grid grid-cols-3 gap-3">
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
          </motion.div>
        )}

        {/* ── Mood Analytics ── */}
        {subTab === "mood" && (
          <motion.div key="mood" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {moodLog.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <p className="text-3xl mb-2">🧠</p>
                <p className="text-muted-foreground">No mood entries yet. Check in on the Home tab throughout the day.</p>
              </div>
            ) : (
              <>
                {/* Today's Timeline */}
                <div className="group relative mb-3">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground cursor-help">📅 Today's Mood Timeline</h2>
                  <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 w-56 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <p className="text-[10px] text-muted-foreground">Every mood check-in you've logged today, plotted by time. Helps you see how your mood shifts throughout the day.</p>
                  </div>
                </div>
                <div className="mb-5 rounded-2xl border border-border bg-card p-4">
                  {todayMoodTimeline.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={todayMoodTimeline}>
                          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(200, 10%, 45%)" }} axisLine={false} tickLine={false} />
                          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: "hsl(200, 10%, 45%)" }} axisLine={false} tickLine={false} width={20} />
                          <Tooltip
                            contentStyle={{ background: "hsl(220, 15%, 10%)", border: "none", borderRadius: 12, fontSize: 12, color: "#fff" }}
                            formatter={(value: number) => [moodEmojis[value - 1] + " " + moodLabels[value - 1], "Mood"]}
                          />
                          <Line type="monotone" dataKey="mood" stroke={CHART_COLORS.primary} strokeWidth={2.5} dot={{ fill: CHART_COLORS.primary, r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="mt-3 flex flex-col gap-1.5">
                        {todayMoodTimeline.map((entry, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-background p-2">
                            <span className="text-lg">{moodEmojis[entry.mood - 1]}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-foreground">{moodLabels[entry.mood - 1]}</span>
                                <span className="text-[10px] text-muted-foreground">{entry.time}</span>
                                {entry.timeOfDay && <span className="text-[10px]">{timeOfDayEmojis[entry.timeOfDay]}</span>}
                              </div>
                              {entry.note && <p className="text-[10px] text-muted-foreground truncate">"{entry.note}"</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="py-6 text-center text-sm text-muted-foreground">No mood check-ins today. Tap a mood emoji on the Home tab.</p>
                  )}
                </div>

                {/* 14-Day Mood Trend */}
                <div className="group relative mb-3">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground cursor-help">📈 14-Day Mood Trend</h2>
                  <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 w-56 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <p className="text-[10px] text-muted-foreground">Daily average mood over 2 weeks. Higher = better mood. Track how your emotional state changes over time.</p>
                  </div>
                </div>
                <div className="mb-5 rounded-2xl border border-border bg-card p-4">
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={moodDailyData.filter((d) => d.avg !== null)}>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(200, 10%, 45%)" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: "hsl(200, 10%, 45%)" }} axisLine={false} tickLine={false} width={20} />
                      <Tooltip
                        contentStyle={{ background: "hsl(220, 15%, 10%)", border: "none", borderRadius: 12, fontSize: 12, color: "#fff" }}
                        formatter={(value: number) => [value.toFixed(1) + " avg", "Mood"]}
                      />
                      <Area type="monotone" dataKey="avg" name="Avg Mood" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                    <span>😢 1 = Struggling</span>
                    <span>😊 5 = Great</span>
                  </div>
                </div>

                {/* Time-of-Day Breakdown */}
                <div className="group relative mb-3">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground cursor-help">🕐 Time-of-Day Patterns</h2>
                  <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 w-56 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <p className="text-[10px] text-muted-foreground">Shows your average mood at different times of day. Helps identify when you tend to feel best or worst.</p>
                  </div>
                </div>
                <div className="mb-5 grid grid-cols-4 gap-2">
                  {timeOfDayData.map((t) => (
                    <div key={t.period} className="rounded-xl border border-border bg-card p-3 text-center">
                      <p className="text-lg">{t.emoji}</p>
                      <p className="text-[10px] font-medium text-foreground">{t.period}</p>
                      <p className="font-heading text-lg font-bold text-primary">
                        {t.avg !== null ? t.avg : "—"}
                      </p>
                      <p className="text-[8px] text-muted-foreground">{t.count} entries</p>
                    </div>
                  ))}
                </div>

                {/* Mood Distribution */}
                <div className="group relative mb-3">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground cursor-help">🎯 Mood Distribution</h2>
                  <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 w-56 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <p className="text-[10px] text-muted-foreground">How often you feel each mood level. A healthy distribution skews toward Great/Good.</p>
                  </div>
                </div>
                <div className="mb-5 rounded-2xl border border-border bg-card p-4">
                  <div className="flex flex-col gap-2">
                    {moodDistribution.map((m) => {
                      const maxVal = Math.max(...moodDistribution.map((d) => d.value), 1);
                      const pct = Math.round((m.value / maxVal) * 100);
                      return (
                        <div key={m.name} className="flex items-center gap-2">
                          <span className="text-lg w-7 text-center">{m.emoji}</span>
                          <span className="w-16 text-xs text-foreground">{m.name}</span>
                          <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-right text-xs font-medium text-muted-foreground">{m.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Full Mood Log */}
                <div className="group relative mb-3">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground cursor-help">📝 Complete Mood Log</h2>
                  <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 w-56 rounded-xl border border-border bg-popover p-2.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <p className="text-[10px] text-muted-foreground">Every mood entry you've ever logged, with exact times, notes, and context.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {moodLog.slice(0, 50).map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-border bg-card p-2.5">
                      {editingMoodId === entry.id ? (
                        <div>
                          <div className="flex gap-1 mb-2">
                            {moodEmojis.map((emoji, i) => (
                              <button key={i} onClick={() => setEditMoodValue(i + 1)}
                                className={`flex-1 rounded-lg p-1.5 text-lg transition-all ${editMoodValue === i + 1 ? "bg-primary/10 border border-primary/30 scale-105" : "border border-transparent hover:bg-muted"}`}
                              >{emoji}</button>
                            ))}
                          </div>
                          <input type="text" value={editMoodNote} onChange={(e) => setEditMoodNote(e.target.value)}
                            placeholder="Note (optional)" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground mb-2 focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setEditingMoodId(null)} className="flex-1 rounded-lg border border-border py-1.5 text-xs text-muted-foreground hover:bg-muted">Cancel</button>
                            <button onClick={() => { updateMoodEntry(entry.id, editMoodValue, editMoodNote || undefined); setEditingMoodId(null); }}
                              className="flex-1 rounded-lg bg-primary py-1.5 text-xs font-medium text-primary-foreground">Save</button>
                            <button onClick={() => { if (confirm("Delete this mood entry?")) { deleteMoodEntry(entry.id); setEditingMoodId(null); } }}
                              className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10">🗑️</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingMoodId(entry.id); setEditMoodValue(entry.mood); setEditMoodNote(entry.note || ""); }}
                          className="flex w-full items-center gap-2 text-left"
                        >
                          <span className="text-xl">{moodEmojis[entry.mood - 1]}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-foreground">{moodLabels[entry.mood - 1]}</span>
                              {entry.timeOfDay && <span className="text-[10px]">{timeOfDayEmojis[entry.timeOfDay || "morning"]}</span>}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString()} · {new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            {entry.note && <p className="text-[10px] text-muted-foreground italic truncate">"{entry.note}"</p>}
                          </div>
                          <span className="text-[9px] text-muted-foreground">✏️</span>
                        </button>
                      )}
                    </div>
                  ))}
                  {moodLog.length > 50 && (
                    <p className="text-center text-[10px] text-muted-foreground py-2">Showing latest 50 of {moodLog.length} entries</p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ── Journal ── */}
        {subTab === "journal" && (
          <motion.div key="journal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">📋 Anger Journal</h2>
            {angerLog.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <p className="text-muted-foreground">No entries yet. Use the 🔥 button when anger strikes.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {angerLog.map((entry) => (
                  <div key={entry.id} className={`rounded-xl border p-3 ${entry.controlled ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{entry.situation || entry.trigger}</p>
                      <span className="text-lg">{entry.controlled ? "✅" : "⚠️"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {entry.trigger} · Intensity {entry.intensity}/5 · {new Date(entry.date).toLocaleDateString()}
                      {entry.durationSeconds ? ` · ⏱️ ${entry.durationSeconds < 60 ? `${entry.durationSeconds}s` : `${Math.floor(entry.durationSeconds / 60)}m ${entry.durationSeconds % 60}s`}` : ""}
                    </p>
                    {entry.tacticsUsed && entry.tacticsUsed.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {entry.tacticsUsed.map((t) => (
                          <span key={t} className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">{t}</span>
                        ))}
                      </div>
                    )}
                    {entry.reflection && <p className="mt-1 text-xs italic text-muted-foreground">"{entry.reflection}"</p>}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Settings ── */}
        {subTab === "settings" && (
          <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Notifications */}
            <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">🔔 Reminders</h2>
            <div className="mb-5 flex flex-col gap-2">
              <label className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div>
                  <span className="text-sm font-medium text-foreground">Daily Reminders</span>
                  <p className="text-xs text-muted-foreground">Mood check-in & dhikr at 9 AM</p>
                </div>
                <input type="checkbox" checked={notifEnabled} onChange={toggleNotifications} className="h-5 w-5 rounded accent-primary" />
              </label>
            </div>

            {/* Appearance */}
            <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">🎨 Appearance</h2>
            <div className="mb-5 flex flex-col gap-2">
              <label className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <span className="text-sm font-medium text-foreground">Dark Mode</span>
                <input type="checkbox" checked={settings.darkMode} onChange={(e) => updateSettings({ darkMode: e.target.checked })} className="h-5 w-5 rounded accent-primary" />
              </label>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-2 text-sm font-medium text-foreground">Font Size</p>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button key={size} onClick={() => updateSettings({ fontSize: size })} className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-all ${settings.fontSize === size ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <span className="text-sm font-medium text-foreground">Reduced Motion</span>
                <input type="checkbox" checked={settings.reducedMotion} onChange={(e) => updateSettings({ reducedMotion: e.target.checked })} className="h-5 w-5 rounded accent-primary" />
              </label>
            </div>

            {/* Data */}
            <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">📦 Your Data</h2>
            <div className="mb-5 flex flex-col gap-2">
              <button onClick={handleExportJSON} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground">Download Backup (JSON)</span>
                  <p className="text-xs text-muted-foreground">All data including settings & bookmarks</p>
                </div>
                <span className="text-lg">💾</span>
              </button>
              <button onClick={handleExportCSV} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground">Export Journal (CSV)</span>
                  <p className="text-xs text-muted-foreground">Anger log in spreadsheet format</p>
                </div>
                <span className="text-lg">📊</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground">Import Backup</span>
                  <p className="text-xs text-muted-foreground">Restore from JSON backup</p>
                </div>
                <span className="text-lg">📥</span>
              </button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
              <button onClick={handleDeleteJournal} className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 p-4 transition-colors hover:bg-destructive/10">
                <div className="text-left">
                  <span className="text-sm font-medium text-destructive">Delete Journal Entries</span>
                  <p className="text-xs text-destructive/70">{angerLog.length} entries · Cannot be undone</p>
                </div>
                <span className="text-lg">🗑️</span>
              </button>
            </div>

            {/* Install App */}
            <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">📱 App</h2>
            <div className="mb-5">
              <PwaInstallCard />
            </div>

            {/* Support */}
            <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">🛟 Support</h2>
            <div className="mb-5 flex flex-col gap-2">
              <a href="https://github.com/ummah-build/habibichill/issues/new?template=bug_report.md" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground">🐛 Report a Bug</span>
                  <p className="text-xs text-muted-foreground">Found something broken? Let us know</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </a>
              <a href="https://github.com/ummah-build/habibichill/issues/new?template=feature_request.md" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground">💡 Request a Feature</span>
                  <p className="text-xs text-muted-foreground">Suggest improvements or new tools</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </a>
              <a href="https://github.com/ummah-build/habibichill/issues" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground">📋 View Open Issues</span>
                  <p className="text-xs text-muted-foreground">See what's being worked on</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </a>
            </div>

            {/* About */}
            <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">ℹ️ About</h2>
            <div className="mb-5 flex flex-col gap-2">
              <a href="https://ummah.build" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
                <span className="text-sm font-medium text-foreground">Made by Ummah Build</span>
                <span className="text-muted-foreground">→</span>
              </a>
              <a href="https://x.com/ummahbuild" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
                <span className="text-sm font-medium text-foreground">Follow on X</span>
                <span className="text-muted-foreground">→</span>
              </a>
              <a href="https://github.com/ummah-build/habibichill" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
                <span className="text-sm font-medium text-foreground">⭐ Star on GitHub</span>
                <span className="text-muted-foreground">→</span>
              </a>
              <a href="/contribute" className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
                <span className="text-sm font-medium text-foreground">🤝 Contribute</span>
                <span className="text-muted-foreground">→</span>
              </a>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                if (confirm("Reset ALL data and go back to landing page? This cannot be undone.")) {
                  localStorage.clear();
                  setAppState("landing");
                  window.location.reload();
                }
              }}
              className="w-full rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              Reset All Data & Start Over
            </button>

            <p className="mt-6 pb-8 text-center text-xs text-muted-foreground">
              HabibiChill v1.2 · Made with ❤️ by <a href="https://ummah.build" className="underline">Ummah Build</a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Notification helpers
function scheduleReminders() {
  if ("serviceWorker" in navigator && "Notification" in window) {
    // Use setInterval as a simple reminder — checks every minute, fires at ~9 AM
    const checkInterval = setInterval(() => {
      const now = new Date();
      const lastShown = localStorage.getItem("hc-last-reminder-date");
      const today = now.toISOString().slice(0, 10);
      if (lastShown === today) return;
      if (now.getHours() >= 9) {
        localStorage.setItem("hc-last-reminder-date", today);
        new Notification("HabibiChill 🧘", {
          body: "Time for your daily mood check-in and dhikr! Remember: patience is strength.",
          icon: "/web-app-manifest-192x192.png",
          tag: "daily-reminder",
        });
      }
    }, 60000);
    localStorage.setItem("hc-reminder-interval", String(checkInterval));
  }
}

function clearReminders() {
  const intervalId = localStorage.getItem("hc-reminder-interval");
  if (intervalId) {
    clearInterval(parseInt(intervalId));
    localStorage.removeItem("hc-reminder-interval");
  }
}

// Auto-start reminders if enabled
if (typeof window !== "undefined" && localStorage.getItem("hc-notif-enabled") === "true" && "Notification" in window && Notification.permission === "granted") {
  scheduleReminders();
}

export default MeTab;

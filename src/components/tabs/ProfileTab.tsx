import { useRef } from "react";
import { useApp } from "@/context/AppContext";
import logo from "@/assets/habibichill-logo.png";

const ProfileTab = () => {
  const { sabrPoints, streak, angerLog, settings, updateSettings, setAppState } = useApp();
  const controlled = angerLog.filter((e) => e.controlled).length;
  const total = angerLog.length;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      app: "HabibiChill",
      version: "1.0",
      sabrPoints,
      streak,
      angerLog,
      settings,
      completedLessons: JSON.parse(localStorage.getItem("hc-completed-lessons") || "[]"),
      dhikrCounts: JSON.parse(localStorage.getItem("hc-dhikr-counts") || "[0,0,0]"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habibichill-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (angerLog.length === 0) return alert("No entries to export.");
    const headers = "Date,Trigger,Situation,Intensity,Controlled,Reflection\n";
    const rows = angerLog.map((e) =>
      `"${new Date(e.date).toLocaleString()}","${e.trigger}","${(e.situation || "").replace(/"/g, '""')}",${e.intensity},${e.controlled ? "Yes" : "No"},"${(e.reflection || "").replace(/"/g, '""')}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habibichill-journal-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.app !== "HabibiChill") {
          alert("This doesn't look like a HabibiChill backup file.");
          return;
        }
        if (!confirm(`Import backup from ${new Date(data.exportDate).toLocaleDateString()}? This will replace ALL current data.`)) return;

        if (data.angerLog) localStorage.setItem("hc-anger-log", JSON.stringify(data.angerLog));
        if (data.sabrPoints !== undefined) localStorage.setItem("hc-sabr-points", String(data.sabrPoints));
        if (data.streak !== undefined) localStorage.setItem("hc-streak", String(data.streak));
        if (data.settings) localStorage.setItem("hc-settings", JSON.stringify(data.settings));
        if (data.completedLessons) localStorage.setItem("hc-completed-lessons", JSON.stringify(data.completedLessons));
        if (data.dhikrCounts) localStorage.setItem("hc-dhikr-counts", JSON.stringify(data.dhikrCounts));

        window.location.reload();
      } catch {
        alert("Failed to read backup file. Make sure it's a valid HabibiChill backup.");
      }
    };
    reader.readAsText(file);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteJournal = () => {
    if (angerLog.length === 0) return;
    if (!confirm(`Delete all ${angerLog.length} journal entries? This cannot be undone.`)) return;
    localStorage.setItem("hc-anger-log", "[]");
    window.location.reload();
  };

  return (
    <div className="container mx-auto max-w-lg px-4 pt-6 pb-8">
      {/* User card */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <img src={logo} alt="Profile" className="h-14 w-14 rounded-full object-cover" />
        <div>
          <h1 className="font-heading text-lg font-bold text-foreground">HabibiChill User</h1>
          <p className="text-sm text-muted-foreground">{controlled}/{total} controlled · {sabrPoints} SP · {streak} day streak</p>
        </div>
      </div>

      {/* Data Management */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">📦 Your Data</h2>
      <div className="mb-6 flex flex-col gap-2">
        <button
          onClick={handleExportJSON}
          className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
        >
          <div className="text-left">
            <span className="text-sm font-medium text-foreground">Download Full Backup (JSON)</span>
            <p className="text-xs text-muted-foreground">All data including settings, lessons, dhikr progress</p>
          </div>
          <span className="text-lg">💾</span>
        </button>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
        >
          <div className="text-left">
            <span className="text-sm font-medium text-foreground">Export Journal (CSV)</span>
            <p className="text-xs text-muted-foreground">Anger log entries in spreadsheet format</p>
          </div>
          <span className="text-lg">📊</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
        >
          <div className="text-left">
            <span className="text-sm font-medium text-foreground">Import Backup</span>
            <p className="text-xs text-muted-foreground">Restore from a previously downloaded JSON backup</p>
          </div>
          <span className="text-lg">📥</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <button
          onClick={handleDeleteJournal}
          className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 p-4 transition-colors hover:bg-destructive/10"
        >
          <div className="text-left">
            <span className="text-sm font-medium text-destructive">Delete Journal Entries</span>
            <p className="text-xs text-destructive/70">{angerLog.length} entries · Cannot be undone</p>
          </div>
          <span className="text-lg">🗑️</span>
        </button>
      </div>

      {/* Settings */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">⚙️ Settings</h2>
      <div className="mb-6 flex flex-col gap-2">
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
        <label className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <span className="text-sm font-medium text-foreground">High Contrast</span>
          <input type="checkbox" checked={settings.highContrast} onChange={(e) => updateSettings({ highContrast: e.target.checked })} className="h-5 w-5 rounded accent-primary" />
        </label>
      </div>

      {/* About */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">ℹ️ About</h2>
      <div className="flex flex-col gap-2">
        <a href="https://ummah.build" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
          <span className="text-sm font-medium text-foreground">Made by Ummah Build</span>
          <span className="text-muted-foreground">→</span>
        </a>
        <a href="https://x.com/ummahbuild" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
          <span className="text-sm font-medium text-foreground">Follow on X</span>
          <span className="text-muted-foreground">→</span>
        </a>
        <a href="https://linkedin.com/company/ummah-build" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
          <span className="text-sm font-medium text-foreground">LinkedIn</span>
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
        className="mt-6 w-full rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        Reset All Data & Start Over
      </button>

      <p className="mt-6 pb-8 text-center text-xs text-muted-foreground">
        HabibiChill v1.0 · Made with ❤️ by <a href="https://ummah.build" className="underline">Ummah Build</a>
      </p>
    </div>
  );
};

export default ProfileTab;

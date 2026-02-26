import { useApp } from "@/context/AppContext";
import logo from "@/assets/habibichill-logo.png";

const ProfileTab = () => {
  const { sabrPoints, streak, angerLog, settings, updateSettings, setAppState } = useApp();
  const controlled = angerLog.filter((e) => e.controlled).length;

  return (
    <div className="container mx-auto max-w-lg px-4 pt-6">
      {/* User card */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <img src={logo} alt="Profile" className="h-14 w-14 rounded-full object-cover" />
        <div>
          <h1 className="font-heading text-lg font-bold text-foreground">HabibiChill User</h1>
          <p className="text-sm text-muted-foreground">{controlled} anger incidents controlled · {sabrPoints} sabr points</p>
        </div>
      </div>

      {/* Settings */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Settings</h2>
      <div className="flex flex-col gap-2">
        {/* Dark Mode */}
        <label className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <span className="text-sm font-medium text-foreground">Dark Mode</span>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) => updateSettings({ darkMode: e.target.checked })}
            className="h-5 w-5 rounded accent-primary"
          />
        </label>

        {/* Font Size */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-medium text-foreground">Font Size</p>
          <div className="flex gap-2">
            {(["small", "medium", "large"] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateSettings({ fontSize: size })}
                className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-all ${
                  settings.fontSize === size ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Reduced Motion */}
        <label className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <span className="text-sm font-medium text-foreground">Reduced Motion</span>
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
            className="h-5 w-5 rounded accent-primary"
          />
        </label>

        {/* High Contrast */}
        <label className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <span className="text-sm font-medium text-foreground">High Contrast</span>
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => updateSettings({ highContrast: e.target.checked })}
            className="h-5 w-5 rounded accent-primary"
          />
        </label>
      </div>

      {/* Links */}
      <h2 className="mb-3 mt-6 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">About</h2>
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
          if (confirm("Reset all data and go back to landing page?")) {
            localStorage.clear();
            setAppState("landing");
            window.location.reload();
          }
        }}
        className="mt-6 w-full rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        Reset All Data
      </button>

      <p className="mt-6 pb-8 text-center text-xs text-muted-foreground">
        HabibiChill v1.0 · Made with ❤️ by <a href="https://ummah.build" className="underline">Ummah Build</a>
      </p>
    </div>
  );
};

export default ProfileTab;

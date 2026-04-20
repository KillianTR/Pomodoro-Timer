import { useMemo, useState, useEffect } from "react";
import { usePomodoro } from "./hooks/usePomodoro.js";
import SettingsModal from "./components/SettingsModal.jsx";
import ModeCards from "./components/ModeCards.jsx";
import ActionBar from "./components/ActionBar.jsx";

const DEFAULTS = {
  focusMin: 25,
  shortMin: 5,
  longMin: 10,
  longEvery: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
};

const formatTime = (totalSeconds) => {
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

// Càrrega inicial: Prioritza la configuració guardada per l'usuari al seu navegador
function loadSettings() {
  try {
    const raw = localStorage.getItem("pomodoro_settings");
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export default function App() {
  const [settings, setSettings] = useState(() => loadSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);

  const durations = useMemo(() => ({
    focus: settings.focusMin * 60,
    short: settings.shortMin * 60,
    long: settings.longMin * 60,
  }), [settings.focusMin, settings.shortMin, settings.longMin]);

  const pomodoro = usePomodoro({
    durations,
    longEvery: settings.longEvery,
    autoStartBreaks: settings.autoStartBreaks,
    autoStartFocus: settings.autoStartFocus,
  });

  // Reflecteix el temps actual al títol de la pestanya (útil si l'usuari està en un altre lloc)
  useEffect(() => {
    const timeStr = formatTime(pomodoro.secondsLeft);
    const label = pomodoro.mode === "focus" ? "Focus" : "Break";
    document.title = `${timeStr} - ${label}`;
  }, [pomodoro.secondsLeft, pomodoro.mode]);

  const onApplySettings = (next) => {
    setSettings(next);
    localStorage.setItem("pomodoro_settings", JSON.stringify(next));
    setSettingsOpen(false);

    // Reinicia el timer en aplicar canvis per evitar inconsistències entre minuts/segons
    pomodoro.resetToMode(pomodoro.mode, {
      durations: {
        focus: next.focusMin * 60,
        short: next.shortMin * 60,
        long: next.longMin * 60,
      },
    });
  };

  return (
    <div className="page">
      <div className="wrap">
        <header className="hero">
          <div className="time">{formatTime(pomodoro.secondsLeft)}</div>
          <ActionBar
            running={pomodoro.running}
            onStart={pomodoro.start}
            onPause={pomodoro.pause}
            onReset={pomodoro.reset}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </header>
        <main>
          <ModeCards
            activeMode={pomodoro.mode}
            focusMin={settings.focusMin}
            shortMin={settings.shortMin}
            longMin={settings.longMin}
            onPickMode={(m) => pomodoro.setMode(m)}
            running={pomodoro.running}
          />
        </main>
      </div>
      {settingsOpen && (
        <SettingsModal
          value={settings}
          onClose={() => setSettingsOpen(false)}
          onApply={onApplySettings}
        />
      )}
    </div>
  );
}
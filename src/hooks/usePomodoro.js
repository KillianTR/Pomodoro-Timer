import { useEffect, useMemo, useRef, useState, useCallback } from "react";

const MODES = ["focus", "short", "long"];

// Limita un nombre dins d'un rang per evitar valors impossibles en la lògica de cicles
function clampInt(n, min, max) {
  const x = Number.isFinite(n) ? Math.floor(n) : min;
  return Math.max(min, Math.min(max, x));
}

export function usePomodoro({
  durations,
  longEvery = 4,
  autoStartBreaks = false,
  autoStartFocus = false,
  notificationsEnabled = false,
}) {
  const [mode, setModeState] = useState("focus");
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(durations.focus);

  const tickRef = useRef(null);
  const endAtRef = useRef(null);
  const audioRef = useRef(new Audio("/bell.mp3"));

  const totalSeconds = useMemo(() => durations[mode], [durations, mode]);

  const clearTick = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    endAtRef.current = null;
  }, []);

  const pause = useCallback(() => {
    if (!running) return;
    clearTick();
    setRunning(false);
  }, [running, clearTick]);

  const start = useCallback(() => {
    if (running) return;
    
    setRunning(true);
    /* ÚS DE Date.now():
       En lloc de restar 1 a un comptador cada segon (que genera desfasament si el navegador
       pausa processos en segon pla), calculem el moment EXACTE en què ha de 
       acabar el temps i restem el temps actual en cada tick.
    */
    const now = Date.now();
    endAtRef.current = now + secondsLeft * 1000;

    tickRef.current = setInterval(() => {
      const endAt = endAtRef.current;
      if (!endAt) return;

      const msLeft = endAt - Date.now();
      const next = Math.max(0, Math.ceil(msLeft / 1000));
      setSecondsLeft(next);

      if (next <= 0) {
        clearTick();
        setRunning(false);

        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {}); // Falla silenciosa si no hi ha interacció prèvia

        // Lògica de transició automàtica d'estats i cicles
        if (mode === "focus") {
          const nextCycle = cycle + 1;
          const shouldLong = nextCycle > clampInt(longEvery, 2, 12);
          const newCycle = shouldLong ? 1 : nextCycle;
          setCycle(newCycle);

          const nextMode = shouldLong ? "long" : "short";
          setModeState(nextMode);
          setSecondsLeft(durations[nextMode]);

          if (autoStartBreaks) setTimeout(() => start(), 50);
        } else {
          setModeState("focus");
          setSecondsLeft(durations.focus);
          if (autoStartFocus) setTimeout(() => start(), 50);
        }
      }
    }, 250); // Tick a 250ms per assegurar fluïdesa visual sense càrrega excessiva de CPU
  }, [running, secondsLeft, mode, cycle, durations, longEvery, autoStartBreaks, autoStartFocus, clearTick]);

  const reset = useCallback(() => {
    pause();
    setSecondsLeft(durations[mode]);
  }, [pause, durations, mode]);

  const setMode = (m) => {
    if (!MODES.includes(m)) return;
    pause();
    setModeState(m);
    setSecondsLeft(durations[m]);
  };

  const resetToMode = (m, { durations: nextDurations } = {}) => {
    const d = nextDurations || durations;
    if (!MODES.includes(m)) return;
    pause();
    setSecondsLeft(d[m]);
  };

  useEffect(() => {
    if (!running) setSecondsLeft(durations[mode]);
  }, [durations, mode, running]);

  // Dreceres de teclat: Espai per Play/Pause i 'R' per Reset
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.code === "Space") {
        e.preventDefault(); // Evita l'scroll involuntari en prémer l'espai
        running ? pause() : start();
      }
      if (e.key.toLowerCase() === "r") reset();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [running, start, pause, reset]);

  useEffect(() => () => clearTick(), [clearTick]);

  return { mode, running, cycle, secondsLeft, totalSeconds, start, pause, reset, setMode, resetToMode };
}
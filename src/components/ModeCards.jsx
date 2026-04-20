export default function ModeCards({
  activeMode,
  focusMin,
  shortMin,
  longMin,
  onPickMode,
  running, 
}) {
  return (
    <div className="modes">
      <button
        className={`mode-card ${activeMode === "focus" ? "active" : ""} ${
          running ? "disabled" : ""
        }`}
        onClick={() => !running && onPickMode("focus")}
        disabled={running}
      >
        <div className="mode-left">
          <div className="mode-title">Focus</div>
          <div className="mode-sub">{focusMin} minutes</div>
        </div>
        <div className="mode-icon">
          <TargetIcon />
        </div>
      </button>

      <button
        className={`mode-card ${activeMode === "short" ? "active" : ""} ${
          running ? "disabled" : ""
        }`}
        onClick={() => !running && onPickMode("short")}
        disabled={running}
      >
        <div className="mode-left">
          <div className="mode-title">Short Break</div>
          <div className="mode-sub">{shortMin} minutes</div>
        </div>
        <div className="mode-icon">
          <CupIcon />
        </div>
      </button>

      <button
        className={`mode-card ${activeMode === "long" ? "active" : ""} ${
          running ? "disabled" : ""
        }`}
        onClick={() => !running && onPickMode("long")}
        disabled={running}
      >
        <div className="mode-left">
          <div className="mode-title">Long Break</div>
          <div className="mode-sub">{longMin} minutes</div>
        </div>
        <div className="mode-icon">
          <ArmchairIcon />
        </div>
      </button>
    </div>
  );
}

// Icono de Diana/Objetivo
function TargetIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5zm0 6.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
  );
}

// Icono de Taza
function CupIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
    </svg>
  );
}

// NUEVO: Icono de Sillón idéntico al de la imagen de referencia
function ArmchairIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 10.5V9a2.5 2.5 0 00-2.5-2.5h-13A2.5 2.5 0 003 9v1.5a2.5 2.5 0 002.5 2.5h1.75V15h9.5v-1.75h1.75a2.5 2.5 0 002.5-2.5zm-4.25-1.5h-9.5V8a1 1 0 011-1h7.5a1 1 0 011 1v1zM19 11.5a1 1 0 01-1 1h-2.5V11.5H16a1 1 0 001-1h1.75v1zM6 10.5a1 1 0 011 1H8v1.25a1 1 0 01-1-1H5.25V10.5H6zM6 16.25a.75.75 0 111.5 0a.75.75 0 01-1.5 0zm10.5 0a.75.75 0 111.5 0a.75.75 0 01-1.5 0z" />
    </svg>
  );
}
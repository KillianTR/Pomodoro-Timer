import { useEffect, useMemo, useState } from "react";

export default function SettingsModal({ value, onClose, onApply }) {
  const [form, setForm] = useState({ ...value });

  const focusMin = useMemo(() => clampNum(form.focusMin, 1, 180), [form.focusMin]);
  const shortMin = useMemo(() => clampNum(form.shortMin, 1, 60), [form.shortMin]);
  const longMin = useMemo(() => clampNum(form.longMin, 1, 90), [form.longMin]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSave = () => {
    onApply({
      ...form,
      focusMin,
      shortMin,
      longMin,
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-header-text">
            <h2 className="modal-title">Edit times</h2>
            <p className="modal-subtitle">
              Make changes to the timer durations and save them to apply.
            </p>
          </div>
          <button className="modal-x" onClick={onClose} aria-label="Close">
            <XIcon />
          </button>
        </div>

        <div className="modal-body">
          <Field
            label="Focus"
            value={form.focusMin}
            onChange={(v) => set("focusMin", v)}
          />
          <Field
            label="Short break"
            value={form.shortMin}
            onChange={(v) => set("shortMin", v)}
          />
          <Field
            label="Long break"
            value={form.longMin}
            onChange={(v) => set("longMin", v)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-text" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={onSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="input-wrap">
        <input
          className="modal-input"
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="input-suffix">min</span>
      </div>
    </label>
  );
}

function clampNum(n, min, max) {
  const x = Number.isFinite(n) ? n : min;
  return Math.max(min, Math.min(max, x));
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
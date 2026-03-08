import { useState, useRef, useEffect } from "react";
import { ALL_CATEGORIES } from "../constants";

export default function CategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const label = value ?? "Todas";
  const isFiltered = value !== null;

  return (
    <div className="cat-dropdown" ref={ref}>
      <button
        className={`cat-dropdown-trigger tag-btn ${isFiltered ? "active-category" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <span className={`cat-dropdown-arrow ${open ? "open" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="cat-dropdown-menu">
          <div className="cat-dropdown-inner">
            <button
              className={`cat-dropdown-item ${value === null ? "active" : ""}`}
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
            >
              Todas
              {value === null && <span className="cat-check">✓</span>}
            </button>

            <div className="cat-dropdown-sep" />

            {ALL_CATEGORIES.map((c) => (
              <button
                key={c}
                className={`cat-dropdown-item ${value === c ? "active" : ""}`}
                onClick={() => {
                  onChange(value === c ? null : c);
                  setOpen(false);
                }}
              >
                {c}
                {value === c && <span className="cat-check">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";

export default function CustomSelect({ value, onChange, options = [], placeholder = "Select...", name }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const rootRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open) setHighlight(-1);
  }, [open]);

  function handleToggle() {
    setOpen((s) => !s);
  }

  function handleSelect(opt) {
    onChange && onChange(opt.value);
    setOpen(false);
  }

  function onKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      setHighlight(0);
      e.preventDefault();
      return;
    }
    if (open) {
      if (e.key === "ArrowDown") setHighlight((h) => Math.min(h + 1, options.length - 1));
      if (e.key === "ArrowUp") setHighlight((h) => Math.max(h - 1, 0));
      if (e.key === "Enter" && highlight >= 0) {
        handleSelect(options[highlight]);
      }
      if (e.key === "Escape") setOpen(false);
    }
  }

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div className="relative" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={handleToggle}
        className="w-full text-left px-3 py-2 border border-gray-200 rounded-lg bg-yellow-50 focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        <span className={`block truncate ${value ? "text-gray-900" : "text-gray-500"}`}>{selectedLabel}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg max-h-56 overflow-auto border border-gray-200"
        >
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onMouseEnter={() => setHighlight(idx)}
              onClick={() => handleSelect(opt)}
              className={`px-3 py-2 cursor-pointer ${
                idx === highlight ? "bg-yellow-300 text-gray-900" : opt.value === value ? "bg-yellow-200 text-gray-900" : "text-gray-900"
              } hover:bg-yellow-300`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {/* hidden native input for form submission / integration */}
      {name && <input type="hidden" name={name} value={value || ""} />}
    </div>
  );
}

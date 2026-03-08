

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const LanguageDropdown = () => {
  const { language, changeLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);

  const current =
    languages.find((l) => l.code === language) || languages[0];

  const handleSelect = (code) => {
    changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
      className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-800 flex items-center gap-1 hover:bg-emerald-100"

      >
        <span>{current.native}</span>
        <span className="text-[10px]">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-32 rounded-lg bg-white/95 text-xs shadow-lg text-slate-900 z-30 max-h-40 overflow-y-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`block w-full text-left px-3 py-2 hover:bg-emerald-50 ${
                lang.code === language
                  ? "font-semibold text-emerald-700"
                  : ""
              }`}
            >
              {lang.native}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;

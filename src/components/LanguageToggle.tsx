"use client";

import { useLanguage } from "@/lib/i18n";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-full border border-white/20 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang("lv")}
        aria-pressed={lang === "lv"}
        className={`px-2.5 py-1.5 transition-colors ${
          lang === "lv" ? "bg-leaf text-jungle" : "text-white/70 hover:text-white"
        }`}
      >
        LV
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-2.5 py-1.5 transition-colors ${
          lang === "en" ? "bg-leaf text-jungle" : "text-white/70 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}

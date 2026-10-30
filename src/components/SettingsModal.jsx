import React, { useState } from 'react';
import {
  Settings,
  X,
  Zap,
  Volume2,
  VolumeX,
  Languages,
  Shield,
  Download,
  RotateCcw,
  CheckCircle2,
  Sliders,
  CheckCheck,
  BookOpen,
  Sun,
  Moon,
  Palette,
  Globe,
  RefreshCw,
  Check
} from 'lucide-react';
import { sound } from '../services/soundService.js';
import { getTranslation } from '../i18n/translations.js';

export default function SettingsModal({
  isOpen,
  onClose,
  isDarkMode,
  setIsDarkMode,
  currentTheme,
  setCurrentTheme,
  spellCheckEnabled,
  setSpellCheckEnabled,
  autoCorrectMode,
  setAutoCorrectMode,
  selectionLookupEnabled,
  setSelectionLookupEnabled,
  soundEffects,
  setSoundEffects,
  targetTranslationLang,
  setTargetTranslationLang,
  onExportNotes,
  onResetDefaults,
  onReloadStarterNotes,
  onClearAllStarterNotes,
  appLanguage = 'en',
  setAppLanguage
}) {
  const [reloadSuccess, setReloadSuccess] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  if (!isOpen) return null;

  const t = getTranslation(appLanguage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="max-w-xl w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[var(--text-main)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">{t.settings.title}</h2>
              <p className="text-xs text-[var(--text-muted)]">
                {t.settings.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-surface)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Language Selection Row */}
          <div className="space-y-3 pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[var(--accent)]" />
                  <span>{t.settings.languageLabel}</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {t.settings.languageDesc}
                </p>
              </div>
              <div className="flex items-center p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs">
                <button
                  type="button"
                  onClick={() => setAppLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    appLanguage === 'en'
                      ? 'bg-[var(--accent)] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>EN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAppLanguage('tr')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    appLanguage === 'tr'
                      ? 'bg-[var(--accent)] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <span>🇹🇷</span>
                  <span>TR</span>
                </button>
              </div>
            </div>

            {/* Quick Manage Starter Notes Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[var(--bg-surface)]/60 p-2.5 rounded-xl border border-[var(--border-color)]">
              <span className="text-[11px] text-[var(--text-muted)] leading-tight">
                {appLanguage === 'en'
                  ? 'Manage pre-made starter notes and templates'
                  : 'Örnek başlangıç notlarını ve şablonları yönetin'}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    if (onClearAllStarterNotes) onClearAllStarterNotes();
                    setClearSuccess(true);
                    setTimeout(() => setClearSuccess(false), 2500);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                  title={appLanguage === 'en' ? 'Delete all sample notes and start with a blank note' : 'Tüm örnek notları sil ve boş bir notla başla'}
                >
                  {clearSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{appLanguage === 'en' ? 'Cleared!' : 'Temizlendi!'}</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{appLanguage === 'en' ? 'Clear Samples' : 'Örnekleri Temizle'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onReloadStarterNotes) onReloadStarterNotes();
                    setReloadSuccess(true);
                    setTimeout(() => setReloadSuccess(false), 2500);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] hover:bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--border-color)] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                >
                  {reloadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.settings.starterNotesReloaded}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{t.settings.reloadStarterNotes}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Dark Mode */}
          <div className="space-y-3 pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  {isDarkMode ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span>{t.settings.darkModeLabel}</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {t.settings.darkModeDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  isDarkMode ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Spellcheck Toggle */}
          <div className="space-y-2 pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <CheckCheck className="w-4 h-4 text-emerald-500" />
                  <span>{t.settings.spellcheckLabel}</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {t.settings.spellcheckDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSpellCheckEnabled(!spellCheckEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  spellCheckEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    spellCheckEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Auto-Correct Mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{t.settings.autoCorrectLabel}</span>
            </div>

            <div className="space-y-2">
              <label
                onClick={() => setAutoCorrectMode('instant')}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  autoCorrectMode === 'instant'
                    ? 'border-[var(--accent)] bg-[var(--accent-light)]/40 shadow-sm'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <input
                  type="radio"
                  name="autocorrect"
                  checked={autoCorrectMode === 'instant'}
                  onChange={() => setAutoCorrectMode('instant')}
                  className="mt-0.5 text-[var(--accent)]"
                />
                <div className="flex-1 text-xs">
                  <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    <span>⚡ {t.settings.autoCorrectInstant}</span>
                  </div>
                  <p className="text-[var(--text-muted)] mt-0.5 leading-snug">
                    {appLanguage === 'en'
                      ? 'Replaces verified typos (e.g. aborad ➔ abroad) seamlessly on Space without interruption.'
                      : 'Boşluk tuşuna bastığınız an sadece bilinen hatalar (örn. aborad ➔ abroad) sessizce düzeltilir.'}
                  </p>
                </div>
              </label>

              <label
                onClick={() => setAutoCorrectMode('off')}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  autoCorrectMode === 'off'
                    ? 'border-[var(--accent)] bg-[var(--accent-light)]/40 shadow-sm'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <input
                  type="radio"
                  name="autocorrect"
                  checked={autoCorrectMode === 'off'}
                  onChange={() => setAutoCorrectMode('off')}
                  className="mt-0.5 text-[var(--accent)]"
                />
                <div className="flex-1 text-xs">
                  <div className="font-bold text-[var(--text-main)]">
                    ⏸ {t.settings.autoCorrectOff}
                  </div>
                  <p className="text-[var(--text-muted)] mt-0.5 leading-snug">
                    {appLanguage === 'en'
                      ? 'No auto-correction applied. Manual batch spellcheck remains available.'
                      : 'Hiçbir otomatik düzeltme uygulanmaz. Manuel toplu imla denetimi kullanılabilir.'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Selection Translation Bubble Toggle */}
          <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-[var(--accent)]" />
                  <span>{t.settings.selectionLookupLabel}</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {t.settings.selectionLookupDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectionLookupEnabled(!selectionLookupEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  selectionLookupEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    selectionLookupEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Target Language */}
          <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[var(--text-main)]">
                  {appLanguage === 'en' ? 'Default Dictionary Target' : 'Varsayılan Sözlük Hedef Dili'}
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {appLanguage === 'en'
                    ? 'Primary language for inline word lookup and definition popups'
                    : 'Kelime seçildiğinde sözlükte aranacak birincil hedef dil'}
                </p>
              </div>
              <select
                value={targetTranslationLang}
                onChange={e => setTargetTranslationLang(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] focus:outline-none"
              >
                <option value="tr">🇹🇷 Türkçe (TDK)</option>
                <option value="en">🇬🇧 English (Cambridge/ENABLE1)</option>
              </select>
            </div>
          </div>

          {/* Local-First & Security Notice */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>{appLanguage === 'en' ? '100% Offline & Zero-Telemetry Architecture' : '%100 Çevrimdışı & Yerel Cihaz Mimarisi'}</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {appLanguage === 'en'
                ? 'All spellchecking (ENABLE1 - 172,820 words), FreeDict lexicon, and AES-256 GCM encryption operate completely offline with zero server calls. Your data never leaves this device.'
                : 'Tüm yazım denetimi (ENABLE1 - 172.820 kelime), FreeDict sözlük ve şifreleme özellikleri sıfır harici API ile çalışır. Notlarınız cihazınızdan asla ayrılmaz.'}
            </p>
          </div>

          {/* Backup & Export */}
          <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
            <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Download className="w-4 h-4 text-[var(--accent)]" />
              <span>{t.settings.exportTitle}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onExportNotes}
                className="flex-1 py-2 px-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-main)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {t.settings.exportBtn}
              </button>
              <button
                onClick={onResetDefaults}
                className="py-2 px-3 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-100 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.settings.resetBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            {t.common.save} & {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { BookText, Check, Globe, Sparkles, FileText, BookOpen } from 'lucide-react';
import { getTranslation } from '../i18n/translations.js';

export default function LanguageSetupModal({ isOpen, onSelectLanguage }) {
  const [selectedLang, setSelectedLang] = useState('en');
  const [loadSampleNotes, setLoadSampleNotes] = useState(false); // Default to clean slate as preferred by user

  if (!isOpen) return null;

  const t = getTranslation(selectedLang);

  const handleConfirm = () => {
    onSelectLanguage(selectedLang, loadSampleNotes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-7 space-y-5 my-auto">
        {/* Brand & Icon */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white items-center justify-center shadow-lg shadow-sky-500/25 mb-1">
            <BookText className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text-main)] font-heading">
            {t.onboarding.welcome}
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-md mx-auto">
            {t.onboarding.subtitle}
          </p>
        </div>

        {/* 1. Language Selection Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{t.onboarding.chooseLanguage}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* English (Default) */}
            <div
              onClick={() => setSelectedLang('en')}
              className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedLang === 'en'
                  ? 'border-[var(--accent)] bg-[var(--accent-light)]/40 shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)]/40'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-2xl">🇬🇧</span>
                {selectedLang === 'en' && (
                  <div className="w-4 h-4 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[var(--text-main)] flex items-center gap-1">
                  English
                  <span className="text-[9px] font-semibold px-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    EN
                  </span>
                </h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight">
                  Oxford & Cambridge lexicon, ENABLE1 spellcheck.
                </p>
              </div>
            </div>

            {/* Turkish */}
            <div
              onClick={() => setSelectedLang('tr')}
              className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedLang === 'tr'
                  ? 'border-[var(--accent)] bg-[var(--accent-light)]/40 shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)]/40'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-2xl">🇹🇷</span>
                {selectedLang === 'tr' && (
                  <div className="w-4 h-4 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[var(--text-main)] flex items-center gap-1">
                  Türkçe
                  <span className="text-[9px] font-semibold px-1 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    TR
                  </span>
                </h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight">
                  TDK güncel Türkçe sözlük ve yerel imla denetimi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Starter Notes Choice Section (Yes / No) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{t.onboarding.starterNotesTitle}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* NO: Clean Blank Slate (Recommended) */}
            <div
              onClick={() => setLoadSampleNotes(false)}
              className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                !loadSampleNotes
                  ? 'border-[var(--accent)] bg-[var(--accent-light)]/40 shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)]/40'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-2xl">📄</span>
                {!loadSampleNotes && (
                  <div className="w-4 h-4 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[var(--text-main)]">
                  {t.onboarding.starterNotesNo}
                </h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight">
                  {t.onboarding.starterNotesNoDesc}
                </p>
              </div>
            </div>

            {/* YES: Load Example Notes */}
            <div
              onClick={() => setLoadSampleNotes(true)}
              className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                loadSampleNotes
                  ? 'border-[var(--accent)] bg-[var(--accent-light)]/40 shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)]/40'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-2xl">📚</span>
                {loadSampleNotes && (
                  <div className="w-4 h-4 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[var(--text-main)]">
                  {t.onboarding.starterNotesYes}
                </h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight">
                  {t.onboarding.starterNotesYesDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3 px-6 rounded-2xl bg-[var(--accent)] hover:opacity-90 text-white font-bold text-sm shadow-md shadow-[var(--accent)]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.onboarding.getStarted}</span>
          </button>
          <p className="text-[10px] text-center text-[var(--text-muted)] mt-2">
            {selectedLang === 'en'
              ? 'You can switch languages and manage starter templates anytime in Settings.'
              : 'Dilediğiniz zaman üst çubuktan veya ayarlardan dilinizi değiştirebilir veya şablon ekleyebilirsiniz.'}
          </p>
        </div>
      </div>
    </div>
  );
}

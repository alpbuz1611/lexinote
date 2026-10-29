import React, { useState } from 'react';
import { BookText, Check, Globe, Sparkles } from 'lucide-react';
import { getTranslation } from '../i18n/translations.js';

export default function LanguageSetupModal({ isOpen, onSelectLanguage }) {
  const [selectedLang, setSelectedLang] = useState('en');

  if (!isOpen) return null;

  const t = getTranslation(selectedLang);

  const handleConfirm = () => {
    onSelectLanguage(selectedLang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Brand & Icon */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white items-center justify-center shadow-lg shadow-sky-500/25 mb-1">
            <BookText className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-main)] font-heading">
            {t.onboarding.welcome}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-md mx-auto">
            {t.onboarding.subtitle}
          </p>
        </div>

        {/* Language Selection Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <Globe className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.onboarding.chooseLanguage}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* English (Default) */}
            <div
              onClick={() => setSelectedLang('en')}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedLang === 'en'
                  ? 'border-[var(--accent)] bg-[var(--accent-light)]/40 shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)]/40'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">🇬🇧</span>
                {selectedLang === 'en' && (
                  <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text-main)] flex items-center gap-1.5">
                  English
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Default
                  </span>
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-snug">
                  Full English UI, offline FreeDict bilingual dictionaries & ENABLE1 spellcheck.
                </p>
              </div>
            </div>

            {/* Turkish */}
            <div
              onClick={() => setSelectedLang('tr')}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedLang === 'tr'
                  ? 'border-[var(--accent)] bg-[var(--accent-light)]/40 shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)]/40'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">🇹🇷</span>
                {selectedLang === 'tr' && (
                  <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text-main)]">
                  Türkçe
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-snug">
                  Türkçe arayüz, yerel sözlükler, TDK imla denetimi ve bağlantı haritası.
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
            className="w-full py-3.5 px-6 rounded-2xl bg-[var(--accent)] hover:opacity-90 text-white font-bold text-sm shadow-md shadow-[var(--accent)]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.onboarding.getStarted}</span>
          </button>
          <p className="text-[11px] text-center text-[var(--text-muted)] mt-2">
            {selectedLang === 'en'
              ? 'You can switch between English and Turkish anytime from the header or settings.'
              : 'Dilediğiniz zaman üst çubuktan veya ayarlardan Türkçe ve İngilizce arasında geçiş yapabilirsiniz.'}
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Briefcase, BookOpen, FileText, X, ArrowRight } from 'lucide-react';
import { getTranslation } from '../i18n/translations.js';

export default function NewNoteModal({ isOpen, onClose, onCreateNote, appLanguage = 'en' }) {
  if (!isOpen) return null;

  const t = getTranslation(appLanguage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="max-w-md w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[var(--text-main)] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold font-heading">{t.newNoteModal.title}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {t.newNoteModal.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-surface)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3.5">
          {/* Plain / Blank Note Option */}
          <button
            onClick={() => {
              onCreateNote('plain');
              onClose();
            }}
            className="w-full p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-emerald-500 hover:bg-emerald-500/5 group text-left transition-all flex items-start gap-3.5 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--text-main)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {t.newNoteModal.plainTitle}
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-snug">
                {t.newNoteModal.plainDesc}
              </p>
            </div>
          </button>

          {/* Work Note Option */}
          <button
            onClick={() => {
              onCreateNote('work');
              onClose();
            }}
            className="w-full p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-blue-500 hover:bg-blue-500/5 group text-left transition-all flex items-start gap-3.5 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--text-main)] group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {t.newNoteModal.workTitle}
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-snug">
                {t.newNoteModal.workDesc}
              </p>
            </div>
          </button>

          {/* Journal Note Option */}
          <button
            onClick={() => {
              onCreateNote('journal');
              onClose();
            }}
            className="w-full p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-amber-500 hover:bg-amber-500/5 group text-left transition-all flex items-start gap-3.5 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--text-main)] group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  {t.newNoteModal.journalTitle}
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-snug">
                {t.newNoteModal.journalDesc}
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
          >
            {t.newNoteModal.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}

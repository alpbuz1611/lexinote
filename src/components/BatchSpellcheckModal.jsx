import React, { useState, useEffect } from 'react';
import { Check, X, CheckCheck, XCircle, Sparkles, AlertCircle, Globe } from 'lucide-react';
import { checkWord, extractWordAndPunctuation } from '../services/spellcheckService.js';
import { getTranslation } from '../i18n/translations.js';

/**
 * Scans content and returns list of detected typos with multilingual fallback
 */
export function scanContentForTypos(content, language = 'en', customWords = []) {
  if (!content) return [];
  const words = content.split(/[\s\n]+/);
  const found = [];
  const seen = new Set();

  for (const rawWord of words) {
    const { word: cleanWord } = extractWordAndPunctuation(rawWord);
    if (!cleanWord || cleanWord.length < 3) continue;

    const lower = cleanWord.toLowerCase();
    if (seen.has(lower)) continue;

    const targetLang = language === 'auto' ? 'en' : language;
    let result = checkWord(cleanWord, targetLang, customWords);

    // If word is invalid without suggestion in target lang, check if it's a known typo in alternate language
    if (!result.isValid && !result.bestMatch) {
      const altLang = targetLang === 'en' ? 'tr' : 'en';
      const altResult = checkWord(cleanWord, altLang, customWords);
      if (altResult.isKnownTypo || (altResult.bestMatch && !altResult.isValid)) {
        result = altResult;
      }
    }

    if (!result.isValid && result.bestMatch) {
      seen.add(lower);
      found.push({
        original: cleanWord,
        suggested: result.bestMatch,
        isKnownTypo: result.isKnownTypo,
        accepted: true
      });
    }
  }

  return found;
}

export default function BatchSpellcheckModal({
  isOpen,
  onClose,
  content,
  language = 'en',
  customWords = [],
  onApplyFixes,
  appLanguage = 'en'
}) {
  if (!isOpen) return null;

  const t = getTranslation(appLanguage);

  const [activeLang, setActiveLang] = useState(language || 'en');
  const [typos, setTypos] = useState([]);

  // Recalculate whenever opened, content changes, or language selector changes
  useEffect(() => {
    if (isOpen) {
      const scanned = scanContentForTypos(content, activeLang, customWords);
      setTypos(scanned);
    }
  }, [isOpen, content, activeLang, customWords]);

  const toggleAccept = (index) => {
    setTypos(typos.map((item, idx) => (idx === index ? { ...item, accepted: !item.accepted } : item)));
  };

  const setAll = (accepted) => {
    setTypos(typos.map(item => ({ ...item, accepted })));
  };

  const handleApply = () => {
    let updated = content;
    const acceptedTypos = typos.filter(t => t.accepted);

    for (const item of acceptedTypos) {
      const escaped = item.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'g');
      updated = updated.replace(regex, item.suggested);
    }

    onApplyFixes(updated, acceptedTypos.length);
    onClose();
  };

  const wordCount = (content || '').trim().split(/[\s\n]+/).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="max-w-lg w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[var(--text-main)] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--accent-light)] text-[var(--accent)] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">{t.batchSpellcheck.title}</h2>
              <p className="text-xs text-[var(--text-muted)]">
                {t.batchSpellcheck.subtitle}
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

        {/* Dictionary Selector Tabs */}
        <div className="px-6 py-2.5 bg-[var(--bg-surface)]/60 border-b border-[var(--border-color)] flex items-center justify-between gap-2 flex-wrap text-xs">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{appLanguage === 'en' ? 'Active Dictionary:' : 'Taranan Sözlük:'}</span>
          </span>
          <div className="flex items-center gap-1 bg-[var(--bg-secondary)] p-0.5 rounded-lg border border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLang === 'en'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {t.batchSpellcheck.tabEnglish}
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('tr')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLang === 'tr'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {t.batchSpellcheck.tabTurkish}
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('auto')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLang === 'auto'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {t.batchSpellcheck.tabAll}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {!content || wordCount === 0 ? (
            <div className="text-center py-8 text-[var(--text-muted)]">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2 opacity-80" />
              <div className="text-sm font-bold text-[var(--text-main)]">
                {appLanguage === 'en' ? 'No Text to Scan' : 'Denetlenecek Metin Bulunamadı'}
              </div>
              <p className="text-xs mt-1 text-[var(--text-muted)]">
                {appLanguage === 'en' ? 'Please write some text into your note first.' : 'Lütfen notunuzun içerisine bir şeyler yazın ve tekrar deneyin.'}
              </p>
            </div>
          ) : typos.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-muted)] animate-in fade-in">
              <CheckCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-90" />
              <div className="text-sm font-bold text-[var(--text-main)]">
                {t.batchSpellcheck.noTyposFound}
              </div>
              <p className="text-xs mt-1 text-[var(--text-muted)] leading-relaxed">
                {appLanguage === 'en'
                  ? `The scanned ${wordCount} words comply with active lexicon standards.`
                  : `İncelenen ${wordCount} kelimelik metin seçili sözlük standartlarına göre hatasız görünüyor.`}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs pb-1 border-b border-[var(--border-color)]/60">
                <span className="font-semibold text-[var(--text-muted)]">
                  {appLanguage === 'en' ? 'Detected Typos:' : 'Tespit Edilen Hatalar:'} <strong className="text-[var(--text-main)]">{typos.length}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAll(true)}
                    className="text-[11px] font-medium text-emerald-600 hover:underline cursor-pointer"
                  >
                    {appLanguage === 'en' ? 'Accept All (✓)' : 'Tümünü Onayla (✓)'}
                  </button>
                  <span className="text-[var(--border-color)]">•</span>
                  <button
                    onClick={() => setAll(false)}
                    className="text-[11px] font-medium text-rose-500 hover:underline cursor-pointer"
                  >
                    {appLanguage === 'en' ? 'Reject All (✗)' : 'Tümünü Reddet (✗)'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {typos.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      item.accepted
                        ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/20'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] opacity-60'
                    }`}
                  >
                    <div className="flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="line-through text-rose-500 font-semibold">{item.original}</span>
                        <span className="text-[var(--text-muted)]">➔</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          {item.suggested}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        {item.isKnownTypo
                          ? (appLanguage === 'en' ? 'Direct Rule / Dictionary Match' : 'Doğrudan İmla Kuralı / Sözlük Eşleşmesi')
                          : (appLanguage === 'en' ? 'Closest Lexicon Match' : 'En Yakın Sözlük Karşılığı')}
                      </div>
                    </div>

                    {/* Accept / Reject Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleAccept(idx)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          item.accepted
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-emerald-600'
                        }`}
                        title={appLanguage === 'en' ? 'Accept correction' : 'Düzeltmeyi kabul et'}
                      >
                        <Check className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleAccept(idx)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !item.accepted
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-rose-600'
                        }`}
                        title={appLanguage === 'en' ? 'Ignore correction' : 'Düzeltmeyi yoksay'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
          >
            {t.common.cancel}
          </button>

          {typos.length > 0 && (
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-white hover:opacity-90 flex items-center gap-1.5 shadow-xs transition-opacity cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {appLanguage === 'en' ? 'Apply Selected Fixes' : 'Seçilenleri Düzelt'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

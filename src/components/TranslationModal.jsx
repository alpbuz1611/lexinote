import React, { useState, useMemo } from 'react';
import {
  Languages,
  X,
  Copy,
  Check,
  ArrowRight,
  ArrowRightLeft,
  Sparkles,
  BookOpen,
  Info,
  CornerDownRight,
  Plus
} from 'lucide-react';
import { translateOfflinePhraseOrSentence } from '../services/sentenceTranslationService.js';

export default function TranslationModal({
  isOpen,
  onClose,
  onInsertToNote
}) {
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('en'); // 'en' | 'tr'
  const [copied, setCopied] = useState(false);

  const targetLang = sourceLang === 'en' ? 'tr' : 'en';

  const translationResult = useMemo(() => {
    if (!inputText.trim()) return null;
    return translateOfflinePhraseOrSentence(inputText.trim(), sourceLang, targetLang);
  }, [inputText, sourceLang, targetLang]);

  if (!isOpen) return null;

  const handleSwapLanguages = () => {
    setSourceLang(prev => (prev === 'en' ? 'tr' : 'en'));
    if (translationResult?.translation) {
      setInputText(translationResult.translation);
    }
  };

  const handleCopy = (text) => {
    const toCopy = text || translationResult?.translation;
    if (toCopy) {
      navigator.clipboard.writeText(toCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleInsert = (text) => {
    const toInsert = text || translationResult?.translation;
    if (toInsert && onInsertToNote) {
      onInsertToNote(toInsert);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="max-w-2xl w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-[var(--text-main)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Çevrimdışı Çeviri ve Cümle Tercümesi</h2>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  %100 Yerel
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                FreeDict (34.405 Madde Başı) ve Deyim Veritabanı Destekli
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-surface)]"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selector Bar */}
        <div className="px-6 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
            <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              {sourceLang === 'en' ? '🇬🇧 İngilizce' : '🇹🇷 Türkçe'}
            </span>

            <button
              onClick={handleSwapLanguages}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--accent)] transition-colors"
              title="Dilleri Değiştir"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              {targetLang === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 İngilizce'}
            </span>
          </div>

          <span className="text-[11px] text-[var(--text-muted)]">
            İnternet bağlantısı gerektirmez (0ms gecikme)
          </span>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Input Area */}
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">
              Çevrilecek Kelime, Kalıp veya Cümleyi Girin:
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={
                sourceLang === 'en'
                  ? 'Enter an English word or sentence (e.g., "by the book", "I work at a school abroad", "beautiful book")...'
                  : 'Türkçe kelime veya ifade girin (örn. "kitap", "okul", "merhaba", "durum")...'
              }
              className="w-full p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
            />
          </div>

          {/* Translation Result Output */}
          {translationResult ? (
            <div className="space-y-3">
              {/* Context Notice */}
              {translationResult.isPolysemous && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{translationResult.contextNotice}</span>
                </div>
              )}

              {/* Detected Idioms */}
              {translationResult.detectedIdioms && translationResult.detectedIdioms.length > 0 && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1.5">
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    💡 Tespit Edilen Kalıp İfadeler & Deyimler
                  </div>
                  {translationResult.detectedIdioms.map((id, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--text-main)]">"{id.phrase}"</span>
                      <span className="font-bold text-[var(--accent)]">➔ {id.meaning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Primary Translation Card */}
              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-muted)]">
                    {translationResult.isSentence ? 'Cümle Karşılığı:' : 'Genel Çeviri & Başlıca Anlam:'}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)]">
                    {translationResult.source}
                  </span>
                </div>

                <div className="text-base font-bold text-[var(--accent)] leading-relaxed">
                  {translationResult.translation}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]/60">
                  <button
                    onClick={() => handleCopy()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Kopyalandı' : 'Kopyala'}
                  </button>

                  {onInsertToNote && (
                    <button
                      onClick={() => handleInsert()}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Notuma Ekle
                    </button>
                  )}
                </div>
              </div>

              {/* Structured Multiple Senses */}
              {translationResult.senses && translationResult.senses.length > 1 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[var(--text-muted)]">
                    Kaynak Sözlükteki Farklı Anlam Grupları ({translationResult.senses.length}):
                  </div>
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                    {translationResult.senses.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]/60 text-xs flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold w-4 h-4 rounded-full bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center">
                              {s.index || idx + 1}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                              {s.pos}
                            </span>
                          </div>
                          <div className="font-semibold text-[var(--text-main)] mt-1">
                            {s.text}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleCopy(s.text)}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
                            title="Bu anlamı kopyala"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {onInsertToNote && (
                            <button
                              onClick={() => handleInsert(s.text)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--accent)] text-white hover:opacity-90 flex items-center gap-0.5"
                              title="Notuma ekle"
                            >
                              <Plus className="w-3 h-3" /> Ekle
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Word-by-Word Token Breakdown */}
              {translationResult.tokenBreakdown && translationResult.tokenBreakdown.length > 1 && (
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-[var(--text-muted)]">
                    Kelime Kelime Anlam ve Sözlük Analizi:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {translationResult.tokenBreakdown.map((t, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]/50 text-xs flex items-baseline justify-between"
                      >
                        <span className="font-semibold text-[var(--text-main)]">
                          {t.word} {t.lemma && t.lemma !== t.word.toLowerCase() ? `(${t.lemma})` : ''}
                        </span>
                        <span className="font-bold text-[var(--accent)] text-right truncate max-w-[150px]">
                          {t.translation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-[var(--text-muted)] space-y-1">
              <p>Çeviri sonucunu görmek için yukarıya bir kelime, deyim veya cümle yazın.</p>
              <p className="text-[11px] text-[var(--text-muted)]/70">
                (Örn. "abroad", "book", "school", "by the book", "under the circumstances", "Hello, how are you?")
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

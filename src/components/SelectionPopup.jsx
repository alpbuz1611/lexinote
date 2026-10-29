import React, { useState, useEffect } from 'react';
import {
  Languages,
  Check,
  Copy,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  X,
  Sparkles,
  BookOpen,
  Info,
  CornerDownRight
} from 'lucide-react';
import { translateSelection } from '../services/translationService.js';

export default function SelectionPopup({
  selectedText,
  coords,
  sourceLang = 'en',
  targetLang = 'tr',
  onClose,
  onReplaceText,
  onAppendText,
  onSaveWord,
  isWordSaved = false
}) {
  const [copied, setCopied] = useState(false);
  const [copiedSenseIndex, setCopiedSenseIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!selectedText || !coords) return null;

  const translationResult = translateSelection(selectedText, sourceLang, targetLang);

  const handleCopy = (textToCopy = null, senseIdx = null) => {
    const target = textToCopy || translationResult?.translation;
    if (target) {
      navigator.clipboard.writeText(target);
      if (senseIdx !== null) {
        setCopiedSenseIndex(senseIdx);
        setTimeout(() => setCopiedSenseIndex(null), 1500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    }
  };

  // Mobile positioning vs desktop popup positioning
  const popupStyle = isMobile
    ? {
        position: 'fixed',
        bottom: '16px',
        left: '12px',
        right: '12px',
        zIndex: 60
      }
    : {
        position: 'fixed',
        left: `${Math.max(12, Math.min(window.innerWidth - 420, coords.x))}px`,
        top: `${Math.max(12, Math.min(window.innerHeight - 480, coords.y))}px`,
        zIndex: 60
      };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-150" style={popupStyle}>
      <div className="w-full sm:w-[400px] max-w-[calc(100vw-24px)] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-4 text-white backdrop-blur-xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="p-1 rounded bg-zinc-900 border border-zinc-800 text-cyan-400">
              <BookOpen className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {translationResult?.sourceLang || 'Kaynak'} ➔ {translationResult?.targetLang || 'Hedef'}
            </span>
            {translationResult?.source && (
              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 truncate max-w-[150px]">
                {translationResult.source}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-0.5">
          {/* Selected Word / Sentence */}
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-base font-extrabold text-white break-words line-clamp-2">
                "{selectedText}"
              </div>
              {translationResult?.cefr && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 flex-shrink-0">
                  CEFR {translationResult.cefr}
                </span>
              )}
            </div>
            {translationResult?.ipa && (
              <div className="text-[11px] font-mono text-cyan-400 font-semibold mt-0.5">
                {translationResult.ipa}
              </div>
            )}
          </div>

          {/* Context Notice if polysemous */}
          {translationResult?.isPolysemous && (
            <div className="p-2 rounded-xl bg-amber-950/70 border border-amber-800/80 text-amber-200 text-[11px] flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
              <span>{translationResult.contextNotice}</span>
            </div>
          )}

          {/* Detected Idioms if any */}
          {translationResult?.detectedIdioms && translationResult.detectedIdioms.length > 0 && (
            <div className="p-2.5 rounded-xl bg-sky-950/70 border border-sky-800/80 text-xs space-y-1">
              <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wide">
                💡 Tespit Edilen Kalıp İfade
              </div>
              {translationResult.detectedIdioms.map((id, i) => (
                <div key={i} className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-white">"{id.phrase}"</span>
                  <span className="font-bold text-cyan-400 text-right">➔ {id.meaning}</span>
                </div>
              ))}
            </div>
          )}

          {/* Primary / Overview Box */}
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-semibold text-zinc-400">
                {translationResult?.isSentence ? 'Cümle Karşılığı:' : 'Genel Karşılık & Başlıca Anlam:'}
              </span>
              {translationResult?.pos && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-zinc-700">
                  {translationResult.pos}
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-cyan-300 mt-1 leading-snug">
              {translationResult?.translation}
            </div>
          </div>

          {/* Structured Multiple Senses List (Requirement 4) */}
          {translationResult?.senses && translationResult.senses.length > 1 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-zinc-400 flex items-center justify-between">
                <span>Kaynak Sözlük Anlam Grupları ({translationResult.senses.length}):</span>
                <span className="text-[9px] font-normal text-zinc-500">Uygun olanı seçin</span>
              </div>
              <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                {translationResult.senses.map((sense, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xs transition-colors flex items-start justify-between gap-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold w-4 h-4 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center justify-center">
                          {sense.index || idx + 1}
                        </span>
                        <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-zinc-800 text-zinc-300">
                          {sense.pos}
                        </span>
                      </div>
                      <div className="font-semibold text-white mt-1 leading-snug">
                        {sense.text}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleCopy(sense.text, idx)}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Bu anlamı kopyala"
                      >
                        {copiedSenseIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => onReplaceText(sense.text)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-0.5"
                        title="Bu anlam ile metni değiştir"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        Seç
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Token Breakdown for Sentences */}
          {translationResult?.tokenBreakdown && translationResult.tokenBreakdown.length > 1 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold text-zinc-400">
                Sözcük Dökümü & Kelime Anlamları:
              </div>
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1 max-h-[130px] overflow-y-auto text-xs">
                {translationResult.tokenBreakdown.map((t, idx) => (
                  <div key={idx} className="flex items-baseline justify-between gap-1 text-[11px]">
                    <span className="font-medium text-zinc-400">
                      {t.word} {t.lemma && t.lemma !== t.word.toLowerCase() ? `(${t.lemma})` : ''}:
                    </span>
                    <span className="font-bold text-white text-right truncate">
                      {t.translation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-between gap-1.5 mt-3 pt-2 border-t border-zinc-800 flex-shrink-0">
          <button
            onClick={() => handleCopy()}
            className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors"
            title="Tüm Çeviriyi Panoya Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Kopyalandı' : 'Kopyala'}
          </button>

          <button
            onClick={() => onSaveWord(translationResult || { word: selectedText, translation: '' })}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-xl transition-colors ${
              isWordSaved
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800'
            }`}
            title="Kelime Defterime Kaydet"
          >
            {isWordSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5 text-zinc-400" />}
            {isWordSaved ? 'Kaydedildi' : 'Kaydet'}
          </button>

          {translationResult?.found && (
            <button
              onClick={() => onReplaceText(translationResult.translation)}
              className="flex-1 flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-90 text-white transition-opacity shadow-md"
              title="Seçili metni bu çeviriyle değiştir"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              Değiştir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

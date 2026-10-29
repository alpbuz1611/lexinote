import React, { useState } from 'react';
import { Bookmark, Star, Trash2, X, Search, Volume2, Sparkles, BookOpen, Download } from 'lucide-react';

export default function SavedWordsModal({
  isOpen,
  onClose,
  savedWords = [],
  onRemoveWord,
  onAddWord
}) {
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('all');
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  if (!isOpen) return null;

  const filtered = savedWords.filter(item => {
    if (filterLang !== 'all' && item.lang !== filterLang) return false;
    const q = search.toLowerCase();
    return (
      item.word.toLowerCase().includes(q) ||
      (item.translation && item.translation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="max-w-2xl w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-[var(--text-main)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold">Kaydedilen Kelimelerim & Söz Dağarcığı</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Notlarınızdan kaydettiğiniz kelimeler ve dil öğrenme kartları
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-surface)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Kaydedilen kelimelerde ara..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowFlashcard(!showFlashcard);
                setCardFlipped(false);
                setCardIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showFlashcard
                  ? 'bg-amber-500 text-white'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {showFlashcard ? 'Listeye Dön' : 'Flashcard / Kart Modu'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <Star className="w-10 h-10 mx-auto mb-2 opacity-40 text-amber-500" />
              <div className="text-sm font-bold text-[var(--text-main)]">Henüz Kaydedilen Kelime Yok</div>
              <p className="text-xs mt-1 max-w-sm mx-auto">
                Not yazarken herhangi bir kelimeyi seçip açılan çeviri penceresindeki <strong>"⭐ Kelimeyi Kaydet"</strong> butonuna basarak buraya ekleyebilirsiniz.
              </p>
            </div>
          ) : showFlashcard ? (
            /* Flashcard Interactive Learning View */
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="text-xs text-[var(--text-muted)] mb-3">
                Kart {cardIndex + 1} / {filtered.length}
              </div>

              <div
                onClick={() => setCardFlipped(!cardFlipped)}
                className="w-80 h-52 p-6 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--accent)]/40 shadow-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--accent)] transition-all select-none"
              >
                {!cardFlipped ? (
                  <div>
                    <div className="text-2xl font-black text-[var(--text-main)] mb-2">
                      {filtered[cardIndex]?.word}
                    </div>
                    {filtered[cardIndex]?.ipa && (
                      <div className="text-xs text-[var(--accent)] font-mono mb-2">
                        {filtered[cardIndex].ipa}
                      </div>
                    )}
                    <div className="text-[11px] text-[var(--text-muted)] mt-4">
                      (Anlamı görmek için tıkla)
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xl font-bold text-[var(--accent)] mb-2">
                      {filtered[cardIndex]?.translation}
                    </div>
                    {filtered[cardIndex]?.pos && (
                      <div className="text-xs text-[var(--text-muted)]">
                        {filtered[cardIndex].pos}
                      </div>
                    )}
                    {filtered[cardIndex]?.cefr && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-light)] text-[var(--accent)]">
                        CEFR: {filtered[cardIndex].cefr}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  disabled={cardIndex === 0}
                  onClick={() => {
                    setCardIndex(cardIndex - 1);
                    setCardFlipped(false);
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-color)] disabled:opacity-40"
                >
                  Önceki Kart
                </button>
                <button
                  disabled={cardIndex >= filtered.length - 1}
                  onClick={() => {
                    setCardIndex(cardIndex + 1);
                    setCardFlipped(false);
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-40"
                >
                  Sonraki Kart
                </button>
              </div>
            </div>
          ) : (
            /* Standard Vocabulary List */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map(item => (
                <div
                  key={item.id || item.word}
                  className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[var(--text-main)]">
                            {item.word}
                          </span>
                          {item.cefr && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                              {item.cefr}
                            </span>
                          )}
                        </div>
                        {item.ipa && (
                          <div className="text-[11px] text-[var(--accent)] font-mono">
                            {item.ipa}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onRemoveWord(item.id || item.word)}
                        className="text-[var(--text-muted)] hover:text-rose-500 p-1 transition-colors"
                        title="Kelimeyi kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs font-semibold text-[var(--text-main)] mt-2">
                      ➔ {item.translation}
                    </div>

                    {item.pos && (
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {item.pos}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-[var(--border-color)]/50 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                    <span>{item.source || 'Öğrenme Listesi'}</span>
                    <span>{new Date(item.savedAt || Date.now()).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">
            Toplam <strong>{savedWords.length}</strong> kelime kaydedildi
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold bg-[var(--accent)] text-white hover:opacity-90"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

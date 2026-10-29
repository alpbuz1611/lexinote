import React, { useState, useMemo } from 'react';
import {
  BookMarked,
  Search,
  Plus,
  Trash2,
  X,
  Languages,
  Zap,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
  ShieldCheck,
  Info
} from 'lucide-react';
import { EN_TYPO_MAP, DICTIONARY_SOURCE_INFO, EN_TO_TR_LEXICON } from '../data/dictionary_en.js';
import { TR_TO_EN_LEXICON, TR_TYPO_MAP } from '../data/dictionary_tr.js';
import { searchFreedict, lookupEnglishWord, getFreedictMetadata } from '../data/freedict/freedictLoader.js';

const FEATURED_EN_WORDS = [
  'abroad', 'hello', 'book', 'work', 'school',
  'language', 'beautiful', 'accommodate', 'acknowledge', 'circumstance',
  'international', 'computer', 'freedom', 'journey', 'knowledge',
  'opportunity', 'achieve', 'environment', 'government', 'development'
];

export default function DictionaryModal({
  isOpen,
  onClose,
  customWords = [],
  onAddCustomWord,
  onRemoveCustomWord
}) {
  const [activeTab, setActiveTab] = useState('en_tr'); // 'en_tr' | 'tr_en' | 'typos' | 'custom'
  const [searchQuery, setSearchQuery] = useState('');
  const [newWordInput, setNewWordInput] = useState('');

  // Search through EN -> TR via FreeDict offline database
  const enResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      // Default to featured core words
      return FEATURED_EN_WORDS.map(w => {
        const found = lookupEnglishWord(w);
        const curated = EN_TO_TR_LEXICON[w];
        return {
          word: w,
          translation: found?.translation || curated?.tr || '',
          description: found?.description || curated?.desc || '',
          senses: found?.senses || [],
          isPolysemous: found?.isPolysemous || false,
          contextNotice: found?.contextNotice || '',
          source: 'FreeDict eng-tur (GPLv2+)',
          cefr: curated?.cefr || null,
          ipa: curated?.ipa || null
        };
      });
    }
    return searchFreedict(q, 'en', 40);
  }, [searchQuery]);

  // Search through TR -> EN via FreeDict reverse index & curated vocabulary
  const trResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return Object.entries(TR_TO_EN_LEXICON).slice(0, 30).map(([tr, data]) => ({
        word: tr,
        translation: data.en,
        description: data.tdk,
        pos: data.pos,
        source: 'TDK & FreeDict İndeksi'
      }));
    }
    return searchFreedict(q, 'tr', 40);
  }, [searchQuery]);

  // Typo Maps combined
  const typoList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = [
      ...Object.entries(EN_TYPO_MAP).map(([typo, fix]) => ({ typo, fix, lang: 'İngilizce Yazım' })),
      ...Object.entries(TR_TYPO_MAP).map(([typo, fix]) => ({ typo, fix, lang: 'Türkçe İmla' }))
    ];
    if (!q) return list;
    return list.filter(item => item.typo.toLowerCase().includes(q) || item.fix.toLowerCase().includes(q));
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleAddWord = (e) => {
    e.preventDefault();
    if (!newWordInput.trim()) return;
    onAddCustomWord(newWordInput.trim());
    setNewWordInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden text-[var(--text-main)]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Çevrimdışı Sözlük & Yazım Altyapısı</h2>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Yerel Veri (0ms)
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                FreeDict eng-tur (34.405 Başlık) & ENABLE1 (172.819 Kelime) Altyapısı
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-surface)]"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Standards Badge Banner */}
        <div className="px-4 sm:px-6 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)] flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-500" />
            <span><strong>İngilizce ➔ Türkçe:</strong> FreeDict v0.3 (GPLv2+) • 34.405 Madde</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            <span><strong>Yazım Denetimi:</strong> ENABLE1 (Kamu Malı) • 172.819 Kelime</span>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="p-3 sm:p-4 border-b border-[var(--border-color)] bg-[var(--bg-surface)] space-y-2.5 flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="34.000+ kelimelik çevrimdışı sözlükte ara (örn. abroad, book, okul, durum)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Horizontally scrollable tabs for mobile/tablet */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('en_tr')}
              className={`flex-shrink-0 sm:flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'en_tr'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              🇬🇧 FreeDict EN ➔ TR ({enResults.length})
            </button>
            <button
              onClick={() => setActiveTab('tr_en')}
              className={`flex-shrink-0 sm:flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'tr_en'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              🇹🇷 Türkçe ➔ EN ({trResults.length})
            </button>
            <button
              onClick={() => setActiveTab('typos')}
              className={`flex-shrink-0 sm:flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'typos'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              ⚡ İmla Kuralları ({typoList.length})
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-shrink-0 sm:flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'custom'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              ⭐ Özel Terimler ({customWords.length})
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-[var(--border-color)]/50">
          {activeTab === 'en_tr' && (
            <div className="space-y-2.5">
              {enResults.length === 0 ? (
                <div className="text-center py-8 text-xs text-[var(--text-muted)]">
                  "{searchQuery}" araması için eşleşen sözlük kaydı bulunamadı.
                </div>
              ) : (
                enResults.map((item) => (
                  <div key={item.word} className="p-3.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-[var(--text-main)]">{item.word}</span>
                          {item.cefr && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                              CEFR {item.cefr}
                            </span>
                          )}
                          {item.ipa && (
                            <span className="text-xs font-mono text-[var(--accent)]">{item.ipa}</span>
                          )}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                          {item.source || 'FreeDict eng-tur (GPLv2+)'}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[var(--accent)] text-right">
                        {item.translation}
                      </span>
                    </div>

                    {/* Context Notice if polysemous */}
                    {item.isPolysemous && (
                      <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                        <Info className="w-3 h-3 flex-shrink-0" />
                        <span>Birden fazla farklı anlam grubu mevcuttur:</span>
                      </div>
                    )}

                    {/* Structured Senses Breakdown */}
                    {item.senses && item.senses.length > 1 ? (
                      <div className="mt-2 space-y-1 pt-2 border-t border-[var(--border-color)]/50">
                        {item.senses.slice(0, 5).map((s, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-[var(--text-main)]">
                            <span className="text-[9px] font-extrabold px-1 py-0.2 rounded bg-[var(--accent-light)] text-[var(--accent)] flex-shrink-0 mt-0.5">
                              {s.index || idx + 1}. {s.pos}
                            </span>
                            <span className="font-medium leading-snug">{s.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      item.description && (
                        <div className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                          {item.description}
                        </div>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'tr_en' && (
            <div className="space-y-2">
              {trResults.length === 0 ? (
                <div className="text-center py-8 text-xs text-[var(--text-muted)]">
                  "{searchQuery}" araması için eşleşen Türkçe sözlük kaydı bulunamadı.
                </div>
              ) : (
                trResults.map((item) => (
                  <div key={item.word} className="p-3.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-[var(--text-main)]">{item.word}</span>
                          {item.pos && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[var(--accent-light)] text-[var(--accent)]">
                              {item.pos}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                          {item.source || 'FreeDict Ters İndeks'}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[var(--accent)] text-right">
                        {item.translation}
                      </span>
                    </div>
                    {item.description && (
                      <div className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                        {item.description}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'typos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {typoList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                      {item.lang}
                    </span>
                    <span className="text-rose-500 line-through font-medium">{item.typo}</span>
                  </div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    ➔ {item.fix}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-4">
              <form onSubmit={handleAddWord} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newWordInput}
                  onChange={e => setNewWordInput(e.target.value)}
                  placeholder="Şirket terimi, marka adı veya yeni kelime ekle..."
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-white hover:opacity-90 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ekle
                </button>
              </form>

              {customWords.length === 0 ? (
                <div className="text-center py-8 text-xs text-[var(--text-muted)]">
                  Henüz özel terim eklemediniz. Eklediğiniz terimler sözlükte geçerli kabul edilir ve yazım denetiminde hata vermez.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {customWords.map((word, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface)] text-xs text-[var(--text-main)]"
                    >
                      <span className="font-medium">{word}</span>
                      <button
                        onClick={() => onRemoveCustomWord(word)}
                        className="p-1 text-[var(--text-muted)] hover:text-rose-500"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

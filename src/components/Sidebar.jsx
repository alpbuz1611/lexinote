import React from 'react';
import {
  Search,
  Pin,
  Lock,
  Trash2,
  CheckCircle2,
  Briefcase,
  BookOpen,
  Filter,
  Download,
  X,
  Palette,
  Sun,
  Moon,
  FileText
} from 'lucide-react';
import { THEMES } from './Header';
import { getTranslation } from '../i18n/translations.js';

const PRIORITY_COLORS = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
};

export default function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onDeleteNote,
  onTogglePin,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  selectedTag,
  setSelectedTag,
  onExportNotes,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  currentTheme,
  setCurrentTheme,
  isDarkMode,
  setIsDarkMode,
  appLanguage = 'en'
}) {
  const t = getTranslation(appLanguage);

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || []))).filter(Boolean);

  const filteredNotes = notes.filter(note => {
    if (activeFilter === 'plain' && note.mode !== 'plain') return false;
    if (activeFilter === 'work' && note.mode !== 'work') return false;
    if (activeFilter === 'journal' && note.mode !== 'journal') return false;
    if (activeFilter === 'locked' && !note.isLocked) return false;

    if (selectedTag && (!note.tags || !note.tags.includes(selectedTag))) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = (note.title || '').toLowerCase().includes(q);
      const inContent = (note.content || '').toLowerCase().includes(q);
      const inTags = (note.tags || []).some(tagItem => tagItem.toLowerCase().includes(q));
      return inTitle || inContent || inTags;
    }

    return true;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-72 sm:w-80 flex-shrink-0 border-r border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col transition-transform duration-200 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header Close & Theme Selector */}
        <div className="xl:hidden p-3 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {THEMES.map(themeItem => (
              <button
                key={themeItem.id}
                onClick={() => setCurrentTheme(themeItem.id)}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  currentTheme === themeItem.id
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
                }`}
                title={themeItem.name}
              >
                <span>{themeItem.icon}</span>
                <span className="text-[10px]">{themeItem.name.split(' ')[0]}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]"
              title={isDarkMode ? t.header.lightMode : t.header.darkMode}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
            </button>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1 rounded-lg text-[var(--text-muted)] lg:hidden hover:bg-[var(--bg-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-[var(--border-color)]">
          <div className="grid grid-cols-5 gap-0.5 p-1 rounded-xl bg-[var(--bg-surface)] text-[10px] sm:text-[11px] font-semibold text-center mb-2.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-main)] shadow-xs font-bold'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {t.common.all}
            </button>
            <button
              onClick={() => setActiveFilter('plain')}
              className={`py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'plain'
                  ? 'bg-[var(--bg-secondary)] text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              📄 {appLanguage === 'en' ? 'Plain' : 'Sade'}
            </button>
            <button
              onClick={() => setActiveFilter('work')}
              className={`py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'work'
                  ? 'bg-[var(--bg-secondary)] text-[var(--accent)] shadow-xs font-bold'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              💼 {appLanguage === 'en' ? 'Work' : 'İş'}
            </button>
            <button
              onClick={() => setActiveFilter('journal')}
              className={`py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'journal'
                  ? 'bg-[var(--bg-secondary)] text-[var(--accent)] shadow-xs font-bold'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              📖 {appLanguage === 'en' ? 'Daily' : 'Günlük'}
            </button>
            <button
              onClick={() => setActiveFilter('locked')}
              className={`py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'locked'
                  ? 'bg-[var(--bg-secondary)] text-amber-500 shadow-xs font-bold'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              🔒 {appLanguage === 'en' ? 'Lock' : 'Kilit'}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.sidebar.searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs cursor-pointer"
              >
                ×
              </button>
            )}
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto mt-2 pt-1 pb-0.5 no-scrollbar">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  !selectedTag
                    ? 'bg-[var(--accent)] text-white font-semibold'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {t.common.all}
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-[var(--accent)] text-white font-semibold'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-color)]/60">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-12 px-4 text-[var(--text-muted)]">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <div className="text-xs font-semibold">{t.sidebar.noNotesFound}</div>
              <p className="text-[11px] mt-1 opacity-70">{t.sidebar.createFirstNote}</p>
            </div>
          ) : (
            sortedNotes.map(note => {
              const isActive = note.id === activeNoteId;
              const formattedDate = new Date(note.updatedAt).toLocaleDateString(
                appLanguage === 'en' ? 'en-US' : 'tr-TR',
                {
                  month: 'short',
                  day: 'numeric'
                }
              );

              const totalTasks = note.todos?.length || 0;
              const doneTasks = note.todos?.filter(task => task.done)?.length || 0;

              return (
                <div
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`group relative p-3 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[var(--accent-light)] border-l-4 border-l-[var(--accent)]'
                      : 'hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  {/* Note Badges */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          note.mode === 'work'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : note.mode === 'journal'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {note.mode === 'work'
                          ? `💼 ${appLanguage === 'en' ? 'Work' : 'İş'}`
                          : note.mode === 'journal'
                          ? `📖 ${appLanguage === 'en' ? 'Daily' : 'Günlük'}`
                          : `📄 ${appLanguage === 'en' ? 'Plain' : 'Sade'}`}
                      </span>

                      <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)]">
                        {note.language === 'en' ? '🇬🇧 EN' : '🇹🇷 TR'}
                      </span>

                      {note.isLocked && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          🔒 {appLanguage === 'en' ? 'Locked' : 'Kilitli'}
                        </span>
                      )}

                      {note.mode === 'work' && note.priority && (
                        <span className={`text-[8px] font-bold px-1 py-0.5 rounded uppercase ${PRIORITY_COLORS[note.priority] || ''}`}>
                          {note.priority}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onTogglePin(note.id);
                        }}
                        className={`p-1.5 rounded hover:bg-[var(--bg-surface)] cursor-pointer ${
                          note.isPinned ? 'text-[var(--accent)] opacity-100' : 'text-[var(--text-muted)]'
                        }`}
                        title={note.isPinned ? t.sidebar.unpinned : t.sidebar.pinned}
                      >
                        <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                        className="p-1.5 rounded text-rose-500/80 sm:text-[var(--text-muted)] hover:text-rose-600 active:text-rose-600 cursor-pointer"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className={`text-xs font-bold truncate ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-main)]'}`}>
                    {note.isPinned && <Pin className="w-3 h-3 inline mr-1 fill-[var(--accent)] text-[var(--accent)]" />}
                    {note.title || t.editor.untitled}
                  </h3>

                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-0.5 leading-snug">
                    {note.isLocked
                      ? `🔒 ${appLanguage === 'en' ? 'Protected with AES-256 GCM. Unlock to view.' : 'Bu not AES-256 ile korunmaktadır. Okumak için kilidi açın.'}`
                      : note.content || (appLanguage === 'en' ? 'No content yet...' : 'İçerik yok...')}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mt-1.5">
                    <span>{formattedDate}</span>
                    {totalTasks > 0 && (
                      <span className="flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {doneTasks}/{totalTasks}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span>{sortedNotes.length} {appLanguage === 'en' ? 'Notes' : 'Not'}</span>
          <button
            onClick={onExportNotes}
            className="flex items-center gap-1 hover:text-[var(--text-main)] font-medium transition-colors cursor-pointer"
            title={t.sidebar.exportAll}
          >
            <Download className="w-3 h-3" />
            {appLanguage === 'en' ? 'Export' : 'Yedekle'}
          </button>
        </div>
      </aside>
    </>
  );
}

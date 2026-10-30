import React from 'react';
import {
  BookText,
  Briefcase,
  BookOpen,
  Lock,
  Plus,
  Settings,
  BookMarked,
  Bookmark,
  Languages,
  Maximize2,
  Minimize2,
  Menu,
  Monitor,
  Sparkles,
  Sun,
  Moon,
  Share2,
  Globe,
  HelpCircle
} from 'lucide-react';
import { getTranslation } from '../i18n/translations.js';

export const THEMES = [
  { id: 'professional', name: 'Professional', icon: '💼', desc: 'İş & Dokümanlar' },
  { id: 'journal', name: 'Journal', icon: '📖', desc: 'Günlük & Düşünceler' }
];

export default function Header({
  activeFilter,
  setActiveFilter,
  currentTheme,
  setCurrentTheme,
  isDarkMode,
  setIsDarkMode,
  onOpenSettings,
  onOpenDictionary,
  onOpenTranslation,
  onOpenSavedWords,
  savedWordsCount = 0,
  onOpenNewNoteModal,
  totalNotes = 0,
  workCount = 0,
  journalCount = 0,
  isZenMode,
  setIsZenMode,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  selectionLookupEnabled,
  setSelectionLookupEnabled,
  appLanguage = 'en',
  setAppLanguage,
  onOpenMindmap,
  onOpenHelpGuide
}) {
  const t = getTranslation(appLanguage);

  const toggleLanguage = () => {
    const nextLang = appLanguage === 'en' ? 'tr' : 'en';
    if (setAppLanguage) setAppLanguage(nextLang);
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="lg:hidden p-2 rounded-xl text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] cursor-pointer"
          title={appLanguage === 'en' ? 'Toggle Menu' : 'Menüyü Aç/Kapat'}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
          <BookText className="w-5 h-5" />
        </div>

        <div className="hidden xs:block">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base sm:text-lg tracking-tight font-heading text-[var(--text-main)]">
              {t.common.appName}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] uppercase tracking-wider">
              {t.header.taglineBadge}
            </span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] hidden md:block">
            {t.header.subtext}
          </p>
        </div>
      </div>

      {/* Center: Theme Selector Bar */}
      <div className="hidden xl:flex items-center p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs">
        <span className="text-[11px] font-bold text-[var(--text-muted)] px-2">{t.header.theme}:</span>
        {THEMES.map((themeItem) => (
          <button
            key={themeItem.id}
            onClick={() => setCurrentTheme(themeItem.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTheme === themeItem.id
                ? 'bg-[var(--bg-secondary)] text-[var(--accent)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <span>{themeItem.icon}</span>
            <span>{themeItem.id === 'professional' ? t.header.professional : t.header.journal}</span>
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mindmap / Connected Knowledge Graph Button (hidden on mobile, visible on sm+) */}
        <button
          onClick={onOpenMindmap}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:border-indigo-500/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 transition-all cursor-pointer shadow-xs"
          title={t.header.mindmapTooltip}
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          <span className="hidden md:inline">{t.header.mindmap}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </button>

        {/* Saved Vocabulary Vault (hidden on mobile, visible on sm+) */}
        <button
          onClick={onOpenSavedWords}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-xs font-semibold text-[var(--text-main)] transition-colors cursor-pointer"
          title={t.header.myWordsTooltip}
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="hidden md:inline">{t.header.myWords}</span>
          {savedWordsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
              {savedWordsCount}
            </span>
          )}
        </button>

        {/* Full-Screen / Zen Mode Toggle (hidden on small mobile) */}
        <button
          onClick={() => setIsZenMode(!isZenMode)}
          className={`hidden sm:flex p-2 rounded-xl border transition-colors cursor-pointer ${
            isZenMode
              ? 'bg-[var(--accent)] text-white border-transparent'
              : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)]'
          }`}
          title={isZenMode ? t.header.exitZenMode : t.header.enterZenMode}
        >
          {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Dark Mode 1-Click Toggle */}
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-xs font-semibold text-[var(--text-main)] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          title={isDarkMode ? t.header.switchToLight : t.header.switchToDark}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-in spin-in-180 duration-300" />
              <span className="hidden md:inline text-[11px]">{t.header.lightMode}</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-sky-400 animate-in spin-in-180 duration-300" />
              <span className="hidden md:inline text-[11px]">{t.header.darkMode}</span>
            </>
          )}
        </button>

        {/* Quick Language Toggle Button (EN / TR) */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-xs font-bold text-[var(--text-main)] transition-all cursor-pointer shadow-xs"
          title={t.header.switchLanguage}
        >
          <span className="text-xs">{appLanguage === 'en' ? '🇬🇧' : '🇹🇷'}</span>
          <span className="text-[11px] uppercase tracking-wide">{appLanguage === 'en' ? 'EN' : 'TR'}</span>
        </button>

        {/* Dictionary Browser (hidden on mobile, visible on sm+) */}
        <button
          onClick={onOpenDictionary}
          className="hidden sm:flex p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          title={t.header.dictionaryTooltip}
        >
          <BookMarked className="w-4 h-4" />
        </button>

        {/* Help & User Guide Modal Trigger (hidden on mobile, visible on md+) */}
        <button
          onClick={onOpenHelpGuide}
          className="hidden md:flex p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-sky-500/10 hover:border-sky-500 text-[var(--text-muted)] hover:text-sky-500 transition-colors cursor-pointer"
          title={appLanguage === 'en' ? 'Help & Interactive Guide' : 'Yardım & Akıllı Rehber'}
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 sm:p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          title={t.header.settingsTooltip}
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* New Note Button */}
        <button
          onClick={onOpenNewNoteModal}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold hover:opacity-90 shadow-sm transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t.header.newNote}</span>
        </button>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Editor from './components/Editor.jsx';
import DictionaryModal from './components/DictionaryModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import SavedWordsModal from './components/SavedWordsModal.jsx';
import NewNoteModal from './components/NewNoteModal.jsx';
import TranslationModal from './components/TranslationModal.jsx';
import MindmapView from './components/MindmapView.jsx';
import LanguageSetupModal from './components/LanguageSetupModal.jsx';
import HelpGuideModal from './components/HelpGuideModal.jsx';
import { DEFAULT_NOTES, getDefaultNotes, DEFAULT_NOTES_EN, DEFAULT_NOTES_TR, isDefaultNotesList, createInitialBlankNote } from './data/defaultNotes.js';
import { sound } from './services/soundService.js';
import { encryptData, decryptData } from './services/cryptoService.js';
import { getTranslation } from './i18n/translations.js';

export default function App() {
  // 0. Application Language State (100% English by Default, with Setup Selection)
  const [appLanguage, setAppLanguage] = useState(() => {
    return localStorage.getItem('lexinote_app_language') || 'en';
  });

  const [isLanguageSetupOpen, setIsLanguageSetupOpen] = useState(() => {
    return localStorage.getItem('lexinote_app_language') === null;
  });

  const t = getTranslation(appLanguage);

  // 1. Persistent Notes State (100% Localized to chosen language)
  const [notes, setNotes] = useState(() => {
    const curLang = localStorage.getItem('lexinote_app_language') || 'en';
    const notesLang = localStorage.getItem('lexinote_notes_language');
    const loadSamplePref = localStorage.getItem('lexinote_load_sample_notes');
    try {
      const saved = localStorage.getItem('lexinote_notes_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If notes are default notes and language doesn't match active language, auto-sync to active language
          if (isDefaultNotesList(parsed) && notesLang !== curLang && loadSamplePref !== 'false') {
            const fresh = getDefaultNotes(curLang);
            localStorage.setItem('lexinote_notes_v4', JSON.stringify(fresh));
            localStorage.setItem('lexinote_notes_language', curLang);
            return fresh;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load notes from localStorage', e);
    }
    if (loadSamplePref === 'false') {
      const blank = [createInitialBlankNote(curLang)];
      localStorage.setItem('lexinote_notes_v4', JSON.stringify(blank));
      localStorage.setItem('lexinote_notes_language', curLang);
      return blank;
    }
    const fresh = getDefaultNotes(curLang);
    localStorage.setItem('lexinote_notes_language', curLang);
    return fresh;
  });

  // 2. Active Note ID
  const [activeNoteId, setActiveNoteId] = useState(() => {
    return notes[0]?.id || null;
  });

  // 3. Theme State (Strictly Professional & Journal)
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('lexinote_theme');
    if (saved === 'professional' || saved === 'journal') return saved;
    return 'professional';
  });

  // 3.1 Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('lexinote_dark_mode');
    if (saved !== null) return saved === 'true';
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // 4. Filter & Search State
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  // 5. Settings & Feature Toggles
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(() => {
    return localStorage.getItem('lexinote_spellcheck_enabled') !== 'false';
  });

  const [autoCorrectMode, setAutoCorrectMode] = useState(() => {
    return localStorage.getItem('lexinote_autocorrect_mode') || 'instant';
  });

  const [selectionLookupEnabled, setSelectionLookupEnabled] = useState(() => {
    return localStorage.getItem('lexinote_selection_lookup') !== 'false';
  });

  const [soundEffects, setSoundEffects] = useState(() => {
    return localStorage.getItem('lexinote_sound') !== 'false';
  });

  const [targetTranslationLang, setTargetTranslationLang] = useState(() => {
    return localStorage.getItem('lexinote_target_lang') || 'tr';
  });

  const [customWords, setCustomWords] = useState(() => {
    try {
      const saved = localStorage.getItem('lexinote_custom_words');
      return saved ? JSON.parse(saved) : ['LexiNote', 'SaaS', 'API'];
    } catch {
      return ['LexiNote', 'SaaS', 'API'];
    }
  });

  // 6. Saved Vocabulary Vault
  const [savedWords, setSavedWords] = useState(() => {
    try {
      const saved = localStorage.getItem('lexinote_saved_words');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "w1",
        word: "abroad",
        translation: "yurt dışı / yurt dışında",
        pos: "adverb",
        cefr: "B1",
        ipa: "/əˈbrɔːd/",
        source: "Cambridge Academic",
        lang: "en",
        savedAt: new Date().toISOString()
      },
      {
        id: "w2",
        word: "gratitude",
        translation: "şükran / minnettarlık",
        pos: "noun",
        cefr: "C1",
        ipa: "/ˈɡrætɪtjuːd/",
        source: "Oxford Advanced",
        lang: "en",
        savedAt: new Date().toISOString()
      }
    ];
  });

  // 7. UI Layout Modes
  const [isZenMode, setIsZenMode] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewportMode, setViewportMode] = useState('desktop');

  // 8. Modals
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavedWordsOpen, setIsSavedWordsOpen] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isTranslationOpen, setIsTranslationOpen] = useState(false);
  const [isMindmapOpen, setIsMindmapOpen] = useState(false);
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState(false);

  // Apply Theme & Dark Mode
  useEffect(() => {
    document.documentElement.className = `theme-${currentTheme} ${isDarkMode ? 'dark' : ''}`;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('lexinote_theme', currentTheme);
    localStorage.setItem('lexinote_dark_mode', isDarkMode ? 'true' : 'false');
  }, [currentTheme, isDarkMode]);

  // Persist Language
  useEffect(() => {
    localStorage.setItem('lexinote_app_language', appLanguage);
  }, [appLanguage]);

  // Set Application Language and auto-sync starter notes if default
  const handleSetAppLanguage = (newLang, forceReloadNotes = false) => {
    setAppLanguage(newLang);
    localStorage.setItem('lexinote_app_language', newLang);
    if (forceReloadNotes || isDefaultNotesList(notes)) {
      const fresh = getDefaultNotes(newLang);
      setNotes(fresh);
      setActiveNoteId(fresh[0]?.id || null);
      localStorage.setItem('lexinote_notes_v4', JSON.stringify(fresh));
      localStorage.setItem('lexinote_notes_language', newLang);
    }
  };

  // Explicitly Reload Starter Notes in Current Active Language
  const handleReloadStarterNotes = () => {
    const fresh = getDefaultNotes(appLanguage);
    setNotes(fresh);
    setActiveNoteId(fresh[0]?.id || null);
    localStorage.setItem('lexinote_notes_v4', JSON.stringify(fresh));
    localStorage.setItem('lexinote_notes_language', appLanguage);
    sound.playPop();
  };

  // Persist Notes
  useEffect(() => {
    try {
      localStorage.setItem('lexinote_notes_v4', JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('lexinote_spellcheck_enabled', spellCheckEnabled ? 'true' : 'false');
  }, [spellCheckEnabled]);

  useEffect(() => {
    localStorage.setItem('lexinote_autocorrect_mode', autoCorrectMode);
  }, [autoCorrectMode]);

  useEffect(() => {
    localStorage.setItem('lexinote_selection_lookup', selectionLookupEnabled ? 'true' : 'false');
  }, [selectionLookupEnabled]);

  useEffect(() => {
    localStorage.setItem('lexinote_sound', soundEffects ? 'true' : 'false');
    sound.enabled = soundEffects;
  }, [soundEffects]);

  useEffect(() => {
    localStorage.setItem('lexinote_target_lang', targetTranslationLang);
  }, [targetTranslationLang]);

  useEffect(() => {
    localStorage.setItem('lexinote_custom_words', JSON.stringify(customWords));
  }, [customWords]);

  useEffect(() => {
    localStorage.setItem('lexinote_saved_words', JSON.stringify(savedWords));
  }, [savedWords]);

  // Active note
  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  // Note Handlers
  const handleSelectNote = (id) => {
    setActiveNoteId(id);
  };

  const handleNewNote = (mode = 'plain') => {
    const isWork = mode === 'work';
    const isJournal = mode === 'journal';
    const isEn = appLanguage === 'en';

    const newNote = {
      id: `note-${Date.now()}`,
      mode,
      title: isWork
        ? (isEn ? 'New Project Deliverable' : 'Yeni İş & Proje Notu')
        : isJournal
        ? (isEn ? 'New Daily Reflection' : 'Yeni Günlük & Kişisel Not')
        : (isEn ? 'Untitled Document' : 'Yeni Sade Not'),
      language: isEn ? 'en' : 'tr',
      content: isWork
        ? (isEn ? 'Draft key business deliverables, meeting notes, or execution strategy here...' : 'Buraya iş hedeflerinizi, toplantı maddelerini veya stratejilerinizi yazabilirsiniz.')
        : isJournal
        ? (isEn ? 'Reflect on your day, thoughts, and lessons learned freely...' : 'Günün hislerini ve düşüncelerini buraya serbestçe aktarın...')
        : '',
      priority: isWork ? 'medium' : undefined,
      status: isWork ? 'draft' : undefined,
      dueDate: '',
      tags: isWork
        ? (isEn ? ['Project'] : ['İş'])
        : isJournal
        ? (isEn ? ['Daily'] : ['Günlük'])
        : (isEn ? ['Ideas'] : ['Genel']),
      isPinned: false,
      isLocked: false,
      encryptedData: null,
      todos: isWork ? [{ id: `todo-${Date.now()}`, text: isEn ? 'Initial deliverable item' : 'İlk görev maddesi', done: false }] : [],
      mood: isJournal ? 'calm' : undefined,
      weather: isJournal ? 'sunny' : undefined,
      dailyPrompt: isJournal ? (isEn ? 'What was the most valuable lesson I discovered or realized today?' : 'Bugün öğrendiğim veya farkına vardığım en değerli ders neydi?') : undefined,
      gratitude: isJournal ? [isEn ? 'Starting a new day with peace and clarity' : 'Yeni bir güne huzurla başlamak'] : undefined,
      showJournalPrompts: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(n => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const handleDeleteNote = (noteId) => {
    const confirmMsg = t.editor?.deleteConfirm || t.sidebar?.deleteConfirm || 'Are you sure you want to delete this note?';
    if (confirm(confirmMsg)) {
      let remaining = notes.filter(n => n.id !== noteId);
      // If user deleted the last note, automatically generate a clean blank note so app is never in a dead state
      if (remaining.length === 0) {
        const fresh = createInitialBlankNote(appLanguage);
        remaining = [fresh];
      }
      setNotes(remaining);
      if (activeNoteId === noteId || !remaining.some(n => n.id === activeNoteId)) {
        setActiveNoteId(remaining[0]?.id || null);
      }
      sound.playPop();
    }
  };

  const handleClearAllStarterNotes = () => {
    const confirmMsg = t.settings?.clearStarterNotesConfirm || (appLanguage === 'en' ? 'Remove all starter notes and open a clean blank note?' : 'Tüm örnek notları silip temiz ve boş bir sayfayla başlamak istiyor musunuz?');
    if (confirm(confirmMsg)) {
      const blank = [createInitialBlankNote(appLanguage)];
      setNotes(blank);
      setActiveNoteId(blank[0].id);
      localStorage.setItem('lexinote_notes_v4', JSON.stringify(blank));
      localStorage.setItem('lexinote_load_sample_notes', 'false');
      sound.playPop();
    }
  };

  const handleTogglePin = (noteId) => {
    setNotes(
      notes.map(n =>
        n.id === noteId ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n
      )
    );
  };

  const handleLockNote = async (noteId, pin) => {
    const target = notes.find(n => n.id === noteId);
    if (!target) return;

    const effectivePin = pin || target._activePin || '1234';
    const payload = {
      content: target.content || '',
      todos: target.todos || [],
      gratitude: target.gratitude || []
    };

    try {
      const encryptedData = await encryptData(payload, effectivePin);
      setNotes(
        notes.map(n => {
          if (n.id === noteId) {
            return {
              ...n,
              isLocked: true,
              _tempUnlocked: false,
              _activePin: undefined,
              pinCode: undefined,
              encryptedData,
              content: '',
              todos: [],
              gratitude: [],
              updatedAt: new Date().toISOString()
            };
          }
          return n;
        })
      );
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  const handleUnlockNote = async (noteId, pin) => {
    const target = notes.find(n => n.id === noteId);
    if (!target) throw new Error(t.common.error);

    if (!target.encryptedData) {
      setNotes(
        notes.map(n => (n.id === noteId ? { ...n, _tempUnlocked: true } : n))
      );
      return true;
    }

    try {
      const decrypted = await decryptData(target.encryptedData, pin);
      setNotes(
        notes.map(n => {
          if (n.id === noteId) {
            return {
              ...n,
              _tempUnlocked: true,
              _activePin: pin,
              content: decrypted.content ?? n.content,
              todos: decrypted.todos ?? n.todos,
              gratitude: decrypted.gratitude ?? n.gratitude
            };
          }
          return n;
        })
      );
      return true;
    } catch (err) {
      throw err;
    }
  };

  // Custom Word Handlers
  const handleAddCustomWord = (word) => {
    if (!customWords.includes(word)) {
      setCustomWords([...customWords, word]);
    }
  };

  const handleRemoveCustomWord = (word) => {
    setCustomWords(customWords.filter(w => w !== word));
  };

  // Saved Words Handlers
  const handleSaveWord = (wordObj) => {
    if (!savedWords.some(w => w.word.toLowerCase() === wordObj.word.toLowerCase())) {
      setSavedWords([wordObj, ...savedWords]);
    }
  };

  const handleRemoveSavedWord = (identifier) => {
    setSavedWords(savedWords.filter(w => (w.id || w.word) !== identifier));
  };

  // Export Notes
  const handleExportNotes = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lexinote-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (confirm(t.settings.resetConfirm)) {
      setNotes(DEFAULT_NOTES);
      setActiveNoteId(DEFAULT_NOTES[0].id);
      setIsSettingsOpen(false);
    }
  };

  const workCount = notes.filter(n => n.mode === 'work').length;
  const journalCount = notes.filter(n => n.mode === 'journal').length;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors">
      {/* Header */}
      <Header
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        onOpenTranslation={() => setIsTranslationOpen(true)}
        onOpenSavedWords={() => setIsSavedWordsOpen(true)}
        savedWordsCount={savedWords.length}
        onOpenNewNoteModal={() => setIsNewNoteModalOpen(true)}
        totalNotes={notes.length}
        workCount={workCount}
        journalCount={journalCount}
        isZenMode={isZenMode}
        setIsZenMode={setIsZenMode}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        selectionLookupEnabled={selectionLookupEnabled}
        setSelectionLookupEnabled={setSelectionLookupEnabled}
        viewportMode={viewportMode}
        setViewportMode={setViewportMode}
        appLanguage={appLanguage}
        setAppLanguage={handleSetAppLanguage}
        onOpenMindmap={() => setIsMindmapOpen(true)}
        onOpenHelpGuide={() => setIsHelpGuideOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar (Hidden when Zen Mode is enabled) */}
        {!isZenMode && (
          <Sidebar
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={handleSelectNote}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            onExportNotes={handleExportNotes}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            appLanguage={appLanguage}
          />
        )}

        {/* Note Editor Area */}
        {activeNote ? (
          <Editor
            key={activeNote.id}
            note={activeNote}
            allNotes={notes}
            onSelectNote={handleSelectNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onLockNote={handleLockNote}
            onUnlockNote={handleUnlockNote}
            spellCheckEnabled={spellCheckEnabled}
            autoCorrectMode={autoCorrectMode}
            selectionLookupEnabled={selectionLookupEnabled}
            targetTranslationLang={targetTranslationLang}
            customWords={customWords}
            savedWords={savedWords}
            onSaveWord={handleSaveWord}
            isZenMode={isZenMode}
            setIsZenMode={setIsZenMode}
            appLanguage={appLanguage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[var(--text-muted)]">
            <p className="text-sm">{t.sidebar.noNotesFound}</p>
            <button
              onClick={() => handleNewNote('work')}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent)] text-white hover:opacity-90 cursor-pointer"
            >
              {t.header.newNote}
            </button>
          </div>
        )}
      </div>

      {/* Connected Mindmap & Knowledge Graph Modal */}
      <MindmapView
        isOpen={isMindmapOpen}
        onClose={() => setIsMindmapOpen(false)}
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={handleSelectNote}
        appLanguage={appLanguage}
        onOpenHelpGuide={() => setIsHelpGuideOpen(true)}
      />

      {/* Interactive Help & Smart Guide Modal */}
      <HelpGuideModal
        isOpen={isHelpGuideOpen}
        onClose={() => setIsHelpGuideOpen(false)}
        appLanguage={appLanguage}
      />

      {/* First-Launch Language Setup Modal */}
      <LanguageSetupModal
        isOpen={isLanguageSetupOpen}
        onSelectLanguage={(lang, loadSampleNotes = true) => {
          setAppLanguage(lang);
          localStorage.setItem('lexinote_app_language', lang);
          localStorage.setItem('lexinote_load_sample_notes', loadSampleNotes ? 'true' : 'false');
          const langNotes = loadSampleNotes ? getDefaultNotes(lang) : [createInitialBlankNote(lang)];
          setNotes(langNotes);
          setActiveNoteId(langNotes[0]?.id || null);
          localStorage.setItem('lexinote_notes_v4', JSON.stringify(langNotes));
          localStorage.setItem('lexinote_notes_language', lang);
          setIsLanguageSetupOpen(false);
        }}
      />

      {/* New Note Type Selection Modal */}
      <NewNoteModal
        isOpen={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
        onCreateNote={handleNewNote}
        appLanguage={appLanguage}
      />

      {/* Dictionary Modal */}
      <DictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        customWords={customWords}
        onAddCustomWord={handleAddCustomWord}
        onRemoveCustomWord={handleRemoveCustomWord}
      />

      {/* Saved Words / Flashcard Vault Modal */}
      <SavedWordsModal
        isOpen={isSavedWordsOpen}
        onClose={() => setIsSavedWordsOpen(false)}
        savedWords={savedWords}
        onRemoveWord={handleRemoveSavedWord}
        onAddWord={handleSaveWord}
      />

      {/* Offline Translation & Sentence Modal (Temporarily disabled as requested; preserved for future use) */}
      {false && isTranslationOpen && (
        <TranslationModal
          isOpen={isTranslationOpen}
          onClose={() => setIsTranslationOpen(false)}
          onInsertToNote={(text) => {
            if (!activeNote) return;
            const current = activeNote.content || '';
            handleUpdateNote({
              ...activeNote,
              content: current ? `${current}\n\n${text}` : text,
              updatedAt: new Date().toISOString()
            });
          }}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        spellCheckEnabled={spellCheckEnabled}
        setSpellCheckEnabled={setSpellCheckEnabled}
        autoCorrectMode={autoCorrectMode}
        setAutoCorrectMode={setAutoCorrectMode}
        selectionLookupEnabled={selectionLookupEnabled}
        setSelectionLookupEnabled={setSelectionLookupEnabled}
        soundEffects={soundEffects}
        setSoundEffects={setSoundEffects}
        targetTranslationLang={targetTranslationLang}
        setTargetTranslationLang={setTargetTranslationLang}
        onExportNotes={handleExportNotes}
        onResetDefaults={handleResetDefaults}
        onReloadStarterNotes={handleReloadStarterNotes}
        onClearAllStarterNotes={handleClearAllStarterNotes}
        appLanguage={appLanguage}
        setAppLanguage={handleSetAppLanguage}
      />
    </div>
  );
}

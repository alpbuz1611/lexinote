import React, { useState, useRef, useEffect } from 'react';
import {
  Briefcase,
  BookOpen,
  Lock,
  Unlock,
  CheckCircle,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Zap,
  Globe,
  Smile,
  CloudSun,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  CheckCheck,
  Check,
  X,
  Maximize2,
  Minimize2,
  Languages,
  BookMarked,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Link,
  Code,
  Undo2,
  Redo2,
  Eye,
  Edit3,
  Columns2,
  Share2,
  Type
} from 'lucide-react';
import { extractWordAndPunctuation, getAutoCorrection, checkWord } from '../services/spellcheckService.js';
import { sound } from '../services/soundService.js';
import SelectionPopup from './SelectionPopup.jsx';
import BatchSpellcheckModal from './BatchSpellcheckModal.jsx';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import { getTranslation } from '../i18n/translations.js';

const JOURNAL_PROMPTS_EN = [
  "What was the most valuable lesson I discovered or realized today?",
  "What was the warmest moment that brought a smile to my face today?",
  "How did I show kindness or self-compassion when facing a challenge?",
  "What am I genuinely looking forward to diving into tomorrow?",
  "Which cluttered thoughts can I gently release and let go of right now?"
];

const JOURNAL_PROMPTS_TR = [
  "Bugün öğrendiğim veya farkına vardığım en değerli ders neydi?",
  "Bugün beni en çok gülümseten ya da içimi ısıtan an hangisiydi?",
  "Zorlandığım bir anda kendime nasıl şefkat gösterdim?",
  "Yarın için sabırsızlandığım ya da odaklanmak istediğim bir konu var mı?",
  "Şu anda beni meşgul eden düşüncelerden hangisini serbest bırakabilirim?"
];

export default function Editor({
  note,
  allNotes = [],
  onSelectNote = () => {},
  onUpdateNote,
  onDeleteNote = () => {},
  onLockNote,
  onUnlockNote,
  spellCheckEnabled = true,
  autoCorrectMode = 'instant', // 'instant' | 'on_finish' | 'off'
  selectionLookupEnabled = true,
  targetTranslationLang = 'tr',
  customWords = [],
  savedWords = [],
  onSaveWord,
  isZenMode,
  setIsZenMode,
  appLanguage = 'en'
}) {
  const t = getTranslation(appLanguage);
  const JOURNAL_PROMPTS = appLanguage === 'en' ? JOURNAL_PROMPTS_EN : JOURNAL_PROMPTS_TR;
  const [selectionInfo, setSelectionInfo] = useState(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchNotice, setBatchNotice] = useState('');
  const [newTodoText, setNewTodoText] = useState('');
  const [newGratitudeText, setNewGratitudeText] = useState('');
  const [unlockPin, setUnlockPin] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showLockSetup, setShowLockSetup] = useState(false);
  const [setupPin, setSetupPin] = useState('');
  const [newTagInput, setNewTagInput] = useState('');

  // Rich Text Editor Toolbar States
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('lexinote_editor_view') || 'edit'; // 'edit' | 'preview' | 'split'
  });

  const [editorFont, setEditorFont] = useState(() => {
    return localStorage.getItem('lexinote_editor_font') || (note.mode === 'journal' ? 'Noto Serif' : 'Noto Sans');
  });

  const [editorFontSize, setEditorFontSize] = useState(() => {
    return localStorage.getItem('lexinote_editor_size') || '20px';
  });

  const [showWikiPicker, setShowWikiPicker] = useState(false);
  const [showBacklinksPanel, setShowBacklinksPanel] = useState(true);

  const textareaRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Undo / Redo history stack and reactive UI states
  const historyRef = useRef([note.content || '']);
  const historyIdxRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Synchronize history when switching notes
  useEffect(() => {
    historyRef.current = [note.content || ''];
    historyIdxRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
    clearTimeout(typingTimerRef.current);
  }, [note.id]);

  // Persist font & view preferences
  useEffect(() => {
    localStorage.setItem('lexinote_editor_view', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('lexinote_editor_font', editorFont);
  }, [editorFont]);

  useEffect(() => {
    localStorage.setItem('lexinote_editor_size', editorFontSize);
  }, [editorFontSize]);

  // If note is locked and encrypted, show genuine AES-256 GCM lock screen
  if (note.isLocked && !note._tempUnlocked) {
    return (
      <main className="flex-1 flex items-center justify-center p-6 bg-[var(--bg-primary)]">
        <div className="max-w-md w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 mx-auto flex items-center justify-center mb-4 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-1">
            Bu Not Şifrelenmiştir
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-6 leading-relaxed">
            Hassas iş ve kişisel verileriniz yerel cihazınızda <strong>PBKDF2 & AES-256 GCM</strong> şifreleme ile saklanmaktadır. Verileriniz hiçbir sunucuya aktarılmaz ve PIN olmadan çözülemez.
            {note.id === 'note-locked-demo' && (
              <span className="block mt-1.5 font-semibold text-[var(--accent)]">
                (Varsayılan Demo PIN: 1234)
              </span>
            )}
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!unlockPin) return;
              setIsDecrypting(true);
              setUnlockError('');
              try {
                await onUnlockNote(note.id, unlockPin);
                sound.playUnlock();
                setUnlockPin('');
              } catch (err) {
                setUnlockError(err.message || 'Hatalı PIN kodu! Lütfen tekrar deneyin.');
              } finally {
                setIsDecrypting(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <input
                type="password"
                maxLength={8}
                value={unlockPin}
                onChange={e => {
                  setUnlockPin(e.target.value);
                  setUnlockError('');
                }}
                placeholder="PIN Kodunu Girin"
                autoFocus
                disabled={isDecrypting}
                className="w-full text-center tracking-widest text-lg font-bold px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              {unlockError && (
                <div className="text-xs text-rose-500 font-medium mt-1.5 flex items-center justify-center gap-1 animate-in fade-in">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {unlockError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isDecrypting || !unlockPin}
              className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              {isDecrypting ? 'Şifre Çözülüyor (AES-256)...' : 'Notun Kilidini Aç'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Push a distinct state into the Undo/Redo stack and update reactive controls
  const pushHistorySnapshot = (newText) => {
    const nextStack = historyRef.current.slice(0, historyIdxRef.current + 1);
    if (nextStack[nextStack.length - 1] !== newText) {
      nextStack.push(newText);
      if (nextStack.length > 60) nextStack.shift();
      historyRef.current = nextStack;
      historyIdxRef.current = nextStack.length - 1;
      setCanUndo(historyIdxRef.current > 0);
      setCanRedo(false);
    }
  };

  // Commit text with Undo/Redo stack tracking
  const commitContent = (newText, cursorPos = null, isLiveTyping = false) => {
    if (!isLiveTyping) {
      pushHistorySnapshot(newText);
    }

    onUpdateNote({
      ...note,
      content: newText,
      updatedAt: new Date().toISOString()
    });

    if (cursorPos !== null) {
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(cursorPos, cursorPos);
        }
      }, 0);
    }
  };

  // Undo / Redo Actions
  const handleUndo = () => {
    if (historyIdxRef.current > 0) {
      historyIdxRef.current -= 1;
      const prev = historyRef.current[historyIdxRef.current];
      setCanUndo(historyIdxRef.current > 0);
      setCanRedo(true);
      onUpdateNote({ ...note, content: prev, updatedAt: new Date().toISOString() });
      sound.playPop();
    }
  };

  const handleRedo = () => {
    if (historyIdxRef.current < historyRef.current.length - 1) {
      historyIdxRef.current += 1;
      const next = historyRef.current[historyIdxRef.current];
      setCanUndo(true);
      setCanRedo(historyIdxRef.current < historyRef.current.length - 1);
      onUpdateNote({ ...note, content: next, updatedAt: new Date().toISOString() });
      sound.playPop();
    }
  };

  // Apply Rich Text Markdown Formats
  const applyFormat = (formatType, options = {}) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const oldText = note.content || '';
    const selected = oldText.substring(start, end);

    let replacement = '';
    let newCursorPos = start;

    switch (formatType) {
      case 'bold':
        replacement = `**${selected || 'kalın metin'}**`;
        newCursorPos = selected ? start + replacement.length : start + 2;
        break;
      case 'italic':
        replacement = `*${selected || 'italik metin'}*`;
        newCursorPos = selected ? start + replacement.length : start + 1;
        break;
      case 'underline':
        replacement = `<u>${selected || 'altı çizili'}</u>`;
        newCursorPos = selected ? start + replacement.length : start + 3;
        break;
      case 'strikethrough':
        replacement = `~~${selected || 'üstü çizili'}~~`;
        newCursorPos = selected ? start + replacement.length : start + 2;
        break;
      case 'highlight':
        replacement = `==${selected || 'vurgulanan metin'}==`;
        newCursorPos = selected ? start + replacement.length : start + 2;
        break;
      case 'inline-code':
        replacement = `\`${selected || 'kod'}\``;
        newCursorPos = selected ? start + replacement.length : start + 1;
        break;
      case 'code-block':
        replacement = `\n\`\`\`javascript\n${selected || '// Kodunuzu buraya yazın'}\n\`\`\`\n`;
        newCursorPos = start + replacement.length;
        break;
      case 'quote': {
        const lineStartQ = oldText.lastIndexOf('\n', start - 1) + 1;
        const lineEndQ = oldText.indexOf('\n', end);
        const effectiveEndQ = lineEndQ === -1 ? oldText.length : lineEndQ;
        const targetLinesQ = oldText.substring(lineStartQ, effectiveEndQ).split('\n');
        const quoted = targetLinesQ.map(l => (l.startsWith('> ') ? l.slice(2) : `> ${l}`)).join('\n');
        const updatedQ = oldText.substring(0, lineStartQ) + quoted + oldText.substring(effectiveEndQ);
        commitContent(updatedQ, lineStartQ + quoted.length);
        return;
      }
      case 'h1':
      case 'h2':
      case 'h3':
      case 'paragraph': {
        const lineStart = oldText.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = oldText.indexOf('\n', end);
        const effectiveEnd = lineEnd === -1 ? oldText.length : lineEnd;
        const currentLine = oldText.substring(lineStart, effectiveEnd);
        const cleanLine = currentLine.replace(/^#{1,6}\s+/, '');
        let prefix = '';
        if (formatType === 'h1') prefix = '# ';
        else if (formatType === 'h2') prefix = '## ';
        else if (formatType === 'h3') prefix = '### ';
        const newLine = prefix + cleanLine;
        const updatedH = oldText.substring(0, lineStart) + newLine + oldText.substring(effectiveEnd);
        commitContent(updatedH, lineStart + newLine.length);
        return;
      }
      case 'bullet-list':
      case 'number-list':
      case 'task-list': {
        const lineStart = oldText.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = oldText.indexOf('\n', end);
        const effectiveEnd = lineEnd === -1 ? oldText.length : lineEnd;
        const lines = oldText.substring(lineStart, effectiveEnd).split('\n');
        const formatted = lines.map((l, i) => {
          const clean = l.replace(/^([-*]|\d+\.|\-\s+\[[ xX]\])\s+/, '');
          if (formatType === 'bullet-list') return `- ${clean}`;
          if (formatType === 'number-list') return `${i + 1}. ${clean}`;
          return `- [ ] ${clean}`;
        }).join('\n');
        const updatedL = oldText.substring(0, lineStart) + formatted + oldText.substring(effectiveEnd);
        commitContent(updatedL, lineStart + formatted.length);
        return;
      }
      case 'link':
        replacement = `[${selected || 'bağlantı metni'}](https://)`;
        newCursorPos = selected ? start + replacement.length : start + 1;
        break;
      case 'wikilink':
        replacement = `[[${options.title || selected || 'Not Başlığı'}]]`;
        newCursorPos = start + replacement.length;
        break;
      default:
        return;
    }

    const newText = oldText.substring(0, start) + replacement + oldText.substring(end);
    commitContent(newText, newCursorPos);
  };

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+B, Ctrl+I, Ctrl+U)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        handleRedo();
      } else {
        handleUndo();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      handleRedo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      applyFormat('bold');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      applyFormat('italic');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      applyFormat('underline');
    }
  };

  // Toggle Markdown Interactive Checkbox Line
  const handleToggleTaskLine = (lineIndex) => {
    const lines = (note.content || '').split('\n');
    if (lines[lineIndex] !== undefined) {
      if (lines[lineIndex].includes('- [ ]')) {
        lines[lineIndex] = lines[lineIndex].replace('- [ ]', '- [x]');
      } else if (lines[lineIndex].includes('- [x]')) {
        lines[lineIndex] = lines[lineIndex].replace('- [x]', '- [ ]');
      } else if (lines[lineIndex].includes('- [X]')) {
        lines[lineIndex] = lines[lineIndex].replace('- [X]', '- [ ]');
      }
      commitContent(lines.join('\n'));
    }
  };

  // Handle live typing & Autocorrect with smart Undo history snapshotting
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    const selectionEnd = e.target.selectionEnd;
    const oldContent = note.content || '';

    const isBigChange = Math.abs(newContent.length - oldContent.length) > 1;
    const prevChar = newContent[selectionEnd - 1];
    const isSeparator = /[\s.,!?;:]/.test(prevChar);

    if (spellCheckEnabled && autoCorrectMode === 'instant' && isSeparator && selectionEnd > 1) {
      const textBeforeCursor = newContent.slice(0, selectionEnd - 1);
      const words = textBeforeCursor.split(/[\s\n.,!?;:]+/);
      const lastWord = words[words.length - 1];

      if (lastWord && lastWord.length >= 3) {
        const { word: cleanWord } = extractWordAndPunctuation(lastWord);
        const corrected = getAutoCorrection(cleanWord, note.language || 'en', customWords);

        if (corrected && corrected.toLowerCase() !== cleanWord.toLowerCase()) {
          const wordStartIndex = selectionEnd - 1 - lastWord.length;
          const updatedContent =
            newContent.slice(0, wordStartIndex) +
            corrected +
            newContent.slice(wordStartIndex + lastWord.length);

          const newCursorPos = wordStartIndex + corrected.length + 1;
          commitContent(updatedContent, newCursorPos, false);
          return;
        }
      }
    }

    // Update note content immediately for 100% fluid typing responsiveness
    onUpdateNote({
      ...note,
      content: newContent,
      updatedAt: new Date().toISOString()
    });

    // If large change (bulk paste, deletion of text) or word boundary, capture snapshot immediately
    if (isBigChange || isSeparator) {
      clearTimeout(typingTimerRef.current);
      pushHistorySnapshot(newContent);
    } else {
      // Debounce continuous character typing
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        pushHistorySnapshot(newContent);
      }, 500);
    }
  };

  // Selection detection for Translation Popup (ONLY if selectionLookupEnabled is true)
  const handleSelect = (e) => {
    if (!selectionLookupEnabled) {
      setSelectionInfo(null);
      return;
    }

    const textarea = e.target || textareaRef.current;
    if (!textarea) return;

    let text = '';
    if (typeof textarea.selectionStart === 'number' && typeof textarea.selectionEnd === 'number') {
      text = (textarea.value || '').substring(textarea.selectionStart, textarea.selectionEnd).trim();
    }
    if (!text && typeof window !== 'undefined') {
      text = window.getSelection().toString().trim();
    }

    if (text && text.length > 0 && text.length <= 400) {
      const rect = textarea.getBoundingClientRect();
      let x = rect.left + 24;
      let y = rect.top + 60;

      if (typeof window !== 'undefined' && window.getSelection) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          try {
            const range = selection.getRangeAt(0);
            const rangeRect = range.getBoundingClientRect();
            if (rangeRect.width > 0 && rangeRect.left > 0) {
              x = rangeRect.left;
              y = rangeRect.bottom + 8;
            }
          } catch (_) {}
        }
      }

      setSelectionInfo({
        text,
        coords: { x, y }
      });
    }
  };

  // Replace selected text in content with translation
  const handleReplaceSelection = (replacement) => {
    if (!selectionInfo || !textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const currentText = note.content || '';
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);
    commitContent(newText, start + replacement.length);
    setSelectionInfo(null);
  };

  // Apply batch spellcheck fixes
  const handleBatchFixes = (updatedText, count) => {
    commitContent(updatedText);
    setBatchNotice(appLanguage === 'en' ? `${count} spelling errors corrected!` : `${count} yazım hatası düzeltildi!`);
    setTimeout(() => setBatchNotice(''), 3500);
  };

  // Custom User Tags Handlers
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = newTagInput.trim().replace(/^#/, '');
      if (clean && !(note.tags || []).includes(clean)) {
        onUpdateNote({
          ...note,
          tags: [...(note.tags || []), clean],
          updatedAt: new Date().toISOString()
        });
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onUpdateNote({
      ...note,
      tags: (note.tags || []).filter(t => t !== tagToRemove),
      updatedAt: new Date().toISOString()
    });
  };

  // Work Mode: Task List Handlers
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const newTodo = {
      id: `todo-${Date.now()}`,
      text: newTodoText.trim(),
      done: false
    };
    onUpdateNote({
      ...note,
      todos: [...(note.todos || []), newTodo],
      updatedAt: new Date().toISOString()
    });
    setNewTodoText('');
  };

  const handleToggleTodo = (todoId) => {
    const updated = (note.todos || []).map(t =>
      t.id === todoId ? { ...t, done: !t.done } : t
    );
    onUpdateNote({
      ...note,
      todos: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteTodo = (todoId) => {
    const updated = (note.todos || []).map(t => t).filter(t => t.id !== todoId);
    onUpdateNote({
      ...note,
      todos: updated,
      updatedAt: new Date().toISOString()
    });
  };

  // Journal Mode: Gratitude Handlers
  const handleAddGratitude = (e) => {
    e.preventDefault();
    if (!newGratitudeText.trim()) return;
    onUpdateNote({
      ...note,
      gratitude: [...(note.gratitude || []), newGratitudeText.trim()],
      updatedAt: new Date().toISOString()
    });
    setNewGratitudeText('');
  };

  const handleDeleteGratitude = (index) => {
    const list = [...(note.gratitude || [])];
    list.splice(index, 1);
    onUpdateNote({
      ...note,
      gratitude: list,
      updatedAt: new Date().toISOString()
    });
  };

  // Lock note handler with real AES-256 encryption
  const handleLockSetupSubmit = async (e) => {
    e.preventDefault();
    if (!setupPin || setupPin.length < 4) return;
    sound.playLock();
    await onLockNote(note.id, setupPin);
    setShowLockSetup(false);
    setSetupPin('');
  };

  const isCurrentSelectionSaved = savedWords.some(
    w => w.word.toLowerCase() === (selectionInfo?.text || '').toLowerCase()
  );

  // Bidirectional Wiki-Links Calculation
  const outgoingWikiMatches = Array.from(new Set(
    Array.from((note.content || '').matchAll(/\[\[(.*?)\]\]/g)).map(m => m[1].trim()).filter(Boolean)
  ));

  const noteTitleLower = (note.title || '').trim().toLowerCase();
  const backlinks = allNotes.filter(other => {
    if (other.id === note.id || !other.content || !noteTitleLower) return false;
    const matches = Array.from(other.content.matchAll(/\[\[(.*?)\]\]/g));
    return matches.some(m => m[1].trim().toLowerCase() === noteTitleLower);
  });

  // Stats calculation
  const wordsCount = (note.content || '').trim().split(/\s+/).filter(Boolean).length;
  const charsCount = (note.content || '').length;
  const readingTime = Math.max(1, Math.ceil(wordsCount / 200));

  // Resolved font-family CSS using embedded offline fonts + system fallbacks
  const resolvedFontFamily =
    editorFont === 'Noto Serif'
      ? "'Noto Serif', 'Lora', Georgia, 'Times New Roman', serif"
      : editorFont === 'Lora'
      ? "'Lora', 'Noto Serif', Georgia, 'Times New Roman', serif"
      : editorFont === 'DejaVu Mono'
      ? "'DejaVu Mono', 'Fira Code', 'Courier New', monospace"
      : editorFont === 'Fira Code'
      ? "'Fira Code', 'DejaVu Mono', 'Courier New', monospace"
      : editorFont === 'Inter'
      ? "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      : "'Noto Sans', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  return (
    <main
      className={`flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[var(--bg-primary)] transition-all relative ${
        isZenMode ? 'p-2 sm:p-4' : ''
      }`}
    >
      {/* Selection Translation Popup (Disabled completely when selectionLookupEnabled is false) */}
      {selectionLookupEnabled && selectionInfo && (
        <SelectionPopup
          selectedText={selectionInfo.text}
          coords={selectionInfo.coords}
          sourceLang={note.language || 'en'}
          targetLang={targetTranslationLang}
          onClose={() => setSelectionInfo(null)}
          onReplaceText={handleReplaceSelection}
          onAppendText={trans => {
            const updated = (note.content || '') + `\n\n📌 Not: ${selectionInfo.text} ➔ ${trans}`;
            commitContent(updated);
            setSelectionInfo(null);
          }}
          onSaveWord={transObj => {
            onSaveWord({
              id: `word-${Date.now()}`,
              word: selectionInfo.text,
              translation: transObj.translation,
              pos: transObj.pos,
              cefr: transObj.cefr,
              ipa: transObj.ipa,
              source: transObj.source,
              lang: note.language || 'en',
              savedAt: new Date().toISOString()
            });
          }}
          isWordSaved={isCurrentSelectionSaved}
        />
      )}

      {/* Batch Spellcheck Modal */}
      <BatchSpellcheckModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        content={note.content || ''}
        language={note.language || 'en'}
        customWords={customWords}
        onApplyFixes={handleBatchFixes}
        appLanguage={appLanguage}
      />

      {/* TOP ACTION & SETTING TOOLBAR */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-2 sm:px-6 md:px-8 py-2 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-20 shadow-xs">
        {/* Left: Language, Mode & Reactive Undo/Redo */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Note Language Selector */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs">
            <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-[11px] text-[var(--text-muted)] font-medium hidden sm:inline">
              {appLanguage === 'en' ? 'Lexicon:' : 'Dil:'}
            </span>
            <select
              value={note.language || 'en'}
              onChange={e =>
                onUpdateNote({
                  ...note,
                  language: e.target.value,
                  updatedAt: new Date().toISOString()
                })
              }
              className="bg-transparent font-bold text-[var(--text-main)] focus:outline-none cursor-pointer text-xs"
            >
              <option value="en">🇬🇧 EN</option>
              <option value="tr">🇹🇷 TR</option>
            </select>
          </div>

          {/* Note Mode Selector (Sade Boş Sayfa, İş, Günlük) */}
          <div className="flex items-center p-0.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={() =>
                  onUpdateNote({
                    ...note,
                    mode: 'plain',
                    updatedAt: new Date().toISOString()
                  })
                }
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  (note.mode || 'plain') === 'plain'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)] opacity-85 hover:opacity-100'
                }`}
                title={t.editor.modePlain}
              >
                <span>📄</span>
                <span className="hidden xs:inline">{t.editor.modePlain}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateNote({
                    ...note,
                    mode: 'work',
                    updatedAt: new Date().toISOString()
                  })
                }
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  note.mode === 'work'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)] opacity-85 hover:opacity-100'
                }`}
                title={t.editor.modeWork}
              >
                <span>💼</span>
                <span className="hidden xs:inline">{t.editor.modeWork}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateNote({
                    ...note,
                    mode: 'journal',
                    updatedAt: new Date().toISOString()
                  })
                }
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  note.mode === 'journal'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)] opacity-85 hover:opacity-100'
                }`}
                title={t.editor.modeJournal}
              >
                <span>📖</span>
                <span className="hidden xs:inline">{t.editor.modeJournal}</span>
              </button>
            </div>
          </div>

          {/* Quick Undo / Redo in Top Bar */}
          <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-0.5">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-1 sm:px-2 sm:py-1 rounded-lg text-xs font-semibold flex items-center gap-1 text-[var(--text-main)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              title={appLanguage === 'en' ? 'Undo (Ctrl+Z)' : 'Geri Al (Ctrl+Z)'}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">{appLanguage === 'en' ? 'Undo' : 'Geri Al'}</span>
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-1 sm:px-2 sm:py-1 rounded-lg text-xs font-semibold flex items-center gap-1 text-[var(--text-main)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              title={appLanguage === 'en' ? 'Redo (Ctrl+Y)' : 'Yinele (Ctrl+Y)'}
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">{appLanguage === 'en' ? 'Redo' : 'Yinele'}</span>
            </button>
          </div>
        </div>

        {/* Right Tools: Delete Note, Zen Mode & Lock */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Delete Note Button */}
          <button
            type="button"
            onClick={() => {
              if (onDeleteNote) onDeleteNote(note.id);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
            title={t.editor?.deleteNote || (appLanguage === 'en' ? 'Delete Note' : 'Notu Sil')}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.editor?.deleteNote || (appLanguage === 'en' ? 'Delete' : 'Sil')}</span>
          </button>
          {/* Zen Focus Mode Button */}
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              isZenMode
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title={isZenMode ? t.header.exitZenMode : t.header.enterZenMode}
          >
            {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {isZenMode
                ? (appLanguage === 'en' ? 'Exit Zen' : 'Odak Modu Açık')
                : (appLanguage === 'en' ? 'Zen Mode' : 'Odak Modu')}
            </span>
          </button>

          {/* Lock & Security Controls */}
          {note.isLocked ? (
            <button
              onClick={() => {
                sound.playLock();
                onLockNote(note.id);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              {appLanguage === 'en' ? 'Lock Note' : 'Notu Kilitle'}
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowLockSetup(!showLockSetup)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface)] border border-[var(--border-color)] transition-colors cursor-pointer"
                title={appLanguage === 'en' ? 'Encrypt & Lock with AES-256' : 'AES-256 ile şifrele ve kilitle'}
              >
                <Unlock className="w-3.5 h-3.5" />
                {appLanguage === 'en' ? 'Encrypt & Lock' : 'Şifrele & Kilitle'}
              </button>

              {showLockSetup && (
                <div className="absolute right-0 mt-2 w-72 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-xs font-bold text-[var(--text-main)] mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[var(--accent)]" />
                    {appLanguage === 'en' ? 'Set AES-256 GCM PIN' : 'AES-256 GCM Şifreleme Kur'}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mb-3 leading-relaxed">
                    {appLanguage === 'en'
                      ? 'Note content will be encrypted locally with PBKDF2 & AES-256 GCM; wiped from plain storage.'
                      : 'Not içeriğiniz cihazınızda PBKDF2 ve AES-256 GCM ile şifrelenecek; düz metin depolamadan tamamen silinecektir.'}
                  </p>
                  <form onSubmit={handleLockSetupSubmit} className="space-y-2.5">
                    <input
                      type="password"
                      maxLength={8}
                      value={setupPin}
                      onChange={e => setSetupPin(e.target.value)}
                      placeholder={appLanguage === 'en' ? 'Enter PIN (min 4 digits)' : 'PIN Girin (En az 4 hane)'}
                      autoFocus
                      className="w-full text-center text-sm font-bold tracking-widest px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowLockSetup(false)}
                        className="px-2.5 py-1.5 rounded-lg text-xs text-[var(--text-muted)] hover:bg-[var(--bg-surface)] cursor-pointer"
                      >
                        {t.common.cancel}
                      </button>
                      <button
                        type="submit"
                        disabled={setupPin.length < 4}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
                      >
                        {appLanguage === 'en' ? 'Lock & Encrypt' : 'Şifrele & Kilitle'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RICH TEXT FORMATTING TOOLBAR (Sleek Horizontal Scroll Ribbon with Prominent Fonts) */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-surface)]/95 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar whitespace-nowrap z-10 backdrop-blur-xs min-h-[56px] sm:min-h-[62px]">
        {/* 1. FRONT & PROMINENT: TYPOGRAPHY (Font Family & Font Size) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Font Family Selector (Substantially Enlarged & Prominent) */}
          <div className="h-12 sm:h-13 flex items-center gap-2 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] shadow-sm hover:border-[var(--accent)] transition-all">
            <Type className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)] shrink-0" />
            <select
              value={editorFont}
              onChange={e => setEditorFont(e.target.value)}
              style={{ fontFamily: resolvedFontFamily }}
              className="bg-transparent text-sm sm:text-base md:text-lg font-black text-[var(--text-main)] focus:outline-none cursor-pointer pr-1 py-1"
              title="Yazı Tipi Seçimi"
            >
              <option value="Noto Sans" style={{ fontFamily: "'Noto Sans', sans-serif" }} className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">Noto Sans</option>
              <option value="Noto Serif" style={{ fontFamily: "'Noto Serif', serif" }} className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">Noto Serif</option>
              <option value="Lora" style={{ fontFamily: "'Lora', serif" }} className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">Lora</option>
              <option value="Inter" style={{ fontFamily: "'Inter', sans-serif" }} className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">Inter</option>
              <option value="DejaVu Mono" style={{ fontFamily: "'DejaVu Mono', monospace" }} className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">DejaVu Mono</option>
              <option value="Fira Code" style={{ fontFamily: "'Fira Code', monospace" }} className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">Fira Code</option>
            </select>
          </div>

          {/* Font Size Selector (Substantially Enlarged & Prominent) */}
          <div className="h-12 sm:h-13 flex items-center px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] shadow-sm hover:border-[var(--accent)] transition-all">
            <select
              value={editorFontSize}
              onChange={e => setEditorFontSize(e.target.value)}
              className="bg-transparent text-sm sm:text-base md:text-lg font-black text-[var(--text-main)] focus:outline-none cursor-pointer py-1"
              title="Yazı Boyutu Seçimi"
            >
              <option value="16px" className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">16px</option>
              <option value="18px" className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">18px</option>
              <option value="20px" className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">20px</option>
              <option value="22px" className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">22px</option>
              <option value="24px" className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">24px</option>
              <option value="28px" className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">28px</option>
              <option value="32px" className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">32px</option>
              <option value="36px" className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">36px</option>
              <option value="42px" className="bg-[var(--bg-surface)] text-[var(--text-main)] py-1.5 text-base sm:text-lg font-bold">42px</option>
            </select>
          </div>
        </div>

        <div className="w-[1.5px] h-8 bg-[var(--border-color)] mx-1 shrink-0" />

        {/* 2. INLINE STYLES: Bold, Italic, Underline, Strikethrough, Highlight */}
        <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shrink-0 gap-1">
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Kalın (Ctrl+B)"
          >
            <Bold className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('italic')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="İtalik (Ctrl+I)"
          >
            <Italic className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('underline')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Altı Çizili (Ctrl+U)"
          >
            <Underline className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('strikethrough')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Üstü Çizili"
          >
            <Strikethrough className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('highlight')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-amber-600 dark:text-amber-400 transition-colors cursor-pointer"
            title="Metin Vurgulama"
          >
            <Highlighter className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
        </div>

        <div className="w-[1.5px] h-8 bg-[var(--border-color)] mx-1 shrink-0" />

        {/* 3. HEADINGS: H1, H2, H3, P */}
        <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shrink-0 gap-1">
          <button
            type="button"
            onClick={() => applyFormat('h1')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Başlık 1 (H1)"
          >
            <Heading1 className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('h2')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Başlık 2 (H2)"
          >
            <Heading2 className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('h3')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Başlık 3 (H3)"
          >
            <Heading3 className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('paragraph')}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-sm sm:text-base font-black text-[var(--text-muted)] transition-colors cursor-pointer"
            title="Normal Paragraf"
          >
            P
          </button>
        </div>

        <div className="w-[1.5px] h-8 bg-[var(--border-color)] mx-1 shrink-0" />

        {/* 4. LISTS: Bullets, Numbered, Checklist, Quote, Code, Link */}
        <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shrink-0 gap-1">
          <button
            type="button"
            onClick={() => applyFormat('bullet-list')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Madde İşaretli Liste"
          >
            <List className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('number-list')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Numaralı Liste"
          >
            <ListOrdered className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('task-list')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Yapılacaklar / Görev Listesi"
          >
            <CheckSquare className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('quote')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Alıntı Bloğu"
          >
            <Quote className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('code-block')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Kod Bloğu"
          >
            <Code className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('link')}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors cursor-pointer"
            title="Bağlantı Ekle [metin](url)"
          >
            <Link className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
        </div>

        <div className="w-[1.5px] h-8 bg-[var(--border-color)] mx-1 shrink-0" />

        {/* 5. WIKI-LINK INSERTER */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowWikiPicker(!showWikiPicker)}
            className="h-12 sm:h-13 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-bold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--accent)] hover:bg-[var(--bg-surface)] transition-all cursor-pointer shadow-xs"
            title={appLanguage === 'en' ? 'Link Another Note [[Note Title]]' : 'Bağlantılı Not Ekle [[Not Adı]]'}
          >
            <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            <span>[[{appLanguage === 'en' ? 'Link Note' : 'Not Bağla'}]]</span>
          </button>

          {showWikiPicker && (
            <div className="absolute left-0 mt-1.5 w-64 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-xl p-2 z-40 animate-in fade-in">
              <div className="text-[11px] font-bold text-[var(--text-muted)] px-2 py-1 uppercase tracking-wider">
                {appLanguage === 'en' ? 'Select Note to Link:' : 'Bağlanacak Notu Seçin:'}
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {allNotes
                  .filter(n => n.id !== note.id)
                  .map(targetN => (
                    <button
                      key={targetN.id}
                      type="button"
                      onClick={() => {
                        applyFormat('wikilink', { title: targetN.title });
                        setShowWikiPicker(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors truncate block"
                    >
                      📄 {targetN.title}
                    </button>
                  ))}
                {allNotes.filter(n => n.id !== note.id).length === 0 && (
                  <div className="text-xs text-[var(--text-muted)] p-2 text-center">
                    {appLanguage === 'en' ? 'No other notes found.' : 'Başka not bulunamadı.'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-[1.5px] h-8 bg-[var(--border-color)] mx-1 shrink-0" />

        {/* 6. UNDO / REDO */}
        <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shrink-0 gap-1">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] disabled:opacity-30 cursor-pointer"
            title="Geri Al (Ctrl+Z)"
          >
            <Undo2 className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-main)] disabled:opacity-30 cursor-pointer"
            title="Yinele (Ctrl+Y)"
          >
            <Redo2 className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </button>
        </div>

        <div className="w-[1.5px] h-8 bg-[var(--border-color)] mx-1 shrink-0" />

        {/* 7. VIEW MODE TOGGLE (Edit / Preview / Split) */}
        <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-3 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'edit'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title="Yalnızca Düzenle"
          >
            <Edit3 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="hidden md:inline">Düzenle</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'preview'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title="Yalnızca Önizle (Markdown)"
          >
            <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="hidden md:inline">Önizle</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hidden lg:flex items-center gap-1.5 transition-colors ${
              viewMode === 'split'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title="İki Bölmeli (Yan Yana)"
          >
            <Columns2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span>Bölünmüş</span>
          </button>
        </div>
      </div>

      {/* MAIN DOCUMENT BODY */}
      <div className={`w-full mx-auto px-2.5 sm:px-6 md:px-8 py-3 sm:py-6 space-y-3 sm:space-y-6 ${isZenMode ? 'max-w-3xl' : 'max-w-4xl'}`}>
        {/* Title Input */}
        <input
          type="text"
          value={note.title || ''}
          onChange={e =>
            onUpdateNote({
              ...note,
              title: e.target.value,
              updatedAt: new Date().toISOString()
            })
          }
          placeholder={t.editor.titlePlaceholder}
          style={{ fontFamily: resolvedFontFamily }}
          className="w-full text-2xl sm:text-4xl md:text-5xl font-black text-[var(--text-main)] bg-transparent border-none placeholder-[var(--text-muted)]/50 focus:outline-none tracking-tight py-1"
        />

        {/* Custom User Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {(note.tags || []).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--bg-surface)] text-[var(--accent)] border border-[var(--border-color)] group"
            >
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-[var(--text-muted)] hover:text-rose-500 rounded p-0.5 cursor-pointer"
                title={t.editor.removeTag}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <input
            type="text"
            value={newTagInput}
            onChange={e => setNewTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={appLanguage === 'en' ? '+ Type custom tag (Enter)...' : '+ Kendi etiketinizi yazın (Enter)...'}
            className="px-2.5 py-1 rounded-lg text-xs bg-transparent border border-dashed border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--accent)] min-w-[170px]"
          />
        </div>

        {/* WORK MODE MODULE */}
        {note.mode === 'work' && (
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[var(--text-muted)]">{t.editor.priority}:</span>
                <select
                  value={note.priority || 'medium'}
                  onChange={e =>
                    onUpdateNote({
                      ...note,
                      priority: e.target.value,
                      updatedAt: new Date().toISOString()
                    })
                  }
                  className="px-2 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] font-medium text-[var(--text-main)] focus:outline-none"
                >
                  <option value="low">{t.editor.priorityLow}</option>
                  <option value="medium">{t.editor.priorityMedium}</option>
                  <option value="high">{t.editor.priorityHigh}</option>
                  <option value="urgent">{t.editor.priorityUrgent}</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[var(--text-muted)]">{t.editor.status}:</span>
                <select
                  value={note.status || 'draft'}
                  onChange={e =>
                    onUpdateNote({
                      ...note,
                      status: e.target.value,
                      updatedAt: new Date().toISOString()
                    })
                  }
                  className="px-2 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] font-medium text-[var(--text-main)] focus:outline-none"
                >
                  <option value="draft">{t.editor.statusDraft}</option>
                  <option value="in_progress">{t.editor.statusInProgress}</option>
                  <option value="review">{t.editor.statusReview}</option>
                  <option value="done">{t.editor.statusDone}</option>
                </select>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-[var(--border-color)]/70">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {t.editor.checklistTitle}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {note.todos?.filter(t => t.done).length || 0} / {note.todos?.length || 0} {appLanguage === 'en' ? 'completed' : 'tamamlandı'}
                </span>
              </div>

              {note.todos && note.todos.length > 0 && (
                <div className="w-full h-1.5 bg-[var(--border-color)]/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${((note.todos.filter(t => t.done).length / note.todos.length) * 100).toFixed(0)}%`
                    }}
                  />
                </div>
              )}

              <div className="space-y-1.5 pt-1">
                {(note.todos || []).map(todo => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] group transition-colors"
                  >
                    <button
                      onClick={() => handleToggleTodo(todo.id)}
                      className="flex items-center gap-2 text-xs text-left flex-1 cursor-pointer"
                    >
                      {todo.done ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                      )}
                      <span className={todo.done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'}>
                        {todo.text}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-rose-500 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddTodo} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newTodoText}
                  onChange={e => setNewTodoText(e.target.value)}
                  placeholder={t.editor.newTodoPlaceholder}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent)] text-white hover:opacity-90 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t.editor.addTodo}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* JOURNAL MODE MODULE */}
        {note.mode === 'journal' && (
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text-muted)]">{t.editor.moodTitle}:</span>
                <div className="flex items-center gap-1">
                  {[
                    { id: 'great', label: appLanguage === 'en' ? '😄 Energized' : '😄 Harika' },
                    { id: 'happy', label: appLanguage === 'en' ? '😊 Happy' : '😊 Mutlu' },
                    { id: 'calm', label: appLanguage === 'en' ? '🌿 Calm' : '🌿 Dingin' },
                    { id: 'reflective', label: appLanguage === 'en' ? '💭 Reflective' : '💭 Düşünceli' },
                    { id: 'tired', label: appLanguage === 'en' ? '😴 Tired' : '😴 Yorgun' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        onUpdateNote({
                          ...note,
                          mood: m.id,
                          updatedAt: new Date().toISOString()
                        })
                      }
                      className={`px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                        note.mood === m.id
                          ? 'bg-[var(--accent-light)] text-[var(--accent)] font-bold border border-[var(--accent)]/30'
                          : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-base">
                  {[
                    { id: 'sunny', icon: '☀️' },
                    { id: 'cloudy', icon: '☁️' },
                    { id: 'rainy', icon: '🌧️' },
                    { id: 'snowy', icon: '❄️' },
                    { id: 'night', icon: '🌙' }
                  ].map(w => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() =>
                        onUpdateNote({
                          ...note,
                          weather: w.id,
                          updatedAt: new Date().toISOString()
                        })
                      }
                      className={`p-1 rounded-lg transition-transform cursor-pointer ${
                        note.weather === w.id
                          ? 'scale-125 bg-[var(--bg-secondary)] shadow-xs'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {w.icon}
                    </button>
                  ))}
                </div>

                {/* Toggle to Show/Hide Tefekkür & Minnettarlık */}
                <button
                  type="button"
                  onClick={() =>
                    onUpdateNote({
                      ...note,
                      hideJournalCards: !note.hideJournalCards,
                      updatedAt: new Date().toISOString()
                    })
                  }
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors flex items-center gap-1 cursor-pointer"
                  title={appLanguage === 'en' ? 'Toggle daily prompt and gratitude cards' : 'Tefekkür sorusu ve minnettarlık listesini gizle/göster'}
                >
                  {note.hideJournalCards ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{appLanguage === 'en' ? 'Show Cards' : 'Soruyu & Minnettarlığı Göster'}</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{appLanguage === 'en' ? 'Hide Cards' : 'Soruyu & Minnettarlığı Gizle'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Daily Reflection Prompt and Gratitude list (Rendered only if NOT hidden) */}
            {!note.hideJournalCards && (
              <>
                {/* Daily Reflection Prompt */}
                <div className="pt-3 border-t border-[var(--border-color)]/70">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-[var(--accent)] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.editor.dailyPromptTitle}:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const random = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
                        onUpdateNote({
                          ...note,
                          dailyPrompt: random,
                          updatedAt: new Date().toISOString()
                        });
                      }}
                      className="text-[11px] text-[var(--text-muted)] hover:text-[var(--accent)] font-medium cursor-pointer"
                    >
                      {t.editor.newPromptBtn}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border-l-4 border-l-[var(--accent)] border border-[var(--border-color)]">
                    <p
                      style={{ fontFamily: resolvedFontFamily }}
                      className="text-xs sm:text-sm font-semibold text-[var(--text-main)] leading-relaxed tracking-normal"
                    >
                      "{note.dailyPrompt || JOURNAL_PROMPTS[0]}"
                    </p>
                  </div>
                </div>

                {/* Gratitude List */}
                <div className="pt-2 border-t border-[var(--border-color)]/70">
                  <span className="text-xs font-bold text-[var(--text-main)] block mb-1.5">
                    {t.editor.gratitudeTitle}
                  </span>
                  <div className="space-y-1 mb-2">
                    {(note.gratitude || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[var(--bg-secondary)] text-xs text-[var(--text-main)] group"
                      >
                        <span>🌱 {item}</span>
                        <button
                          onClick={() => handleDeleteGratitude(idx)}
                          className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAddGratitude} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newGratitudeText}
                      onChange={e => setNewGratitudeText(e.target.value)}
                      placeholder={t.editor.addGratitudePlaceholder}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent)] text-white hover:opacity-90 cursor-pointer"
                    >
                      {t.editor.addGratitudeBtn}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        )}

        {/* EDITOR / PREVIEW / SPLIT VIEW CONTAINER */}
        <div className="space-y-4">
          {viewMode === 'edit' && (
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={note.content || ''}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                onSelect={handleSelect}
                onKeyUp={handleSelect}
                onTouchEnd={handleSelect}
                placeholder={
                  note.mode === 'work'
                    ? t.editor.contentPlaceholderWork
                    : note.mode === 'journal'
                    ? t.editor.contentPlaceholderJournal
                    : t.editor.contentPlaceholderPlain
                }
                rows={18}
                style={{
                  fontFamily: resolvedFontFamily,
                  fontSize: editorFontSize,
                  lineHeight: note.mode === 'journal' ? '1.85' : '1.6'
                }}
                className="w-full p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-transparent border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)]/50 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y shadow-xs"
              />
            </div>
          )}

          {viewMode === 'preview' && (
            <div className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xs min-h-[380px]">
              <MarkdownRenderer
                content={note.content || ''}
                allNotes={allNotes}
                onSelectNote={onSelectNote}
                onToggleTaskLine={handleToggleTaskLine}
                fontFamily={resolvedFontFamily}
                fontSize={editorFontSize}
              />
            </div>
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={note.content || ''}
                  onChange={handleContentChange}
                  onKeyDown={handleKeyDown}
                  onSelect={handleSelect}
                  onKeyUp={handleSelect}
                  onTouchEnd={handleSelect}
                  rows={20}
                  placeholder={
                    note.mode === 'work'
                      ? t.editor.contentPlaceholderWork
                      : note.mode === 'journal'
                      ? t.editor.contentPlaceholderJournal
                      : t.editor.contentPlaceholderPlain
                  }
                  style={{
                    fontFamily: resolvedFontFamily,
                    fontSize: editorFontSize,
                    lineHeight: note.mode === 'journal' ? '1.85' : '1.6'
                  }}
                  className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-transparent border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y shadow-xs"
                />
              </div>

              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xs overflow-y-auto max-h-[520px]">
                <MarkdownRenderer
                  content={note.content || ''}
                  allNotes={allNotes}
                  onSelectNote={onSelectNote}
                  onToggleTaskLine={handleToggleTaskLine}
                  fontFamily={resolvedFontFamily}
                  fontSize={editorFontSize}
                />
              </div>
            </div>
          )}

          {/* Footer Stats */}
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] px-1 gap-2 border-t border-[var(--border-color)]/50 pt-2">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] inline-block opacity-80" />
              <span>{note.mode === 'work' ? (appLanguage === 'en' ? 'Work Mode' : 'İş Modu') : note.mode === 'journal' ? (appLanguage === 'en' ? 'Journal Mode' : 'Günlük Modu') : (appLanguage === 'en' ? 'Plain Note' : 'Sade Not')}</span>
            </span>

            <span className="font-medium">
              {wordsCount} {t.common.words} • {charsCount} {t.common.characters} • ~{readingTime} {t.common.readingTime}
            </span>
          </div>
        </div>

        {/* CONNECTED NOTES & BACKLINKS PANEL (Hidden in Plain/Blank Mode) */}
        {note.mode !== 'plain' && (
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)]/60 border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-main)]">
                <Share2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{t.editor.connectedNotesTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowBacklinksPanel(!showBacklinksPanel)}
                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >
                {showBacklinksPanel ? t.common.hide : t.common.show}
              </button>
            </div>

            {showBacklinksPanel && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                {/* Outgoing References */}
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">
                    ➡️ {t.editor.outgoingLinksTitle} ({outgoingWikiMatches.length}):
                  </span>
                  {outgoingWikiMatches.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {outgoingWikiMatches.map(title => {
                        const found = allNotes.find(
                          n => n.title.toLowerCase() === title.toLowerCase()
                        );
                        return (
                          <button
                            key={title}
                            type="button"
                            onClick={() => found && onSelectNote(found.id)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border transition-colors ${
                              found
                                ? 'bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]/30 hover:underline cursor-pointer'
                                : 'bg-rose-50 text-rose-600 border-rose-200'
                            }`}
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{title}</span>
                            {!found && <span className="text-[10px] opacity-75">({t.editor.noteNotCreated})</span>}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[var(--text-muted)] italic">
                      {t.editor.noOutgoingLinks}
                    </p>
                  )}
                </div>

                {/* Backlinks */}
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">
                    ⬅️ {t.editor.backlinksTitle} ({backlinks.length}):
                  </span>
                  {backlinks.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {backlinks.map(bn => (
                        <button
                          key={bn.id}
                          type="button"
                          onClick={() => onSelectNote(bn.id)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-[var(--bg-surface)] text-[var(--accent)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>{bn.title}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[var(--text-muted)] italic">
                      {t.editor.noBacklinks}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

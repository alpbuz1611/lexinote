import React from 'react';
import { ExternalLink, BookOpen, CheckSquare, Square } from 'lucide-react';

/**
 * Lightweight, zero-dependency Markdown & Wiki-Link renderer
 * Renders headings, bold, italic, underline, strikethrough, highlight,
 * code blocks, blockquotes, lists, interactive checklists, links and [[WikiLinks]].
 */
export default function MarkdownRenderer({
  content = '',
  allNotes = [],
  onSelectNote = () => {},
  onToggleTaskLine = () => {},
  fontFamily = 'var(--editor-font)',
  fontSize = '16px'
}) {
  if (!content) {
    return (
      <div className="text-[var(--text-muted)] italic text-sm py-8 text-center">
        Henüz bir içerik yazılmadı. Düzenle moduna geçip yazmaya başlayabilirsiniz.
      </div>
    );
  }

  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = '';

  const parseInline = (text, keyPrefix) => {
    if (!text) return null;

    // Tokenize for [[WikiLink]], [text](url), `code`, ==mark==, ~~del~~, <u>u</u>, **bold**, *italic*
    // Using a regex with capturing groups
    const parts = [];
    let remaining = text;
    let idx = 0;

    // Pattern matching all supported inline tags
    const inlineRegex = /(\[\[(.*?)\]\])|(\[(.*?)\]\((.*?)\))|(`([^`]+)`)|(==([^=]+)==)|(~~([^~]+)~~)|(<u>(.*?)<\/u>)|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/;

    while (remaining.length > 0) {
      const match = remaining.match(inlineRegex);
      if (!match) {
        parts.push(remaining);
        break;
      }

      const matchIndex = match.index;
      if (matchIndex > 0) {
        parts.push(remaining.substring(0, matchIndex));
      }

      const fullMatch = match[0];

      if (match[1]) {
        // [[WikiLink]]
        const targetTitle = match[2].trim();
        const found = allNotes.find(
          n => n.title.toLowerCase() === targetTitle.toLowerCase()
        );
        parts.push(
          <button
            key={`${keyPrefix}-wiki-${idx++}`}
            type="button"
            onClick={() => found && onSelectNote(found.id)}
            title={found ? `"${found.title}" notunu aç` : `"${targetTitle}" başlıklı not bulunamadı`}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold border transition-all ${
              found
                ? 'bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]/30 hover:underline cursor-pointer'
                : 'bg-rose-50 text-rose-600 border-rose-200 cursor-not-allowed opacity-80'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>[[{targetTitle}]]</span>
          </button>
        );
      } else if (match[3]) {
        // [text](url)
        const linkText = match[4];
        const linkUrl = match[5];
        parts.push(
          <a
            key={`${keyPrefix}-link-${idx++}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-[var(--accent)] underline font-medium hover:opacity-80"
          >
            <span>{linkText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      } else if (match[6]) {
        // `inline code`
        parts.push(
          <code
            key={`${keyPrefix}-code-${idx++}`}
            className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--accent)] font-mono text-xs border border-[var(--border-color)]"
          >
            {match[7]}
          </code>
        );
      } else if (match[8]) {
        // ==highlight==
        parts.push(
          <mark
            key={`${keyPrefix}-mark-${idx++}`}
            className="px-1 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-[var(--text-main)] font-medium"
          >
            {match[9]}
          </mark>
        );
      } else if (match[10]) {
        // ~~strikethrough~~
        parts.push(
          <del key={`${keyPrefix}-del-${idx++}`} className="line-through opacity-60">
            {match[11]}
          </del>
        );
      } else if (match[12]) {
        // <u>underline</u>
        parts.push(
          <span key={`${keyPrefix}-u-${idx++}`} className="underline underline-offset-2">
            {match[13]}
          </span>
        );
      } else if (match[14]) {
        // **bold**
        parts.push(
          <strong key={`${keyPrefix}-bold-${idx++}`} className="font-bold text-[var(--text-main)]">
            {match[15]}
          </strong>
        );
      } else if (match[16]) {
        // *italic*
        parts.push(
          <em key={`${keyPrefix}-em-${idx++}`} className="italic">
            {match[17]}
          </em>
        );
      }

      remaining = remaining.substring(matchIndex + fullMatch.length);
    }

    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div
            key={`codeblock-${i}`}
            className="my-3 p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-x-auto text-xs font-mono"
          >
            {codeLang && (
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1 pb-1 border-b border-[var(--border-color)]/50">
                {codeLang}
              </div>
            )}
            <pre className="text-[var(--text-main)] leading-relaxed whitespace-pre">
              {codeBuffer.join('\n')}
            </pre>
          </div>
        );
        codeBuffer = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      elements.push(<div key={`empty-${i}`} className="h-4" />);
      continue;
    }

    // Heading 1 (# ...)
    if (line.startsWith('# ')) {
      elements.push(
        <h1
          key={`h1-${i}`}
          style={{ fontFamily }}
          className="text-2xl sm:text-3xl font-black text-[var(--text-main)] mt-6 mb-3 tracking-tight border-b border-[var(--border-color)] pb-2"
        >
          {parseInline(line.slice(2), `h1-${i}`)}
        </h1>
      );
      continue;
    }

    // Heading 2 (## ...)
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${i}`}
          style={{ fontFamily }}
          className="text-xl sm:text-2xl font-bold text-[var(--text-main)] mt-5 mb-2.5 tracking-tight"
        >
          {parseInline(line.slice(3), `h2-${i}`)}
        </h2>
      );
      continue;
    }

    // Heading 3 (### ...)
    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${i}`}
          style={{ fontFamily }}
          className="text-lg sm:text-xl font-bold text-[var(--text-main)] mt-4 mb-2 tracking-tight"
        >
          {parseInline(line.slice(4), `h3-${i}`)}
        </h3>
      );
      continue;
    }

    // Blockquote (> ...)
    if (line.startsWith('> ') || line === '>') {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          style={{ fontFamily }}
          className="my-3 pl-4 py-1 border-l-4 border-[var(--accent)] text-[var(--text-muted)] italic bg-[var(--bg-surface)]/40 rounded-r-lg"
        >
          {parseInline(line.slice(2), `quote-${i}`)}
        </blockquote>
      );
      continue;
    }

    // Interactive Checklist (- [ ] or - [x])
    if (/^-\s+\[([ xX])\]\s+/.test(trimmed)) {
      const isChecked = /^-\s+\[([xX])\]/.test(trimmed);
      const textAfterBox = trimmed.replace(/^-\s+\[([ xX])\]\s*/, '');
      elements.push(
        <div
          key={`task-${i}`}
          className="flex items-start gap-2.5 my-1.5 py-1 px-2 rounded-lg hover:bg-[var(--bg-surface)]/60 transition-colors group"
        >
          <button
            type="button"
            onClick={() => onToggleTaskLine(i)}
            className="mt-0.5 text-[var(--accent)] hover:opacity-80 transition-transform active:scale-95 flex-shrink-0"
            title={isChecked ? 'Görevi tamamlanmadı yap' : 'Görevi tamamlandı yap'}
          >
            {isChecked ? (
              <CheckSquare className="w-4 h-4 text-emerald-500" />
            ) : (
              <Square className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
            )}
          </button>
          <div
            className={`text-sm leading-relaxed ${
              isChecked ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'
            }`}
          >
            {parseInline(textAfterBox, `task-${i}`)}
          </div>
        </div>
      );
      continue;
    }

    // Bullet List (- ... or * ...)
    if (/^[-*]\s+/.test(trimmed)) {
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2.5 my-1 pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 flex-shrink-0" />
          <div className="text-sm leading-relaxed text-[var(--text-main)]">
            {parseInline(trimmed.replace(/^[-*]\s+/, ''), `bullet-${i}`)}
          </div>
        </div>
      );
      continue;
    }

    // Numbered List (1. ... or 2. ...)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} className="flex items-start gap-2 my-1 pl-2">
          <span className="text-xs font-bold text-[var(--accent)] font-mono min-w-[20px] text-right mt-0.5">
            {numMatch[1]}.
          </span>
          <div className="text-sm leading-relaxed text-[var(--text-main)]">
            {parseInline(numMatch[2], `num-${i}`)}
          </div>
        </div>
      );
      continue;
    }

    // Regular Paragraph
    elements.push(
      <p
        key={`p-${i}`}
        className="text-sm sm:text-base leading-relaxed text-[var(--text-main)] my-2"
      >
        {parseInline(line, `p-${i}`)}
      </p>
    );
  }

  // Handle open code block at end of document
  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <div
        key="codeblock-unclosed"
        className="my-3 p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-x-auto text-xs font-mono"
      >
        <pre className="text-[var(--text-main)] leading-relaxed whitespace-pre">
          {codeBuffer.join('\n')}
        </pre>
      </div>
    );
  }

  return (
    <div
      style={{ fontFamily, fontSize }}
      className="w-full max-w-none animate-in fade-in"
    >
      {elements}
    </div>
  );
}

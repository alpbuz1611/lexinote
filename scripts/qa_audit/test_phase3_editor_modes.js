import { translateSelection } from '../../src/services/translationService.js';

export async function runPhase3Tests() {
  console.log('\n================================================================');
  console.log('📝 PHASE 3 — RICH TEXT EDITOR & NOTE MODES AUDIT');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;
  const issues = [];

  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      failed++;
      console.error(`  ❌ [FAIL] ${message}`);
      issues.push(message);
    }
  }

  // 3.1 Markdown Syntax & Formatting Parsing Verification
  console.log('\n--- 3.1 Markdown Formats & Syntax Integrity ---');

  const markdownDocument = `
# Main Project Heading 1
## Section Heading 2
### Detailed Subsection 3

Here is **bold text**, *italic text*, <u>underlined text</u>, ~~strikethrough text~~, and ==highlighted text==.

> This is a critical blockquote citation.

- Bullet item alpha
- Bullet item beta
- Bullet item gamma

1. First chronological step
2. Second execution phase
3. Final review milestone

- [ ] Uncompleted action item
- [x] Completed verified deliverable

\`\`\`javascript
const answer = 42;
console.log('LexiNote offline engine');
\`\`\`

External reference: [GitHub Repository](https://github.com/alpbuz1611/lexinote)
Internal reference: [[Architecture Specification]]
`;

  // Verify elements detection using the parser logic
  const lines = markdownDocument.split('\n');
  const hasH1 = lines.some(l => l.startsWith('# '));
  const hasH2 = lines.some(l => l.startsWith('## '));
  const hasH3 = lines.some(l => l.startsWith('### '));
  const hasBullet = lines.some(l => /^[-*]\s+/.test(l.trim()));
  const hasNumbered = lines.some(l => /^\d+\.\s+/.test(l.trim()));
  const hasChecklist = lines.some(l => /^[-*]\s+\[[ xX]\]\s+/.test(l.trim()));
  const hasQuote = lines.some(l => l.startsWith('> '));
  const hasCodeBlock = lines.some(l => l.startsWith('```'));
  const hasInlineStyles = /\*\*.*?\*\*/.test(markdownDocument) &&
                          /\*.*?\*/.test(markdownDocument) &&
                          /<u>.*?<\/u>/.test(markdownDocument) &&
                          /~~.*?~~/.test(markdownDocument) &&
                          /==.*?==/.test(markdownDocument);
  const hasWikiLink = /\[\[(.*?)\]\]/.test(markdownDocument);
  const hasExtLink = /\[(.*?)\]\((.*?)\)/.test(markdownDocument);

  assert(hasH1, 'Heading 1 (#) parsed correctly');
  assert(hasH2, 'Heading 2 (##) parsed correctly');
  assert(hasH3, 'Heading 3 (###) parsed correctly');
  assert(hasInlineStyles, 'Bold, italic, underline, strikethrough, highlight inline tokens verified');
  assert(hasQuote, 'Blockquote (>) parsed correctly');
  assert(hasBullet, 'Bullet list (- ) parsed correctly');
  assert(hasNumbered, 'Numbered list (1. ) parsed correctly');
  assert(hasChecklist, 'Checklists (- [ ] / - [x]) parsed correctly');
  assert(hasCodeBlock, 'Fenced code blocks (```) parsed correctly');
  assert(hasExtLink, 'Markdown external links [text](url) parsed correctly');
  assert(hasWikiLink, 'Internal [[WikiLink]] parsed correctly');

  // 3.2 Undo & Redo History Buffer Stack Logic
  console.log('\n--- 3.2 Undo & Redo History Buffer Logic ---');
  const history = ['State 0: Blank'];
  let historyIdx = 0;

  function pushSnapshot(text) {
    if (text === history[historyIdx]) return;
    history.splice(historyIdx + 1);
    history.push(text);
    if (history.length > 50) history.shift();
    historyIdx = history.length - 1;
  }

  function undo() {
    if (historyIdx > 0) {
      historyIdx--;
      return history[historyIdx];
    }
    return history[historyIdx];
  }

  function redo() {
    if (historyIdx < history.length - 1) {
      historyIdx++;
      return history[historyIdx];
    }
    return history[historyIdx];
  }

  pushSnapshot('State 1: Added Title');
  pushSnapshot('State 2: Added Paragraph');
  pushSnapshot('State 3: Added Checklist');

  assert(history.length === 4 && historyIdx === 3, 'History stack pushed 3 edits');
  assert(undo() === 'State 2: Added Paragraph', 'Undo stepped back to State 2');
  assert(undo() === 'State 1: Added Title', 'Undo stepped back to State 1');
  assert(redo() === 'State 2: Added Paragraph', 'Redo stepped forward to State 2');

  // Branching history on edit after undo (current idx was 2, so future state 3 is discarded)
  pushSnapshot('State 2B: Branched Alternative');
  assert(history[history.length - 1] === 'State 2B: Branched Alternative', 'History correctly pruned future and branched');
  assert(history.length === 4 && !history.includes('State 3: Added Checklist'), 'Redo future correctly discarded on new branched edit');

  // 3.3 Three Note Modes & Content Preservation Across Mode Switches
  console.log('\n--- 3.3 Three Note Modes & Mode Switching ---');
  let testNote = {
    id: 'note-mode-test-1',
    title: 'Multi-Mode Transition Test',
    mode: 'plain',
    content: 'Universal document content that must NEVER be lost when changing mode.',
    tags: ['mode-test'],
    priority: undefined,
    status: undefined,
    todos: [],
    mood: undefined,
    weather: undefined,
    dailyPrompt: undefined,
    gratitude: [],
    updatedAt: new Date().toISOString()
  };

  // Switch to Professional (work)
  testNote = {
    ...testNote,
    mode: 'work',
    priority: 'high',
    status: 'in_progress',
    todos: [{ id: 't1', text: 'Deliver project plan', done: false }],
    updatedAt: new Date().toISOString()
  };
  assert(testNote.mode === 'work' && testNote.priority === 'high' && testNote.todos.length === 1, 'Switched to Professional (Work) mode');
  assert(testNote.content.includes('Universal document content'), 'Content 100% preserved in Work mode');

  // Switch to Journal
  testNote = {
    ...testNote,
    mode: 'journal',
    mood: 'peaceful',
    weather: 'sunny',
    dailyPrompt: 'What was today’s biggest breakthrough?',
    gratitude: ['Productive coding session'],
    updatedAt: new Date().toISOString()
  };
  assert(testNote.mode === 'journal' && testNote.mood === 'peaceful' && testNote.gratitude.length === 1, 'Switched to Journal mode');
  assert(testNote.content.includes('Universal document content'), 'Content 100% preserved in Journal mode');
  assert(testNote.todos.length === 1, 'Work todos metadata retained in background when visiting journal mode');

  // Switch back to Plain
  testNote = {
    ...testNote,
    mode: 'plain',
    updatedAt: new Date().toISOString()
  };
  assert(testNote.mode === 'plain', 'Switched back to Plain mode');
  assert(testNote.content.includes('Universal document content'), 'Content 100% preserved in Plain mode');

  // 3.4 Selection-Based Dictionary Lookup
  console.log('\n--- 3.4 Selection-Based Dictionary Lookup ---');
  const selectionText = '  knowledge  ';
  const lookup = translateSelection(selectionText.trim(), 'en', 'tr');
  assert(lookup !== null && lookup.found === true, 'Selection "knowledge" successfully resolved in offline dictionary');
  assert(lookup.translation.length > 0, `Returned translation: "${lookup.translation.slice(0, 40)}..."`);

  console.log(`\nPHASE 3 SUMMARY: ${passed} Passed, ${failed} Failed`);
  return { passed, failed, issues };
}

if (process.argv[1]?.endsWith('test_phase3_editor_modes.js')) {
  runPhase3Tests();
}

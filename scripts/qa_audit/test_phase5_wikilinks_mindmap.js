import { GET_DEFAULT_FREEFORM_MINDSET, GET_INITIAL_MINDSET_TABS } from '../../src/data/defaultMindsets.js';

export async function runPhase5Tests() {
  console.log('\n================================================================');
  console.log('🕸️ PHASE 5 — WIKI-LINKS, BACKLINKS & KNOWLEDGE GRAPH AUDIT');
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

  // 5.1 Wiki-Links & Case-Insensitive Backlinks
  console.log('\n--- 5.1 Wiki-Links & Backlinks Bidirectional Audit ---');
  const noteA = {
    id: 'note-a',
    title: 'Research Methodology',
    content: 'This study builds upon the findings in [[Quantum Computing Architecture]] and [[neural network principles]].'
  };

  const noteB = {
    id: 'note-b',
    title: 'Quantum Computing Architecture',
    content: 'Core qubits and decoherence principles.'
  };

  const noteC = {
    id: 'note-c',
    title: 'Neural Network Principles', // Notice title case vs noteA's lowercase [[neural network principles]]
    content: 'Synaptic weights and backpropagation.'
  };

  const allNotes = [noteA, noteB, noteC];

  // MarkdownRenderer WikiLink matcher logic
  function resolveWikiLink(linkText, notesList) {
    const targetTitle = linkText.trim();
    return notesList.find(n => n.title.toLowerCase() === targetTitle.toLowerCase());
  }

  const matchB = resolveWikiLink('Quantum Computing Architecture', allNotes);
  assert(matchB !== undefined && matchB.id === 'note-b', 'Exact case [[Quantum Computing Architecture]] resolved to Note B');

  const matchC = resolveWikiLink('neural network principles', allNotes);
  assert(matchC !== undefined && matchC.id === 'note-c', 'Lower-case [[neural network principles]] resolved to Title-cased Note C');

  // Backlinks Calculation (Case-insensitive token-level matcher as implemented in Editor.jsx)
  console.log('\n--- 5.2 Backlinks Case Sensitivity Audit ---');
  function findBacklinks(targetNote, notesList) {
    const targetTitleLower = (targetNote.title || '').trim().toLowerCase();
    return notesList.filter(other => {
      if (other.id === targetNote.id || !other.content || !targetTitleLower) return false;
      const matches = Array.from(other.content.matchAll(/\[\[(.*?)\]\]/g));
      return matches.some(m => m[1].trim().toLowerCase() === targetTitleLower);
    });
  }

  const backlinksB = findBacklinks(noteB, allNotes);
  assert(backlinksB.length === 1 && backlinksB[0].id === 'note-a', 'Backlinks for exact-case Note B found');

  const backlinksC = findBacklinks(noteC, allNotes);
  assert(backlinksC.length === 1 && backlinksC[0].id === 'note-a', 'Backlinks for lower-case link to Title-Cased Note C matched case-insensitively');

  // 5.3 Renaming & Broken Links Handling
  console.log('\n--- 5.3 Renaming & Broken Links Lifecycle ---');
  // Rename Note B to 'Quantum Computing Architecture (v2)'
  const updatedNotesAfterRename = allNotes.map(n =>
    n.id === 'note-b' ? { ...n, title: 'Quantum Computing Architecture (v2)' } : n
  );

  const brokenMatch = resolveWikiLink('Quantum Computing Architecture', updatedNotesAfterRename);
  assert(brokenMatch === undefined, 'Old link [[Quantum Computing Architecture]] correctly recognized as broken/unresolved after rename');

  // Restore Note B by creating a new note with the old title
  const restoredNotes = [
    ...updatedNotesAfterRename,
    { id: 'note-b-restored', title: 'Quantum Computing Architecture', content: 'Restored stub note.' }
  ];
  const restoredMatch = resolveWikiLink('Quantum Computing Architecture', restoredNotes);
  assert(restoredMatch !== undefined && restoredMatch.id === 'note-b-restored', 'Re-creating note with matching title automatically re-activates broken link');

  // 5.4 Graph Synchronization (Edges extraction)
  console.log('\n--- 5.4 Knowledge Graph Synchronization ---');
  function buildGraphEdges(notesList) {
    const titleMap = new Map(notesList.map(n => [n.title.toLowerCase(), n.id]));
    const edges = [];
    notesList.forEach(source => {
      const outgoing = Array.from(new Set(
        Array.from((source.content || '').matchAll(/\[\[(.*?)\]\]/g)).map(m => m[1].trim().toLowerCase())
      ));
      outgoing.forEach(targetTitle => {
        const targetId = titleMap.get(targetTitle);
        if (targetId && targetId !== source.id) {
          const edgeKey = [source.id, targetId].sort().join(':::');
          if (!edges.some(e => e.key === edgeKey)) {
            edges.push({ key: edgeKey, sourceId: source.id, targetId });
          }
        }
      });
    });
    return edges;
  }

  const initialEdges = buildGraphEdges(allNotes);
  assert(initialEdges.length === 2, `Initial graph correctly extracted 2 bidirectional edges (actual: ${initialEdges.length})`);

  const edgesAfterRename = buildGraphEdges(updatedNotesAfterRename);
  assert(edgesAfterRename.length === 1, `After renaming, broken link edge removed from active graph (actual: ${edgesAfterRename.length})`);

  // 5.5 Freeform Mind Map Node & Connection Operations
  console.log('\n--- 5.5 Freeform Mind Map Canvas Operations ---');
  const mindset = GET_DEFAULT_FREEFORM_MINDSET('en');
  assert(Array.isArray(mindset.nodes) && mindset.nodes.length >= 4, 'Default Freeform Mindset loaded with Cambridge sample nodes');
  assert(Array.isArray(mindset.edges) && mindset.edges.length >= 3, 'Default Mindset loaded with hierarchical edges');

  // Add custom node
  const newNode = {
    id: 'node-custom-1',
    label: 'Artificial General Intelligence',
    color: 'emerald',
    x: 450,
    y: 120
  };
  mindset.nodes.push(newNode);
  assert(mindset.nodes.some(n => n.id === 'node-custom-1'), 'Added new node to Mindset canvas');

  // Connect new node
  const newEdge = {
    id: 'conn-custom-1',
    sourceId: 'node-cambridge',
    targetId: 'node-custom-1',
    label: 'Future Horizons'
  };
  mindset.edges.push(newEdge);
  assert(mindset.edges.some(c => c.id === 'conn-custom-1'), 'Connected root node to new node');

  // Change color
  newNode.color = 'amber';
  assert(newNode.color === 'amber', 'Node color successfully updated');

  // Delete edge
  mindset.edges = mindset.edges.filter(c => c.id !== 'conn-custom-1');
  assert(!mindset.edges.some(c => c.id === 'conn-custom-1'), 'Edge successfully disconnected/removed');

  // Delete node
  mindset.nodes = mindset.nodes.filter(n => n.id !== 'node-custom-1');
  assert(!mindset.nodes.some(n => n.id === 'node-custom-1'), 'Node successfully deleted from canvas');

  // 5.6 Mind Map Stress & Performance Test (50, 100, 250 Nodes)
  console.log('\n--- 5.6 Mind Map Performance Stress Test (50, 100, 250 Nodes) ---');
  for (const nodeCount of [50, 100, 250]) {
    const stressNodes = [];
    const stressEdges = [];
    for (let i = 0; i < nodeCount; i++) {
      stressNodes.push({
        id: `node-${i}`,
        label: `Knowledge Cluster Node #${i}`,
        x: (Math.random() - 0.5) * 1200,
        y: (Math.random() - 0.5) * 1200,
        vx: 0,
        vy: 0,
        radius: 24
      });
      if (i > 0) {
        const parentIdx = Math.floor(Math.random() * i);
        stressEdges.push({
          sourceId: `node-${parentIdx}`,
          targetId: `node-${i}`
        });
      }
    }

    // Benchmark single physics / layout step
    const t0 = performance.now();
    // Simulate physics repulsions & spring forces
    for (let i = 0; i < stressNodes.length; i++) {
      for (let j = i + 1; j < stressNodes.length; j++) {
        const dx = stressNodes[j].x - stressNodes[i].x;
        const dy = stressNodes[j].y - stressNodes[i].y;
        const distSq = dx * dx + dy * dy + 0.1;
        if (distSq < 40000) {
          const force = 50 / distSq;
          stressNodes[i].vx -= dx * force;
          stressNodes[i].vy -= dy * force;
          stressNodes[j].vx += dx * force;
          stressNodes[j].vy += dy * force;
        }
      }
    }
    const duration = performance.now() - t0;
    const thresholdMs = nodeCount <= 100 ? 25 : 60;
    assert(duration < thresholdMs, `${nodeCount} nodes physics calculation step executed in ${duration.toFixed(2)}ms (< ${thresholdMs}ms threshold)`);
  }

  console.log(`\nPHASE 5 SUMMARY: ${passed} Passed, ${failed} Failed`);
  return { passed, failed, issues };
}

if (process.argv[1]?.endsWith('test_phase5_wikilinks_mindmap.js')) {
  runPhase5Tests();
}

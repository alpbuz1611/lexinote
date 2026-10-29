import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Search,
  Sparkles,
  Lock,
  Pin,
  Briefcase,
  BookOpen,
  FileText,
  Share2,
  Plus,
  Trash2,
  Edit2,
  Link as LinkIcon,
  Check,
  Palette,
  ExternalLink,
  Layers,
  Compass,
  ArrowRight,
  GitBranch,
  Eye,
  RefreshCw,
  HelpCircle,
  Camera,
  FolderPlus,
  Download
} from 'lucide-react';
import { getTranslation } from '../i18n/translations.js';
import { sound } from '../services/soundService.js';
import {
  GET_DEFAULT_FREEFORM_MINDSET,
  GET_INITIAL_MINDSET_TABS,
  NODE_COLORS
} from '../data/defaultMindsets.js';

export default function MindmapView({
  isOpen,
  onClose,
  notes = [],
  activeNoteId,
  onSelectNote,
  appLanguage = 'en',
  onOpenHelpGuide
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const editInputRef = useRef(null);

  const t = getTranslation(appLanguage);
  const isTr = appLanguage === 'tr';

  // Primary View Mode: 'freeform' (Mindset Studio) | 'galaxy' (Notes Galaxy)
  const [activeTab, setActiveTab] = useState('freeform');
  const [graphTheme, setGraphTheme] = useState('cosmic'); // 'cosmic' | 'onyx' | 'paper'
  const [searchQuery, setSearchQuery] = useState('');
  const [isPhysicsRunning, setIsPhysicsRunning] = useState(false);

  // MULTIPLE MINDSET TABS SYSTEM (Cambridge Example + Custom User Mindsets)
  const [mindsetTabs, setMindsetTabs] = useState(() => {
    try {
      const saved = localStorage.getItem('lexinote_mindset_tabs_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return GET_INITIAL_MINDSET_TABS(appLanguage);
  });

  const [activeMindsetId, setActiveMindsetId] = useState(() => {
    return mindsetTabs[0]?.id || 'tab-cambridge';
  });

  // Current Active Mindset Data
  const currentMindset = useMemo(() => {
    return (
      mindsetTabs.find(tab => tab.id === activeMindsetId) ||
      mindsetTabs[0] || {
        id: 'tab-cambridge',
        title: isTr ? '🎓 Cambridge (Örnek)' : '🎓 Cambridge (Example)',
        data: GET_DEFAULT_FREEFORM_MINDSET(appLanguage)
      }
    );
  }, [mindsetTabs, activeMindsetId, isTr, appLanguage]);

  // Persist Mindset Tabs in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lexinote_mindset_tabs_v4', JSON.stringify(mindsetTabs));
    } catch (e) {
      console.error(e);
    }
  }, [mindsetTabs]);

  // Selected Node & Inline Editing State
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [colorTick, setColorTick] = useState(0);
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Two-Click Connect Mode State
  const [connectingFromId, setConnectingFromId] = useState(null);

  // Persistent Custom Connections between Notes (Galaxy Mode)
  const [customNoteEdges, setCustomNoteEdges] = useState(() => {
    try {
      const saved = localStorage.getItem('lexinote_custom_note_edges_v3');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Galaxy Custom Dragged Node Positions
  const [galaxyPositions, setGalaxyPositions] = useState(() => {
    try {
      const saved = localStorage.getItem('lexinote_galaxy_positions_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem('lexinote_custom_note_edges_v3', JSON.stringify(customNoteEdges));
    } catch {}
  }, [customNoteEdges]);

  useEffect(() => {
    try {
      localStorage.setItem('lexinote_galaxy_positions_v1', JSON.stringify(galaxyPositions));
    } catch {}
  }, [galaxyPositions]);

  // Focus input whenever editingNodeId activates
  useEffect(() => {
    if (editingNodeId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingNodeId]);

  // Camera & Interaction Ref
  const cameraRef = useRef({
    x: 0,
    y: 0,
    zoom: 1.0,
    isDraggingCanvas: false,
    dragStart: { x: 0, y: 0 },
    dragOrigin: { x: 0, y: 0 },
    hasMoved: false,
    draggedNodeId: null,
    connectingSourceNodeId: null,
    connectingPos: { x: 0, y: 0 },
    hoveredNodeId: null
  });

  // Background Universe Starfield & Shooting Stars Ref
  const starsRef = useRef([]);
  const meteorsRef = useRef([]);
  const nextMeteorTimeRef = useRef(Date.now() + 2500);

  // Build Notes Galaxy Graph with Sector Clustering
  const galaxyGraphData = useMemo(() => {
    const nodes = notes.map((note, index) => {
      const outgoing = Array.from(new Set(
        Array.from((note.content || '').matchAll(/\[\[(.*?)\]\]/g)).map(m => m[1].trim().toLowerCase())
      ));

      const wordCount = (note.content || '').trim().split(/\s+/).filter(Boolean).length;
      const baseRadius = note.mode === 'work' ? 26 : note.mode === 'journal' ? 24 : 22;
      const radius = Math.min(42, baseRadius + Math.min(16, wordCount / 40));

      let sectorFocusX = 0;
      let sectorFocusY = 0;
      let sectorColor = 'cyan';

      if (note.mode === 'work') {
        sectorFocusX = -320;
        sectorFocusY = -40;
        sectorColor = 'cyan';
      } else if (note.mode === 'journal') {
        sectorFocusX = 320;
        sectorFocusY = -40;
        sectorColor = 'rose';
      } else {
        sectorFocusX = 0;
        sectorFocusY = 260;
        sectorColor = 'violet';
      }

      const sectorAngle = (index * 1.35) % (Math.PI * 2);
      const sectorSpread = 70 + (index % 4) * 45;

      const savedPos = galaxyPositions[note.id];
      const initialX = savedPos ? savedPos.x : sectorFocusX + Math.cos(sectorAngle) * sectorSpread;
      const initialY = savedPos ? savedPos.y : sectorFocusY + Math.sin(sectorAngle) * sectorSpread;

      return {
        id: note.id,
        title: note.title || t.editor.untitled,
        mode: note.mode || 'plain',
        tags: note.tags || [],
        isPinned: !!note.isPinned,
        isLocked: !!note.isLocked,
        content: note.content || '',
        wordCount,
        outgoingWiki: outgoing,
        radius,
        w: radius * 2,
        h: radius * 2,
        color: sectorColor,
        sectorTarget: { x: sectorFocusX, y: sectorFocusY },
        x: initialX,
        y: initialY,
        vx: 0,
        vy: 0,
        isActive: note.id === activeNoteId
      };
    });

    const edges = [];
    const titleMap = new Map(nodes.map(n => [n.title.toLowerCase(), n.id]));

    // A. Explicit Wiki-Links
    nodes.forEach(source => {
      source.outgoingWiki.forEach(targetTitle => {
        const targetId = titleMap.get(targetTitle);
        if (targetId && targetId !== source.id) {
          const edgeKey = [source.id, targetId].sort().join(':::');
          if (!edges.some(e => e.key === edgeKey)) {
            edges.push({
              key: edgeKey,
              sourceId: source.id,
              targetId,
              type: 'wiki',
              strength: 1.0
            });
          }
        }
      });
    });

    // B. Custom User Added Edges
    customNoteEdges.forEach(ce => {
      const edgeKey = [ce.sourceId, ce.targetId].sort().join(':::');
      if (!edges.some(e => e.key === edgeKey)) {
        edges.push({
          key: edgeKey,
          sourceId: ce.sourceId,
          targetId: ce.targetId,
          type: 'custom',
          strength: 1.0
        });
      }
    });

    // C. Shared Tags
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const sharedTags = (n1.tags || []).filter(tag => (n2.tags || []).includes(tag));
        if (sharedTags.length > 0) {
          const edgeKey = [n1.id, n2.id].sort().join(':::');
          if (!edges.some(e => e.key === edgeKey)) {
            edges.push({
              key: edgeKey,
              sourceId: n1.id,
              targetId: n2.id,
              type: 'tag',
              sharedTag: sharedTags[0],
              strength: 0.35
            });
          }
        }
      }
    }

    return { nodes, edges };
  }, [notes, activeNoteId, customNoteEdges, galaxyPositions, t]);

  // Live nodes reference (Synchronous source of truth for rendering and coords)
  const liveNodesRef = useRef([]);

  // Calculate dynamic node width based on text
  const calculateNodeDimensions = useCallback((node) => {
    const textLen = (node.text || '').length;
    const w = Math.max(130, Math.min(280, 48 + textLen * 9.5));
    const h = node.isRoot ? 46 : 40;
    return { w, h };
  }, []);

  // Synchronize Live Nodes when activeTab, currentMindset, or galaxy changes
  useEffect(() => {
    if (activeTab === 'galaxy') {
      const currentPosMap = new Map(liveNodesRef.current.map(n => [n.id, { x: n.x, y: n.y, vx: n.vx, vy: n.vy }]));
      liveNodesRef.current = galaxyGraphData.nodes.map(n => {
        const existing = currentPosMap.get(n.id);
        if (existing) {
          return { ...n, x: existing.x, y: existing.y, vx: existing.vx, vy: existing.vy };
        }
        return { ...n };
      });
    } else {
      // Freeform Mindset Tab
      const currentPosMap = new Map(liveNodesRef.current.map(n => [n.id, { x: n.x, y: n.y, vx: n.vx, vy: n.vy }]));
      const rawNodes = currentMindset?.data?.nodes || [];
      liveNodesRef.current = rawNodes.map(n => {
        const existing = currentPosMap.get(n.id);
        const { w, h } = calculateNodeDimensions(n);
        if (existing) {
          return { ...n, w, h, x: existing.x, y: existing.y, vx: existing.vx, vy: existing.vy };
        }
        return { ...n, w, h, vx: 0, vy: 0 };
      });
    }
  }, [activeTab, galaxyGraphData, currentMindset, calculateNodeDimensions]);

  // Initialize Ultra-Realistic Parallax Starfield
  useEffect(() => {
    const stars = [];

    // Layer 1: 280 Faint Micro-Stars
    for (let i = 0; i < 280; i++) {
      stars.push({
        layer: 1,
        x: (Math.random() - 0.5) * 3800,
        y: (Math.random() - 0.5) * 3800,
        radius: Math.random() * 0.8 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.15,
        color: '#FFFFFF',
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005
      });
    }

    // Layer 2: 110 Spectral Stars
    const spectralColors = ['#BAE6FD', '#FFFFFF', '#FEF08A', '#FCA5A5', '#7DD3FC', '#A7F3D0'];
    for (let i = 0; i < 110; i++) {
      stars.push({
        layer: 2,
        x: (Math.random() - 0.5) * 3400,
        y: (Math.random() - 0.5) * 3400,
        radius: Math.random() * 1.3 + 0.8,
        baseAlpha: Math.random() * 0.65 + 0.35,
        color: spectralColors[Math.floor(Math.random() * spectralColors.length)],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.01
      });
    }

    // Layer 3: 16 Foreground James Webb Stars with Diffraction Cross Spikes
    for (let i = 0; i < 16; i++) {
      stars.push({
        layer: 3,
        x: (Math.random() - 0.5) * 2800,
        y: (Math.random() - 0.5) * 2800,
        radius: Math.random() * 1.8 + 1.8,
        spikeLength: Math.random() * 22 + 18,
        baseAlpha: 0.9,
        color: '#FFFFFF',
        haloColor: 'rgba(56, 189, 248, 0.45)',
        phase: Math.random() * Math.PI * 2,
        speed: 0.02
      });
    }

    starsRef.current = stars;
  }, []);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let animationTime = 0;

    const tick = () => {
      animationTime += 0.025;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      const nodes = liveNodesRef.current;
      const edges = activeTab === 'galaxy' ? galaxyGraphData.edges : (currentMindset?.data?.edges || []);

      // 1. Physics Step (Galaxy mode simulation when toggled)
      if (isPhysicsRunning && activeTab === 'galaxy') {
        const damping = 0.85;

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const n1 = nodes[i];
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.hypot(dx, dy) || 1;
            const force = 2200 / (dist * dist + 80);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (cameraRef.current.draggedNodeId !== n1.id && !galaxyPositions[n1.id]) {
              n1.vx -= fx;
              n1.vy -= fy;
            }
            if (cameraRef.current.draggedNodeId !== n2.id && !galaxyPositions[n2.id]) {
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        edges.forEach(edge => {
          const source = nodes.find(n => n.id === edge.sourceId);
          const target = nodes.find(n => n.id === edge.targetId);
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.hypot(dx, dy) || 1;
            const force = (dist - 140) * 0.04;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (cameraRef.current.draggedNodeId !== source.id && !galaxyPositions[source.id]) {
              source.vx += fx;
              source.vy += fy;
            }
            if (cameraRef.current.draggedNodeId !== target.id && !galaxyPositions[target.id]) {
              target.vx -= fx;
              target.vy -= fy;
            }
          }
        });

        nodes.forEach(node => {
          if (cameraRef.current.draggedNodeId !== node.id && !galaxyPositions[node.id]) {
            if (node.sectorTarget) {
              node.vx += (node.sectorTarget.x - node.x) * 0.02;
              node.vy += (node.sectorTarget.y - node.y) * 0.02;
            }
            node.vx *= damping;
            node.vy *= damping;
            node.x += node.vx;
            node.y += node.vy;
          }
        });
      }

      // 2. Shooting Stars (Meteors)
      const now = Date.now();
      if (graphTheme === 'cosmic' && now > nextMeteorTimeRef.current) {
        meteorsRef.current.push({
          x: (Math.random() - 0.2) * 1600 - 400,
          y: -400,
          dx: 12 + Math.random() * 8,
          dy: 10 + Math.random() * 6,
          length: 120 + Math.random() * 100,
          life: 1.0,
          decay: 0.018 + Math.random() * 0.015
        });
        nextMeteorTimeRef.current = now + 4000 + Math.random() * 4000;
      }

      meteorsRef.current.forEach(m => {
        m.x += m.dx;
        m.y += m.dy;
        m.life -= m.decay;
      });
      meteorsRef.current = meteorsRef.current.filter(m => m.life > 0);

      // 3. Render Canvas
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.clearRect(0, 0, width, height);

      // A. THEMES & BACKGROUNDS
      if (graphTheme === 'cosmic') {
        const bgGrad = ctx.createRadialGradient(
          width / 2, height / 2, 80,
          width / 2, height / 2, Math.max(width, height) * 0.95
        );
        bgGrad.addColorStop(0, '#070D1E');
        bgGrad.addColorStop(0.4, '#030612');
        bgGrad.addColorStop(1, '#010206');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Nebulae
        ctx.save();
        ctx.translate(width / 2 + cameraRef.current.x * 0.2, height / 2 + cameraRef.current.y * 0.2);

        const cyanNebula = ctx.createRadialGradient(-350, -40, 50, -350, -40, 560);
        cyanNebula.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
        cyanNebula.addColorStop(0.5, 'rgba(14, 116, 144, 0.05)');
        cyanNebula.addColorStop(1, 'transparent');
        ctx.fillStyle = cyanNebula;
        ctx.beginPath();
        ctx.arc(-350, -40, 560, 0, Math.PI * 2);
        ctx.fill();

        const roseNebula = ctx.createRadialGradient(350, -40, 50, 350, -40, 560);
        roseNebula.addColorStop(0, 'rgba(255, 0, 127, 0.11)');
        roseNebula.addColorStop(0.5, 'rgba(159, 18, 57, 0.04)');
        roseNebula.addColorStop(1, 'transparent');
        ctx.fillStyle = roseNebula;
        ctx.beginPath();
        ctx.arc(350, -40, 560, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Parallax Starfield
        ctx.save();
        ctx.translate(width / 2 + cameraRef.current.x * 0.35, height / 2 + cameraRef.current.y * 0.35);

        starsRef.current.forEach(star => {
          const alpha = Math.max(0.1, Math.min(1, star.baseAlpha + Math.sin(animationTime * 1.8 + star.phase) * 0.3));

          if (star.layer === 3) {
            ctx.save();
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.shadowColor = '#38BDF8';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.75})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(star.x - star.spikeLength, star.y);
            ctx.lineTo(star.x + star.spikeLength, star.y);
            ctx.moveTo(star.x, star.y - star.spikeLength);
            ctx.lineTo(star.x, star.y + star.spikeLength);
            ctx.stroke();
            ctx.restore();
          } else {
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        });

        // Meteors
        meteorsRef.current.forEach(m => {
          ctx.save();
          const grad = ctx.createLinearGradient(m.x - m.dx * 6, m.y - m.dy * 6, m.x, m.y);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(0.7, `rgba(56, 189, 248, ${m.life * 0.6})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${m.life})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(m.x - m.dx * 6, m.y - m.dy * 6);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
          ctx.restore();
        });

        ctx.restore();
      } else if (graphTheme === 'onyx') {
        ctx.fillStyle = '#040405';
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.translate(width / 2 + cameraRef.current.x, height / 2 + cameraRef.current.y);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        const gridSize = 45;
        for (let gx = -1600; gx <= 1600; gx += gridSize) {
          for (let gy = -1600; gy <= 1600; gy += gridSize) {
            ctx.fillRect(gx - 1, gy - 1, 2, 2);
          }
        }
        ctx.restore();
      } else {
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.translate(width / 2 + cameraRef.current.x, height / 2 + cameraRef.current.y);
        ctx.fillStyle = '#E2E8F0';
        const gridSize = 40;
        for (let gx = -1600; gx <= 1600; gx += gridSize) {
          for (let gy = -1600; gy <= 1600; gy += gridSize) {
            ctx.fillRect(gx - 1, gy - 1, 2, 2);
          }
        }
        ctx.restore();
      }

      // B. World Space Transform
      ctx.save();
      ctx.translate(width / 2 + cameraRef.current.x, height / 2 + cameraRef.current.y);
      ctx.scale(cameraRef.current.zoom, cameraRef.current.zoom);

      // Galaxy Sector Labels
      if (activeTab === 'galaxy' && graphTheme !== 'paper') {
        ctx.save();
        ctx.font = "bold 12px 'Noto Sans', sans-serif";
        ctx.textAlign = 'center';

        ctx.fillStyle = 'rgba(0, 240, 255, 0.55)';
        ctx.fillText(`✦ ${t.mindmap.sectorWork} ✦`, -320, -220);

        ctx.fillStyle = 'rgba(255, 0, 127, 0.55)';
        ctx.fillText(`✦ ${t.mindmap.sectorJournal} ✦`, 320, -220);

        ctx.fillStyle = 'rgba(168, 85, 247, 0.55)';
        ctx.fillText(`✦ ${t.mindmap.sectorPlain} ✦`, 0, 380);
        ctx.restore();
      }

      // C. Draw Connectors / Bezier Edges
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.sourceId);
        const target = nodes.find(n => n.id === edge.targetId);
        if (!source || !target) return;

        const isHighlighted =
          cameraRef.current.hoveredNodeId === source.id ||
          cameraRef.current.hoveredNodeId === target.id ||
          selectedNodeId === source.id ||
          selectedNodeId === target.id;

        const sColor = NODE_COLORS[source.color || 'cyan'] || NODE_COLORS.cyan;
        const tColor = NODE_COLORS[target.color || 'cyan'] || NODE_COLORS.cyan;

        ctx.save();
        ctx.beginPath();

        let startX, startY, endX, endY;

        if (activeTab === 'freeform') {
          const sw = source.w || 140;
          const tw = target.w || 140;

          if (target.x >= source.x) {
            startX = source.x + sw / 2;
            startY = source.y;
            endX = target.x - tw / 2;
            endY = target.y;
          } else {
            startX = source.x - sw / 2;
            startY = source.y;
            endX = target.x + tw / 2;
            endY = target.y;
          }

          const dx = endX - startX;
          const dy = endY - startY;

          ctx.moveTo(startX, startY);
          if (Math.abs(dx) >= 30) {
            const cp1x = startX + dx * 0.5;
            const cp1y = startY;
            const cp2x = endX - dx * 0.5;
            const cp2y = endY;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
          } else {
            const cpDist = Math.max(50, Math.abs(dy) * 0.45);
            ctx.bezierCurveTo(startX + cpDist, startY, endX - cpDist, endY, endX, endY);
          }
        } else {
          startX = source.x;
          startY = source.y;
          endX = target.x;
          endY = target.y;

          const isCrossSector = source.sectorTarget && target.sectorTarget && source.mode !== target.mode;
          ctx.moveTo(startX, startY);
          if (isCrossSector) {
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2 - 35;
            ctx.quadraticCurveTo(midX, midY, endX, endY);
          } else {
            ctx.lineTo(endX, endY);
          }
        }

        if (graphTheme === 'cosmic') {
          const grad = ctx.createLinearGradient(startX, startY, endX, endY);
          grad.addColorStop(0, sColor.core);
          grad.addColorStop(1, tColor.core);
          ctx.strokeStyle = isHighlighted ? '#FFFFFF' : grad;
          ctx.lineWidth = isHighlighted ? 3.0 : 2.2;
          if (isHighlighted) {
            ctx.shadowColor = sColor.core;
            ctx.shadowBlur = 12;
          }
        } else if (graphTheme === 'onyx') {
          ctx.strokeStyle = isHighlighted ? '#10B981' : 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = isHighlighted ? 2.5 : 1.5;
        } else {
          ctx.strokeStyle = isHighlighted ? '#2563EB' : '#94A3B8';
          ctx.lineWidth = isHighlighted ? 2.4 : 1.4;
        }

        if (edge.type === 'tag') {
          ctx.setLineDash([4, 4]);
        }
        ctx.stroke();
        ctx.restore();

        // Traveling Photon Pulse on Connector
        if (graphTheme === 'cosmic') {
          const pulseT = (animationTime * 0.45 + (Math.abs(source.x) % 10) * 0.1) % 1.0;
          let px, py;

          if (activeTab === 'freeform') {
            const dx = endX - startX;
            const dy = endY - startY;
            let cp1x, cp1y, cp2x, cp2y;
            if (Math.abs(dx) >= 30) {
              cp1x = startX + dx * 0.5;
              cp1y = startY;
              cp2x = endX - dx * 0.5;
              cp2y = endY;
            } else {
              const cpDist = Math.max(50, Math.abs(dy) * 0.45);
              cp1x = startX + cpDist;
              cp1y = startY;
              cp2x = endX - cpDist;
              cp2y = endY;
            }
            const mt = 1 - pulseT;
            px = mt*mt*mt * startX + 3*mt*mt*pulseT * cp1x + 3*mt*pulseT*pulseT * cp2x + pulseT*pulseT*pulseT * endX;
            py = mt*mt*mt * startY + 3*mt*mt*pulseT * cp1y + 3*mt*pulseT*pulseT * cp2y + pulseT*pulseT*pulseT * endY;
          } else {
            px = startX + (endX - startX) * pulseT;
            py = startY + (endY - startY) * pulseT;
          }

          ctx.save();
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = tColor.core;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(px, py, 2.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // D. Active Connecting Wire (Drag or Two-Click Mode)
      const activeConnectingSource = cameraRef.current.connectingSourceNodeId || connectingFromId;
      if (activeConnectingSource) {
        const sourceNode = nodes.find(n => n.id === activeConnectingSource);
        if (sourceNode) {
          const sw = sourceNode.w || sourceNode.radius * 2 || 140;
          const startX = sourceNode.x + (activeTab === 'freeform' ? sw / 2 : 0);
          const startY = sourceNode.y;
          const targetPos = cameraRef.current.connectingPos;

          ctx.save();
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 2.8;
          ctx.setLineDash([6, 4]);
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 12;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          const dx = targetPos.x - startX;
          const cp1x = startX + dx * 0.5;
          const cp1y = startY;
          const cp2x = targetPos.x - dx * 0.5;
          const cp2y = targetPos.y;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetPos.x, targetPos.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      // E. Draw Nodes
      nodes.forEach(node => {
        const isHovered = cameraRef.current.hoveredNodeId === node.id;
        const isSelected = selectedNodeId === node.id;
        const isConnecting = activeConnectingSource === node.id;
        const colorScheme = NODE_COLORS[node.color || 'cyan'] || NODE_COLORS.cyan;

        ctx.save();

        if (activeTab === 'freeform') {
          // ================= FREEFORM MINDSET PILL CARD =================
          const w = node.w || 140;
          const h = node.h || 40;
          const rx = node.x - w / 2;
          const ry = node.y - h / 2;

          // Glowing Outer Halo on Selection or Hover (Always in node's chosen color)
          if (isSelected || isHovered || isConnecting) {
            ctx.save();
            ctx.shadowColor = colorScheme.core;
            ctx.shadowBlur = isSelected ? 24 : 12;
            ctx.strokeStyle = colorScheme.core;
            ctx.lineWidth = isSelected ? 2.8 : 1.8;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(rx - 2, ry - 2, w + 4, h + 4, 14);
            } else {
              ctx.rect(rx - 2, ry - 2, w + 4, h + 4);
            }
            ctx.stroke();
            ctx.restore();
          }

          // Main Pill Card Background
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(rx, ry, w, h, 12);
          } else {
            ctx.rect(rx, ry, w, h);
          }

          if (graphTheme === 'cosmic') {
            const bgGrad = ctx.createLinearGradient(rx, ry, rx + w, ry + h);
            bgGrad.addColorStop(0, colorScheme.pillBg || 'rgba(0, 240, 255, 0.35)');
            bgGrad.addColorStop(1, 'rgba(10, 16, 32, 0.88)');
            ctx.fillStyle = bgGrad;
            ctx.fill();
            ctx.lineWidth = isSelected ? 2.8 : 2.0;
            ctx.strokeStyle = colorScheme.core;
            ctx.stroke();
          } else if (graphTheme === 'onyx') {
            const bgGrad = ctx.createLinearGradient(rx, ry, rx + w, ry + h);
            bgGrad.addColorStop(0, colorScheme.pillBg || 'rgba(0, 240, 255, 0.30)');
            bgGrad.addColorStop(1, '#111217');
            ctx.fillStyle = bgGrad;
            ctx.fill();
            ctx.lineWidth = isSelected ? 2.8 : 2.0;
            ctx.strokeStyle = colorScheme.core;
            ctx.stroke();
          } else {
            const bgGrad = ctx.createLinearGradient(rx, ry, rx + w, ry + h);
            bgGrad.addColorStop(0, colorScheme.pillBg || 'rgba(0, 240, 255, 0.20)');
            bgGrad.addColorStop(1, '#FFFFFF');
            ctx.fillStyle = bgGrad;
            ctx.fill();
            ctx.lineWidth = isSelected ? 2.8 : 2.0;
            ctx.strokeStyle = colorScheme.core;
            ctx.stroke();
          }

          // Sleek selection bracket outside (does not mask node's vibrant color)
          if (isSelected) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(rx - 5, ry - 5, w + 10, h + 10, 16);
            } else {
              ctx.rect(rx - 5, ry - 5, w + 10, h + 10);
            }
            ctx.stroke();
            ctx.restore();
          }

          // Left Accent Stripe & Accent Dot in Node Color
          ctx.save();
          ctx.fillStyle = colorScheme.core;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(rx + 4, ry + 6, 4, h - 12, 2);
          } else {
            ctx.rect(rx + 4, ry + 6, 4, h - 12);
          }
          ctx.fill();

          ctx.beginPath();
          ctx.arc(rx + 17, node.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Node Text inside Pill
          ctx.save();
          ctx.fillStyle = graphTheme === 'paper' ? '#0F172A' : '#FFFFFF';
          ctx.font = node.isRoot
            ? "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            : "600 12.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 3;
          ctx.fillText(node.text || 'Idea', rx + 28, node.y);
          ctx.restore();

          // Connection Handle Badge (+) on Right Edge
          if (isHovered || isSelected || isConnecting) {
            const handleX = rx + w + 10;
            const handleY = node.y;
            ctx.save();
            ctx.fillStyle = colorScheme.core;
            ctx.shadowColor = colorScheme.core;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(handleX, handleY, 9, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('+', handleX, handleY);
            ctx.restore();
          }
        } else {
          // ================= GALAXY MODE SPHERICAL NODE =================
          const radius = node.radius || 26;

          if (graphTheme === 'cosmic') {
            const glowGrad = ctx.createRadialGradient(
              node.x, node.y, radius * 0.4,
              node.x, node.y, radius * (isHovered || isSelected ? 2.5 : 2.0)
            );
            glowGrad.addColorStop(0, colorScheme.core);
            glowGrad.addColorStop(0.6, colorScheme.halo);
            glowGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius * (isHovered || isSelected ? 2.5 : 2.0), 0, Math.PI * 2);
            ctx.fill();
          }

          if (isSelected || node.isActive) {
            ctx.save();
            ctx.strokeStyle = '#FCD34D';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

          if (graphTheme === 'cosmic') {
            const bodyGrad = ctx.createRadialGradient(
              node.x - radius * 0.3, node.y - radius * 0.3, radius * 0.1,
              node.x, node.y, radius
            );
            bodyGrad.addColorStop(0, '#FFFFFF');
            bodyGrad.addColorStop(0.4, colorScheme.core);
            bodyGrad.addColorStop(1, colorScheme.bg);
            ctx.fillStyle = bodyGrad;
            ctx.fill();
            ctx.lineWidth = isHovered ? 2.5 : 1.5;
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
          } else if (graphTheme === 'onyx') {
            ctx.fillStyle = '#141416';
            ctx.fill();
            ctx.lineWidth = isHovered ? 3 : 2;
            ctx.strokeStyle = colorScheme.core;
            ctx.stroke();
          } else {
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.lineWidth = isHovered ? 2.5 : 2;
            ctx.strokeStyle = colorScheme.core;
            ctx.stroke();
          }

          ctx.fillStyle = graphTheme === 'paper' ? '#0F172A' : '#FFFFFF';
          ctx.font = `bold ${Math.round(radius * 0.65)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const symbol = node.mode === 'work' ? '💼' : node.mode === 'journal' ? '📖' : '📄';
          ctx.fillText(symbol, node.x, node.y);

          const labelY = node.y + radius + 14;
          const displayTitle = (node.title || '').length > 22 ? (node.title || '').slice(0, 20) + '…' : (node.title || '');

          ctx.font = `${isHovered ? 'bold ' : ''}11px 'Noto Sans', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          if (graphTheme !== 'paper') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            const textMetrics = ctx.measureText(displayTitle);
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(node.x - textMetrics.width / 2 - 5, labelY - 2, textMetrics.width + 10, 16, 4);
            } else {
              ctx.rect(node.x - textMetrics.width / 2 - 5, labelY - 2, textMetrics.width + 10, 16);
            }
            ctx.fill();
          }

          ctx.fillStyle = graphTheme === 'paper' ? '#1E293B' : '#F8FAFC';
          ctx.fillText(displayTitle, node.x, labelY);
        }

        ctx.restore();
      });

      ctx.restore();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, graphTheme, searchQuery, isPhysicsRunning, galaxyGraphData, currentMindset, activeTab, selectedNodeId, connectingFromId, galaxyPositions, t]);

  // Hit Test: Find node at world coordinate
  const findNodeAtWorld = (worldX, worldY) => {
    return liveNodesRef.current.find(n => {
      if (activeTab === 'freeform') {
        const w = n.w || 140;
        const h = n.h || 40;
        return (
          worldX >= n.x - w / 2 - 6 &&
          worldX <= n.x + w / 2 + 6 &&
          worldY >= n.y - h / 2 - 6 &&
          worldY <= n.y + h / 2 + 6
        );
      } else {
        const radius = n.radius || 26;
        return Math.hypot(n.x - worldX, n.y - worldY) <= radius + 6;
      }
    });
  };

  // Hit Test: Find handle (+) at world coordinate
  const findHandleAtWorld = (worldX, worldY) => {
    return liveNodesRef.current.find(n => {
      if (activeTab === 'freeform') {
        const w = n.w || 140;
        const handleX = n.x + w / 2 + 10;
        const handleY = n.y;
        return Math.hypot(handleX - worldX, handleY - worldY) <= 15;
      } else {
        const handleX = n.x + (n.radius || 26) * 0.8;
        const handleY = n.y - (n.radius || 26) * 0.8;
        return Math.hypot(handleX - worldX, handleY - worldY) <= 14;
      }
    });
  };

  // Pointer Down (CRITICAL: Ignore if clicked on an HTML overlay)
  const handlePointerDown = (e) => {
    if (e.target !== canvasRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - rect.width / 2 - cameraRef.current.x) / cameraRef.current.zoom;
    const worldY = (mouseY - rect.height / 2 - cameraRef.current.y) / cameraRef.current.zoom;

    cameraRef.current.dragOrigin = { x: mouseX, y: mouseY };
    cameraRef.current.hasMoved = false;

    // Check if clicked the connect handle badge (+)
    const clickedHandleNode = findHandleAtWorld(worldX, worldY);
    if (clickedHandleNode) {
      cameraRef.current.connectingSourceNodeId = clickedHandleNode.id;
      cameraRef.current.connectingPos = { x: worldX, y: worldY };
      return;
    }

    // Check if clicked directly on a node body
    const clickedNode = findNodeAtWorld(worldX, worldY);
    if (clickedNode) {
      cameraRef.current.draggedNodeId = clickedNode.id;
    } else {
      cameraRef.current.isDraggingCanvas = true;
      cameraRef.current.dragStart = { x: mouseX - cameraRef.current.x, y: mouseY - cameraRef.current.y };
    }
  };

  // Pointer Move
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const distMoved = Math.hypot(mouseX - cameraRef.current.dragOrigin.x, mouseY - cameraRef.current.dragOrigin.y);
    if (distMoved > 4) {
      cameraRef.current.hasMoved = true;
    }

    const worldX = (mouseX - rect.width / 2 - cameraRef.current.x) / cameraRef.current.zoom;
    const worldY = (mouseY - rect.height / 2 - cameraRef.current.y) / cameraRef.current.zoom;

    // A. Connecting Wire Drag or Two-Click Mode
    if (cameraRef.current.connectingSourceNodeId || connectingFromId) {
      cameraRef.current.connectingPos = { x: worldX, y: worldY };
      return;
    }

    // B. Canvas Panning
    if (cameraRef.current.isDraggingCanvas) {
      cameraRef.current.x = mouseX - cameraRef.current.dragStart.x;
      cameraRef.current.y = mouseY - cameraRef.current.dragStart.y;
      return;
    }

    // C. Node Dragging
    if (cameraRef.current.draggedNodeId) {
      const dragged = liveNodesRef.current.find(n => n.id === cameraRef.current.draggedNodeId);
      if (dragged) {
        dragged.x = worldX;
        dragged.y = worldY;
        dragged.vx = 0;
        dragged.vy = 0;

        if (activeTab === 'freeform') {
          // Update active tab data
          setMindsetTabs(prev =>
            prev.map(tab => {
              if (tab.id !== activeMindsetId) return tab;
              return {
                ...tab,
                data: {
                  ...tab.data,
                  nodes: tab.data.nodes.map(n => n.id === dragged.id ? { ...n, x: worldX, y: worldY } : n)
                }
              };
            })
          );
        } else {
          // Save Galaxy custom position
          setGalaxyPositions(prev => ({
            ...prev,
            [dragged.id]: { x: worldX, y: worldY }
          }));
        }
      }
      return;
    }

    // D. Hover Detection
    const found = findNodeAtWorld(worldX, worldY);
    cameraRef.current.hoveredNodeId = found ? found.id : null;
  };

  // Pointer Up (CRITICAL: Ignore if clicked on an HTML overlay)
  const handlePointerUp = (e) => {
    if (e.target !== canvasRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - rect.width / 2 - cameraRef.current.x) / cameraRef.current.zoom;
    const worldY = (mouseY - rect.height / 2 - cameraRef.current.y) / cameraRef.current.zoom;

    // 1. Finish Handle Drag Connection
    if (cameraRef.current.connectingSourceNodeId) {
      const targetNode = liveNodesRef.current.find(n => {
        return n.id !== cameraRef.current.connectingSourceNodeId && findNodeAtWorld(worldX, worldY)?.id === n.id;
      });

      if (targetNode) {
        sound.playConnect();
        const sourceId = cameraRef.current.connectingSourceNodeId;
        const targetId = targetNode.id;

        if (activeTab === 'galaxy') {
          setCustomNoteEdges(prev => [...prev, { sourceId, targetId }]);
        } else {
          setMindsetTabs(prev =>
            prev.map(tab => {
              if (tab.id !== activeMindsetId) return tab;
              const exists = tab.data.edges.some(
                edge => (edge.sourceId === sourceId && edge.targetId === targetId) ||
                        (edge.sourceId === targetId && edge.targetId === sourceId)
              );
              if (exists) return tab;
              return {
                ...tab,
                data: {
                  ...tab.data,
                  edges: [...tab.data.edges, { id: `e-${Date.now()}`, sourceId, targetId }]
                }
              };
            })
          );
        }
      }

      cameraRef.current.connectingSourceNodeId = null;
      return;
    }

    // 2. Was it a Drag Reposition?
    if (cameraRef.current.hasMoved) {
      cameraRef.current.draggedNodeId = null;
      cameraRef.current.isDraggingCanvas = false;
      return;
    }

    // 3. Two-Click Connection Finish
    if (connectingFromId) {
      const clickedTarget = findNodeAtWorld(worldX, worldY);
      if (clickedTarget && clickedTarget.id !== connectingFromId) {
        sound.playConnect();
        const sourceId = connectingFromId;
        const targetId = clickedTarget.id;

        if (activeTab === 'galaxy') {
          setCustomNoteEdges(prev => [...prev, { sourceId, targetId }]);
        } else {
          setMindsetTabs(prev =>
            prev.map(tab => {
              if (tab.id !== activeMindsetId) return tab;
              const exists = tab.data.edges.some(
                edge => (edge.sourceId === sourceId && edge.targetId === targetId) ||
                        (edge.sourceId === targetId && edge.targetId === sourceId)
              );
              if (exists) return tab;
              return {
                ...tab,
                data: {
                  ...tab.data,
                  edges: [...tab.data.edges, { id: `e-${Date.now()}`, sourceId, targetId }]
                }
              };
            })
          );
        }
        setConnectingFromId(null);
        setSelectedNodeId(targetId);
        return;
      }
    }

    // 4. Static Node Click
    const clickedNode = findNodeAtWorld(worldX, worldY);
    if (clickedNode) {
      sound.playPop();
      setSelectedNodeId(clickedNode.id);
    } else {
      setSelectedNodeId(null);
      setEditingNodeId(null);
      setConnectingFromId(null);
    }

    cameraRef.current.draggedNodeId = null;
    cameraRef.current.isDraggingCanvas = false;
  };

  // Double Click Canvas
  const handleDoubleClick = (e) => {
    if (e.target !== canvasRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - rect.width / 2 - cameraRef.current.x) / cameraRef.current.zoom;
    const worldY = (mouseY - rect.height / 2 - cameraRef.current.y) / cameraRef.current.zoom;

    const clickedNode = findNodeAtWorld(worldX, worldY);
    if (clickedNode) {
      if (activeTab === 'freeform') {
        setSelectedNodeId(clickedNode.id);
        setEditingNodeId(clickedNode.id);
        setEditingText(clickedNode.text || '');
      } else {
        onSelectNote(clickedNode.id);
        onClose();
      }
      return;
    }

    if (activeTab === 'freeform') {
      handleAddThought(worldX, worldY);
    }
  };

  // Add Independent Thought
  const handleAddThought = (customX, customY) => {
    const newNodeId = `f-${Date.now()}`;
    const colors = ['cyan', 'rose', 'amber', 'emerald', 'violet'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const spawnX = customX !== undefined ? customX : -cameraRef.current.x / cameraRef.current.zoom + (Math.random() - 0.5) * 60;
    const spawnY = customY !== undefined ? customY : -cameraRef.current.y / cameraRef.current.zoom + (Math.random() - 0.5) * 60;

    const defaultText = isTr ? 'Yeni Fikir' : 'New Thought';

    const newNode = {
      id: newNodeId,
      text: defaultText,
      x: spawnX,
      y: spawnY,
      color: randomColor,
      w: 140,
      h: 40,
      isRoot: true,
      vx: 0,
      vy: 0
    };

    liveNodesRef.current.push(newNode);

    setMindsetTabs(prev =>
      prev.map(tab => {
        if (tab.id !== activeMindsetId) return tab;
        return {
          ...tab,
          data: {
            ...tab.data,
            nodes: [...(tab.data?.nodes || []), newNode]
          }
        };
      })
    );

    sound.playPop();
    setSelectedNodeId(newNodeId);
    setEditingNodeId(newNodeId);
    setEditingText(defaultText);
  };

  // Add Branch to Selected Node
  const handleAddBranch = () => {
    if (!selectedNodeId) return;
    const parent = liveNodesRef.current.find(n => n.id === selectedNodeId);
    if (!parent) return;

    const currentEdges = currentMindset?.data?.edges || [];
    const existingChildren = currentEdges.filter(e => e.sourceId === parent.id);
    const childCount = existingChildren.length;
    const yOffset = childCount === 0 ? 0 : childCount % 2 === 1 ? Math.ceil(childCount / 2) * 55 : -Math.ceil(childCount / 2) * 55;

    const newNodeId = `f-${Date.now()}`;
    const defaultText = isTr ? 'Yeni Dal' : 'New Branch';

    const newChild = {
      id: newNodeId,
      text: defaultText,
      x: parent.x + 220,
      y: parent.y + yOffset,
      color: parent.color || 'cyan',
      w: 140,
      h: 40,
      vx: 0,
      vy: 0
    };

    const newEdge = {
      id: `e-${Date.now()}`,
      sourceId: parent.id,
      targetId: newNodeId
    };

    liveNodesRef.current.push(newChild);

    setMindsetTabs(prev =>
      prev.map(tab => {
        if (tab.id !== activeMindsetId) return tab;
        return {
          ...tab,
          data: {
            ...tab.data,
            nodes: [...(tab.data?.nodes || []), newChild],
            edges: [...(tab.data?.edges || []), newEdge]
          }
        };
      })
    );

    sound.playPop();
    setSelectedNodeId(newNodeId);
    setEditingNodeId(newNodeId);
    setEditingText(defaultText);
  };

  // Delete Selected Node
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    sound.playPop();

    liveNodesRef.current = liveNodesRef.current.filter(n => n.id !== selectedNodeId);

    if (activeTab === 'freeform') {
      setMindsetTabs(prev =>
        prev.map(tab => {
          if (tab.id !== activeMindsetId) return tab;
          return {
            ...tab,
            data: {
              ...tab.data,
              nodes: tab.data.nodes.filter(n => n.id !== selectedNodeId),
              edges: tab.data.edges.filter(e => e.sourceId !== selectedNodeId && e.targetId !== selectedNodeId)
            }
          };
        })
      );
    } else {
      setCustomNoteEdges(prev => prev.filter(e => e.sourceId !== selectedNodeId && e.targetId !== selectedNodeId));
    }

    setSelectedNodeId(null);
    setEditingNodeId(null);
    setConnectingFromId(null);
  };

  // Change Selected Node Color
  const handleChangeColor = (colorName) => {
    if (!selectedNodeId) return;
    sound.playPop();

    const node = liveNodesRef.current.find(n => n.id === selectedNodeId);
    if (node) {
      node.color = colorName;
    }

    setMindsetTabs(prev =>
      prev.map(tab => {
        if (tab.id !== activeMindsetId) return tab;
        return {
          ...tab,
          data: {
            ...tab.data,
            nodes: (tab.data?.nodes || []).map(n => n.id === selectedNodeId ? { ...n, color: colorName } : n)
          }
        };
      })
    );
    setColorTick(t => t + 1);
  };

  // Commit Node Text Edit
  const handleCommitEdit = () => {
    if (!editingNodeId) return;
    const finalVal = editingText.trim() || (isTr ? 'Fikir' : 'Thought');

    const node = liveNodesRef.current.find(n => n.id === editingNodeId);
    if (node) {
      node.text = finalVal;
      const { w, h } = calculateNodeDimensions(node);
      node.w = w;
      node.h = h;
    }

    setMindsetTabs(prev =>
      prev.map(tab => {
        if (tab.id !== activeMindsetId) return tab;
        return {
          ...tab,
          data: {
            ...tab.data,
            nodes: tab.data.nodes.map(n => n.id === editingNodeId ? { ...n, text: finalVal } : n)
          }
        };
      })
    );

    setEditingNodeId(null);
  };

  // Create New Mindset Tab
  const handleCreateNewTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const newTabNum = mindsetTabs.length;
    const newTitle = isTr ? `💡 Zihin Haritam ${newTabNum}` : `💡 My Mindset ${newTabNum}`;

    const initialRootId = `n-${Date.now()}`;
    const defaultText = isTr ? 'Ana Düşünce' : 'Main Idea';

    const newTab = {
      id: newTabId,
      title: newTitle,
      isExample: false,
      data: {
        nodes: [
          {
            id: initialRootId,
            text: defaultText,
            x: 0,
            y: 0,
            color: 'cyan',
            isRoot: true,
            w: 150,
            h: 46
          }
        ],
        edges: []
      }
    };

    setMindsetTabs(prev => [...prev, newTab]);
    setActiveMindsetId(newTabId);
    setSelectedNodeId(initialRootId);
    setEditingNodeId(initialRootId);
    setEditingText(defaultText);
    sound.playPop();
    handleResetCamera();
  };

  // Delete Custom Mindset Tab
  const handleDeleteTab = (tabId, e) => {
    e.stopPropagation();
    if (confirm(t.mindmap.deleteTabConfirm)) {
      const remaining = mindsetTabs.filter(tab => tab.id !== tabId);
      setMindsetTabs(remaining);
      if (activeMindsetId === tabId) {
        setActiveMindsetId(remaining[0]?.id || 'tab-cambridge');
      }
      sound.playPop();
    }
  };

  // Export Canvas as PNG Snapshot
  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `lexinote-${activeTab}-${Date.now()}.png`;
      a.click();
      sound.playPop();
    } catch (e) {
      console.error(e);
    }
  };

  // Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    cameraRef.current.zoom = Math.max(0.25, Math.min(3.2, cameraRef.current.zoom * zoomFactor));
  };

  const handleResetCamera = () => {
    cameraRef.current = {
      x: 0,
      y: 0,
      zoom: 1.0,
      isDraggingCanvas: false,
      dragStart: { x: 0, y: 0 },
      dragOrigin: { x: 0, y: 0 },
      hasMoved: false,
      draggedNodeId: null,
      connectingSourceNodeId: null,
      connectingPos: { x: 0, y: 0 },
      hoveredNodeId: null
    };
    setSelectedNodeId(null);
    setEditingNodeId(null);
    setConnectingFromId(null);
  };

  if (!isOpen) return null;

  const selectedNode = liveNodesRef.current.find(n => n.id === selectedNodeId);
  const connectingNode = liveNodesRef.current.find(n => n.id === connectingFromId);

  // Compute selected node screen position
  let screenPos = null;
  if (selectedNode && containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();
    const sx = rect.width / 2 + cameraRef.current.x + selectedNode.x * cameraRef.current.zoom;
    const sy = rect.height / 2 + cameraRef.current.y + selectedNode.y * cameraRef.current.zoom;
    screenPos = { x: sx, y: sy };
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Top HUD Header */}
      <header className="h-16 px-4 sm:px-6 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between z-20 text-white">
        
        {/* Left: Branding & Functional Canvas Tools */}
        <div className="flex items-center gap-3">
          {/* Functional Export PNG Snapshot Button */}
          <button
            onClick={handleExportPng}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={t.mindmap.exportPng}
          >
            <Camera className="w-5 h-5 text-white" />
          </button>

          {/* Mode Switcher Tabs (Freeform Studio vs Notes Galaxy) */}
          <div className="flex items-center p-1 rounded-xl bg-white/10 border border-white/10 text-xs">
            <button
              onClick={() => {
                setActiveTab('freeform');
                setSelectedNodeId(null);
                setEditingNodeId(null);
                setConnectingFromId(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'freeform'
                  ? 'bg-gradient-to-r from-fuchsia-500 to-rose-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>✨</span>
              <span>{t.mindmap.tabFreeform}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('galaxy');
                setSelectedNodeId(null);
                setEditingNodeId(null);
                setConnectingFromId(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'galaxy'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>🪐</span>
              <span>{t.mindmap.tabGalaxy}</span>
            </button>
          </div>
        </div>

        {/* Center: Freeform Mindset Controls & Search */}
        <div className="hidden lg:flex items-center gap-2">
          {activeTab === 'freeform' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAddThought()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{t.mindmap.addThought}</span>
              </button>

              <button
                onClick={handleCreateNewTab}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-colors cursor-pointer"
                title={t.mindmap.newTab}
              >
                <FolderPlus className="w-4 h-4 text-cyan-400" />
                <span>{t.mindmap.newTab}</span>
              </button>
            </div>
          ) : (
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.mindmap.searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}
        </div>

        {/* Right: Theme Selector, Interactive Help & Close */}
        <div className="flex items-center gap-2">
          {/* Interactive Help & User Guide Button */}
          {onOpenHelpGuide && (
            <button
              onClick={onOpenHelpGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-sky-500/20 text-sky-400 border border-white/10 text-xs font-bold transition-all cursor-pointer"
              title={t.mindmap.helpGuide}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t.mindmap.helpGuide}</span>
            </button>
          )}

          {/* Theme Selector */}
          <div className="flex items-center p-1 rounded-xl bg-white/10 border border-white/10 text-xs">
            <button
              onClick={() => setGraphTheme('cosmic')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                graphTheme === 'cosmic' ? 'bg-cyan-500 text-white shadow-xs' : 'text-white/60 hover:text-white'
              }`}
            >
              <span>🌌 Space</span>
            </button>
            <button
              onClick={() => setGraphTheme('onyx')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                graphTheme === 'onyx' ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs' : 'text-white/60 hover:text-white'
              }`}
            >
              <span>⬛ Onyx</span>
            </button>
          </div>

          {/* Close Mindmap */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-white/10 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MULTIPLE MINDSET TABS BAR (When in Freeform Studio mode) */}
      {activeTab === 'freeform' && (
        <div className="h-11 px-4 sm:px-6 bg-black/60 border-b border-white/10 flex items-center gap-2 overflow-x-auto z-15 text-white">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider hidden sm:inline mr-1">
            {isTr ? 'Haritalar:' : 'Mindsets:'}
          </span>

          {mindsetTabs.map(tab => {
            const isActive = tab.id === activeMindsetId;
            return (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveMindsetId(tab.id);
                  setSelectedNodeId(null);
                  setEditingNodeId(null);
                  setConnectingFromId(null);
                  sound.playPop();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.title}</span>

                {/* Reset button for example tab */}
                {tab.isExample && isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(isTr ? 'Cambridge örnek haritası başlangıç durumuna döndürülsün mü?' : 'Reset Cambridge example to original state?')) {
                        const original = GET_DEFAULT_FREEFORM_MINDSET(appLanguage);
                        setMindsetTabs(prev =>
                          prev.map(tItem => tItem.id === tab.id ? { ...tItem, data: original } : tItem)
                        );
                        liveNodesRef.current = original.nodes.map(n => ({ ...n, w: 140, h: 40, vx: 0, vy: 0 }));
                        setSelectedNodeId(null);
                        sound.playPop();
                      }
                    }}
                    className="p-0.5 text-white/40 hover:text-white ml-1"
                    title={isTr ? 'Şablonu Sıfırla' : 'Reset Template'}
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}

                {/* Delete button for user custom tabs */}
                {!tab.isExample && (
                  <button
                    onClick={(e) => handleDeleteTab(tab.id, e)}
                    className="p-0.5 text-white/40 hover:text-rose-400 rounded-md transition-colors ml-1"
                    title={isTr ? 'Sekmeyi Sil' : 'Delete Tab'}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Plus Add New Mindset Tab Button */}
          <button
            onClick={handleCreateNewTab}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-dashed border-white/20 text-xs text-white/70 hover:text-white transition-all cursor-pointer whitespace-nowrap"
            title={t.mindmap.newTab}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{t.mindmap.newTab}</span>
          </button>
        </div>
      )}

      {/* Main Canvas Workspace */}
      <div
        ref={containerRef}
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Two-Click Connection Mode Top Banner */}
        {connectingFromId && connectingNode && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-5 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl bg-cyan-950/95 border-2 border-cyan-400 text-white shadow-2xl backdrop-blur-xl flex items-center gap-3 z-30 animate-in fade-in slide-in-from-top-4"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold">
              {t.mindmap.connectingInstruction}:{' '}
              <span className="text-cyan-300 font-extrabold">{connectingNode.text || connectingNode.title}</span> ➔ ...
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConnectingFromId(null);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer border border-white/20"
            >
              {t.mindmap.cancelConnect}
            </button>
          </div>
        )}

        {/* FLOATING ACTION TOOLBAR ATTACHED DIRECTLY TO SELECTED NODE */}
        {selectedNode && screenPos && !connectingFromId && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            className="absolute z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-950/95 border border-white/25 text-white shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 pointer-events-auto"
            style={{
              left: `${screenPos.x}px`,
              top: `${screenPos.y - (selectedNode.h ? selectedNode.h * cameraRef.current.zoom / 2 : 24) - 52}px`,
              transform: 'translateX(-50%)'
            }}
          >
            {activeTab === 'freeform' ? (
              <>
                {/* Edit Text Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingNodeId(selectedNode.id);
                    setEditingText(selectedNode.text || '');
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-all active:scale-95"
                  title={t.mindmap.editNode}
                >
                  <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.mindmap.editNode}</span>
                </button>

                {/* Add Child Branch Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddBranch();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:opacity-90 text-white text-xs font-bold cursor-pointer shadow-md transition-all active:scale-95"
                  title={t.mindmap.addBranch}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.mindmap.addBranch}</span>
                </button>

                {/* Two-Click Connect Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConnectingFromId(selectedNode.id);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-all active:scale-95"
                  title={t.mindmap.connectNodes}
                >
                  <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.mindmap.connectNodes}</span>
                </button>

                {/* Color Palette Dots */}
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-xl border border-white/20 shadow-inner"
                >
                  {Object.keys(NODE_COLORS).map(cKey => (
                    <button
                      key={cKey}
                      type="button"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleChangeColor(cKey);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeColor(cKey);
                      }}
                      className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        (selectedNode.color || 'cyan') === cKey
                          ? 'ring-2 ring-white scale-110 shadow-lg'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: NODE_COLORS[cKey].core }}
                      title={cKey}
                    >
                      {(selectedNode.color || 'cyan') === cKey && (
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Delete Node Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSelected();
                  }}
                  className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 cursor-pointer transition-all active:scale-95"
                  title={t.mindmap.deleteNode}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                {/* Galaxy Mode Floating Node Card */}
                <span className="font-extrabold text-xs px-2 text-cyan-300 truncate max-w-[180px]">
                  {selectedNode.title}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNote(selectedNode.id);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t.mindmap.openInEditor}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConnectingFromId(selectedNode.id);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                  title={t.mindmap.connectNodes}
                >
                  <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.mindmap.connectNodes}</span>
                </button>
              </>
            )}

            {/* Close Toolbar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNodeId(null);
                setEditingNodeId(null);
              }}
              className="p-1 text-white/50 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* INLINE TEXT EDITOR DIRECTLY OVER SELECTED NODE */}
        {editingNodeId && selectedNode && screenPos && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="absolute z-40 pointer-events-auto"
            style={{
              left: `${screenPos.x}px`,
              top: `${screenPos.y}px`,
              transform: 'translate(-50%, -50%)',
              width: `${Math.max(160, (selectedNode.w || 140) * cameraRef.current.zoom + 24)}px`,
              height: `${(selectedNode.h || 40) * cameraRef.current.zoom + 8}px`
            }}
          >
            <input
              ref={editInputRef}
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCommitEdit();
                if (e.key === 'Escape') setEditingNodeId(null);
              }}
              onBlur={handleCommitEdit}
              placeholder={t.mindmap.editLabelPlaceholder}
              className="w-full h-full px-4 rounded-2xl bg-zinc-950/95 border-2 border-cyan-400 text-white font-bold text-xs shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 backdrop-blur-md"
            />
          </div>
        )}

        {/* Floating Zoom & Camera HUD (Bottom-Right) */}
        <div className="absolute bottom-5 right-5 flex flex-col gap-1.5 z-20">
          <button
            onClick={() => {
              cameraRef.current.zoom = Math.min(3.2, cameraRef.current.zoom * 1.25);
            }}
            className="p-2.5 rounded-xl bg-black/60 border border-white/15 text-white hover:bg-white/20 transition-all backdrop-blur-md cursor-pointer"
            title={t.mindmap.zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              cameraRef.current.zoom = Math.max(0.25, cameraRef.current.zoom * 0.8);
            }}
            className="p-2.5 rounded-xl bg-black/60 border border-white/15 text-white hover:bg-white/20 transition-all backdrop-blur-md cursor-pointer"
            title={t.mindmap.zoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetCamera}
            className="p-2.5 rounded-xl bg-black/60 border border-white/15 text-white hover:bg-white/20 transition-all backdrop-blur-md cursor-pointer"
            title={t.mindmap.resetView}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {activeTab === 'galaxy' && (
            <button
              onClick={() => setIsPhysicsRunning(!isPhysicsRunning)}
              className={`p-2.5 rounded-xl border transition-all backdrop-blur-md cursor-pointer ${
                isPhysicsRunning
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                  : 'bg-black/60 border-white/15 text-white'
              }`}
              title={isPhysicsRunning ? t.mindmap.pausePhysics : t.mindmap.resumePhysics}
            >
              {isPhysicsRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Bottom Hint Pill */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/75 border border-white/15 text-white/80 text-xs backdrop-blur-md pointer-events-none z-20 hidden sm:block">
          {t.mindmap.hintDrag}
        </div>
      </div>
    </div>
  );
}

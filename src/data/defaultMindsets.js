// Localized Default Mindsets (Strictly: Cambridge -> Cambridge University -> Raspberry Pi -> Affordable Computers)
export const GET_DEFAULT_FREEFORM_MINDSET = (lang = 'en') => {
  const isTr = lang === 'tr';
  return {
    nodes: [
      {
        id: 'node-cambridge',
        text: 'Cambridge',
        x: -360,
        y: 0,
        color: 'cyan',
        isRoot: true
      },
      {
        id: 'node-uni',
        text: isTr ? 'Cambridge Üniversitesi' : 'Cambridge University',
        x: -90,
        y: 0,
        color: 'cyan'
      },
      {
        id: 'node-rpi',
        text: 'Raspberry Pi',
        x: 170,
        y: 0,
        color: 'rose'
      },
      {
        id: 'node-cheap-pc',
        text: isTr ? 'Ucuz Bilgisayarlar (25$)' : 'Affordable Computers ($25)',
        x: 440,
        y: -50,
        color: 'emerald'
      },
      {
        id: 'node-stem',
        text: isTr ? 'Çocuklar için Kodlama & STEM' : 'Coding for Kids & STEM',
        x: 440,
        y: 55,
        color: 'amber'
      }
    ],
    edges: [
      { id: 'e-cambridge-uni', sourceId: 'node-cambridge', targetId: 'node-uni' },
      { id: 'e-uni-rpi', sourceId: 'node-uni', targetId: 'node-rpi' },
      { id: 'e-rpi-cheap-pc', sourceId: 'node-rpi', targetId: 'node-cheap-pc' },
      { id: 'e-rpi-stem', sourceId: 'node-rpi', targetId: 'node-stem' }
    ]
  };
};

export const GET_INITIAL_MINDSET_TABS = (lang = 'en') => {
  const isTr = lang === 'tr';
  return [
    {
      id: 'tab-cambridge',
      title: isTr ? '🎓 Cambridge (Örnek)' : '🎓 Cambridge (Example)',
      isExample: true,
      data: GET_DEFAULT_FREEFORM_MINDSET(lang)
    },
    {
      id: 'tab-user-1',
      title: isTr ? '💡 Zihin Haritam 1' : '💡 My Mindset 1',
      isExample: false,
      data: {
        nodes: [
          {
            id: 'node-user-root',
            text: isTr ? 'Ana Düşünce' : 'Main Idea',
            x: 0,
            y: 0,
            color: 'cyan',
            isRoot: true
          }
        ],
        edges: []
      }
    }
  ];
};

export const NODE_COLORS = {
  cyan: {
    core: '#00F0FF',
    halo: 'rgba(0, 240, 255, 0.55)',
    border: '#00F0FF',
    bg: '#082F49',
    pillBg: 'rgba(0, 240, 255, 0.24)',
    text: '#FFFFFF'
  },
  rose: {
    core: '#FF1493',
    halo: 'rgba(255, 20, 147, 0.55)',
    border: '#FF1493',
    bg: '#4C0519',
    pillBg: 'rgba(255, 20, 147, 0.24)',
    text: '#FFFFFF'
  },
  amber: {
    core: '#F59E0B',
    halo: 'rgba(245, 158, 11, 0.55)',
    border: '#FBBF24',
    bg: '#451A03',
    pillBg: 'rgba(245, 158, 11, 0.24)',
    text: '#FFFFFF'
  },
  emerald: {
    core: '#10B981',
    halo: 'rgba(16, 185, 129, 0.55)',
    border: '#10B981',
    bg: '#064E3B',
    pillBg: 'rgba(16, 185, 129, 0.24)',
    text: '#FFFFFF'
  },
  violet: {
    core: '#A855F7',
    halo: 'rgba(168, 85, 247, 0.55)',
    border: '#C084FC',
    bg: '#3B0764',
    pillBg: 'rgba(168, 85, 247, 0.24)',
    text: '#FFFFFF'
  },
  slate: {
    core: '#94A3B8',
    halo: 'rgba(148, 163, 184, 0.45)',
    border: '#CBD5E1',
    bg: '#1E293B',
    pillBg: 'rgba(148, 163, 184, 0.20)',
    text: '#FFFFFF'
  }
};

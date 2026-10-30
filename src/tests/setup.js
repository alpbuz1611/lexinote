import { indexedDB } from 'fake-indexeddb';

// 1. IndexedDB global configuration
window.indexedDB = indexedDB;
globalThis.indexedDB = indexedDB;

// 2. Web Crypto API configuration
if (typeof window.crypto === 'undefined' || !window.crypto.subtle) {
  window.crypto = globalThis.crypto;
}

// 3. MatchMedia shim
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })
});

// 4. HTML5 Canvas 2D Mock for Mindmap & Graph Rendering
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: new Array(4) }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 50, actualBoundingBoxAscent: 10, actualBoundingBoxDescent: 3 })
  });
}

// 5. AudioContext Shim for Sound Service
class MockAudioContext {
  createOscillator() {
    return {
      connect: () => {},
      start: () => {},
      stop: () => {},
      frequency: { setValueAtTime: () => {} },
      type: 'sine'
    };
  }
  createGain() {
    return {
      connect: () => {},
      gain: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {}
      }
    };
  }
  get currentTime() { return 0; }
  get destination() { return {}; }
}
window.AudioContext = MockAudioContext;
window.webkitAudioContext = MockAudioContext;

// 6. BroadcastChannel In-Memory Mock for cross-tab tests
if (typeof window.BroadcastChannel === 'undefined') {
  const channelBus = new Map();
  class MockBroadcastChannel {
    constructor(name) {
      this.name = name;
      if (!channelBus.has(name)) channelBus.set(name, new Set());
      channelBus.get(name).add(this);
      this.onmessage = null;
    }
    postMessage(msg) {
      const listeners = channelBus.get(this.name);
      if (listeners) {
        listeners.forEach(ch => {
          if (ch !== this && ch.onmessage) {
            ch.onmessage({ data: msg });
          }
        });
      }
    }
    close() {
      const listeners = channelBus.get(this.name);
      if (listeners) listeners.delete(this);
    }
  }
  window.BroadcastChannel = MockBroadcastChannel;
  globalThis.BroadcastChannel = MockBroadcastChannel;
}

// 7. Scroll mocks
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = () => {};
}
window.scrollTo = () => {};

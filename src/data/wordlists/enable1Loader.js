import { ENABLE1_RAW } from './enable1Data.js';

/**
 * ENABLE1 (Enhanced North American Benchmark Lexicon)
 * Compiled by Alan Beale (1997) - Public Domain
 * Master list of 172,819 English words
 */

let enable1Set = null;

export function getEnable1Set() {
  if (!enable1Set) {
    const words = ENABLE1_RAW.split('\n');
    enable1Set = new Set();
    for (let i = 0; i < words.length; i++) {
      const w = words[i].trim();
      if (w) enable1Set.add(w.toLowerCase());
    }
  }
  return enable1Set;
}

export function isEnable1Word(word) {
  if (!word) return false;
  return getEnable1Set().has(word.toLowerCase());
}

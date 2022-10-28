import type { NgtDpr } from '../types';

export function calculateDpr(dpr: NgtDpr, window?: Window) {
  const target = window?.devicePixelRatio || 1;
  return Array.isArray(dpr) ? Math.min(Math.max(dpr[0], target), dpr[1]) : dpr;
}

import { NgtDpr } from '../models';

export function calculateDpr(dpr: NgtDpr) {
  return Array.isArray(dpr)
    ? Math.min(Math.max(dpr[0], window.devicePixelRatio), dpr[1])
    : dpr;
}

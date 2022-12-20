import * as THREE from 'three';
import type { NgtDpr, NgtIntersection } from '../types';

const idCache: { [id: string]: boolean | undefined } = {};
export function makeId(event?: NgtIntersection): string {
  if (event) {
    return (event.eventObject || event.object).uuid + '/' + event.index + event.instanceId;
  }

  const newId = THREE.MathUtils.generateUUID();
  // ensure not already used
  if (!idCache[newId]) {
    idCache[newId] = true;
    return newId;
  }
  return makeId();
}

export function makeDpr(dpr: NgtDpr, window?: Window) {
  const target = window?.devicePixelRatio || 1;
  return Array.isArray(dpr) ? Math.min(Math.max(dpr[0], target), dpr[1]) : dpr;
}

import type { UnknownRecord } from '../types';

export function checkNeedsUpdate(value: unknown) {
  if (value !== null && typeof value === 'object' && 'needsUpdate' in (value as UnknownRecord)) {
    (value as UnknownRecord)['needsUpdate'] = true;
  }
}

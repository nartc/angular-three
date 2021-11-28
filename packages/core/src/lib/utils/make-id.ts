import { MathUtils } from 'three';
import type { NgtIntersection } from '../models';

/**
 * Generate a random Id or an Event's uuid
 *
 * @param {NgtIntersection} event
 *
 * @internal
 * @private
 */
export function makeId(event?: NgtIntersection) {
  if (event) {
    return (
      (event.eventObject || event.object).uuid +
      '/' +
      event.index +
      event.instanceId
    );
  }

  return id();
}

const cache: { [id: string]: boolean | undefined } = {};

/**
 * Generates a UUID.
 */
export function id(): string {
  const newId = MathUtils.generateUUID();

  // ensure not already used
  if (!cache[newId]) {
    cache[newId] = true;
    return newId;
  }

  return id();
}

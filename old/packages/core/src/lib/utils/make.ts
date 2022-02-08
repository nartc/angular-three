import * as THREE from 'three';
import type {
  AnyConstructor,
  NgtColor,
  NgtVector2,
  NgtVector3,
  NgtVector4,
} from '../types';
import { NgtIntersection } from '../types';

export function makeVector2(input?: NgtVector2): THREE.Vector2 | undefined {
  if (!input) return undefined;

  if (input instanceof THREE.Vector2) {
    return input;
  }

  if (Array.isArray(input)) {
    return new THREE.Vector2(...input);
  }

  return new THREE.Vector2(input, input);
}

export function makeVector3(input?: NgtVector3): THREE.Vector3 | undefined {
  if (!input) return undefined;

  if (input instanceof THREE.Vector3) {
    return input;
  }

  if (Array.isArray(input)) {
    return new THREE.Vector3(...input);
  }

  return new THREE.Vector3(input, input, input);
}

export function makeVector4(input?: NgtVector4): THREE.Vector4 | undefined {
  if (!input) return undefined;

  if (input instanceof THREE.Vector4) {
    return input;
  }

  if (Array.isArray(input)) {
    return new THREE.Vector4(...input);
  }

  return new THREE.Vector4(input, input, input, input);
}

export function makeForSet<TType extends AnyConstructor<any>>(
  type: TType,
  input?: InstanceType<TType> | Parameters<typeof type.prototype['set']>
): InstanceType<TType> | undefined {
  if (!input) return undefined;

  if (input instanceof type) {
    return input as InstanceType<TType>;
  }

  return new type(...(input as Parameters<typeof type.prototype['set']>));
}

export function makeColor(color?: NgtColor): THREE.Color | undefined {
  if (!color) return undefined;
  if (color instanceof THREE.Color) {
    return color;
  }

  if (Array.isArray(color)) {
    return new THREE.Color(...color);
  }

  return new THREE.Color(color);
}

const idCache: { [id: string]: boolean | undefined } = {};

/**
 * Generate a random Id or an Event's uuid
 *
 * @param {NgtIntersection} event
 *
 * @internal
 * @private
 */
export function makeId(event?: NgtIntersection): string {
  if (event) {
    return (
      (event.eventObject || event.object).uuid +
      '/' +
      event.index +
      event.instanceId
    );
  }

  const newId = THREE.MathUtils.generateUUID();
  // ensure not already used
  if (!idCache[newId]) {
    idCache[newId] = true;
    return newId;
  }
  return makeId();
}

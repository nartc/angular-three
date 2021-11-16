import { NgtQuad, NgtTriplet } from '@angular-three/core';
import * as THREE from 'three';
import { BodyProps } from '../models/body';
import { PhysicsStoreState } from '../models/physics-state';

export function prepare(object: THREE.Object3D, props: BodyProps) {
  object.userData = props.userData || {};
  object.position.set(...(props.position || [0, 0, 0]));
  object.rotation.set(...(props.rotation || [0, 0, 0]));
  object.updateMatrix();
}

export function setupCollision(
  events: PhysicsStoreState['events'],
  { onCollide, onCollideBegin, onCollideEnd }: Partial<BodyProps>,
  uuid: string
) {
  events[uuid] = {
    collide: onCollide,
    collideBegin: onCollideBegin,
    collideEnd: onCollideEnd,
  };
}

export function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

export function getUUID(ref: THREE.Object3D, index?: number): string | null {
  const suffix = index === undefined ? '' : `/${index}`;
  if (typeof ref === 'function') return null;
  return ref && `${ref.uuid}${suffix}`;
}

const e = new THREE.Euler();
const q = new THREE.Quaternion();
export const quaternionToRotation = (callback: (v: NgtTriplet) => void) => {
  return (v: NgtQuad) =>
    callback(e.setFromQuaternion(q.fromArray(v)).toArray() as NgtTriplet);
};

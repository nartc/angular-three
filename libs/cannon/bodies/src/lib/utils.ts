import type { BodyProps, NgtPhysicsState } from '@angular-three/cannon';
import type { NgtQuad, NgtTriplet } from '@angular-three/core';
import * as THREE from 'three';

export function makeTriplet(v: THREE.Vector3 | NgtTriplet): NgtTriplet {
    return v instanceof THREE.Vector3 ? [v.x, v.y, v.z] : v;
}

export function prepare(object: THREE.Object3D, props: BodyProps) {
    const defaultXYZ: [number, number, number] = [0, 0, 0];

    object.userData = props.userData || {};
    object.position.set(...(props.position || defaultXYZ));
    object.rotation.set(...(props.rotation || defaultXYZ));
    object.updateMatrix();
}

export function setupCollision(
    events: NgtPhysicsState['events'],
    { onCollide, onCollideBegin, onCollideEnd }: Partial<BodyProps>,
    uuid: string
) {
    events[uuid] = {
        collide: onCollide,
        collideBegin: onCollideBegin,
        collideEnd: onCollideEnd,
    };
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

export function capitalize<T extends string>(str: T): Capitalize<T> {
    return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

import type { NgtRef } from '@angular-three/core';
import type {
  BodyProps,
  CannonWorkerAPI,
  PropValue,
  Quad,
  SubscriptionName,
  Subscriptions,
  SubscriptionTarget,
  Triplet,
} from '@pmndrs/cannon-worker-api';
import * as THREE from 'three';
import type { NgtCannonEvents } from './stores/physics';

export class NgtPhysicsUtils {
  static incrementingId = 0;
  static e = new THREE.Euler();
  static q = new THREE.Quaternion();

  static getUUID<TObject extends THREE.Object3D = THREE.Object3D>(ref: NgtRef<TObject>, index?: number): string | null {
    const suffix = index === undefined ? '' : `/${index}`;
    if (typeof ref === 'function') return null;
    return ref && ref.value && `${ref.value.uuid}${suffix}`;
  }

  static subscribe<T extends SubscriptionName, TObject extends THREE.Object3D = THREE.Object3D>(
    ref: NgtRef<TObject>,
    worker: CannonWorkerAPI,
    subscriptions: Subscriptions,
    type: T,
    index?: number,
    target: SubscriptionTarget = 'bodies'
  ) {
    return (callback: (value: PropValue<T>) => void) => {
      const id = this.incrementingId++;
      subscriptions[id] = { [type]: callback };
      const uuid = this.getUUID(ref, index);
      uuid && worker.subscribe({ props: { id, target, type }, uuid });
      return () => {
        delete subscriptions[id];
        worker.unsubscribe({ props: id });
      };
    };
  }

  static prepare(object: THREE.Object3D, { position = [0, 0, 0], rotation = [0, 0, 0], userData = {} }: BodyProps) {
    object.userData = userData;
    object.position.set(...position);
    object.rotation.set(...rotation);
    object.updateMatrix();
  }

  static setupCollision(
    events: NgtCannonEvents,
    { onCollide, onCollideBegin, onCollideEnd }: Partial<BodyProps>,
    uuid: string
  ) {
    events[uuid] = {
      collide: onCollide,
      collideBegin: onCollideBegin,
      collideEnd: onCollideEnd,
    };
  }

  static capitalize<T extends string>(str: T): Capitalize<T> {
    return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
  }

  static quaternionToRotation(callback: (v: Triplet) => void) {
    return (v: Quad) => callback(this.e.setFromQuaternion(this.q.fromArray(v)).toArray() as Triplet);
  }

  static makeTriplet(v: THREE.Vector3 | Triplet): Triplet {
    return v instanceof THREE.Vector3 ? [v.x, v.y, v.z] : v;
  }
}

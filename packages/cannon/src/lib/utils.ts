import { ElementRef } from '@angular/core';
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
import { Euler, Quaternion, Vector3 } from 'three';
import type { NgtcEvents } from './store';

export class NgtcUtils {
  static incrementingId = 0;
  static e = new Euler();
  static q = new Quaternion();

  static getUUID<TObject extends THREE.Object3D = THREE.Object3D>(
    ref: ElementRef<TObject>,
    index?: number
  ): string | null {
    const suffix = index === undefined ? '' : `/${index}`;
    if (typeof ref === 'function') return null;
    return ref && ref.nativeElement && `${ref.nativeElement.uuid}${suffix}`;
  }

  static subscribe<T extends SubscriptionName, TObject extends THREE.Object3D = THREE.Object3D>(
    ref: ElementRef<TObject>,
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

  static prepare(
    object: THREE.Object3D,
    { position = [0, 0, 0], rotation = [0, 0, 0], userData = {} }: BodyProps
  ) {
    object.userData = userData;
    object.position.set(...position);
    object.rotation.set(...rotation);
    object.updateMatrix();
  }

  static setupCollision(
    events: NgtcEvents,
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
    return (v: Quad) =>
      callback(this.e.setFromQuaternion(this.q.fromArray(v)).toArray() as Triplet);
  }

  static makeTriplet(v: THREE.Vector3 | Triplet): Triplet {
    return v instanceof Vector3 ? [v.x, v.y, v.z] : v;
  }
}

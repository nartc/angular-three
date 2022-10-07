import type { Ref } from '@angular-three/core';
import type {
  CannonWorkerAPI,
  PropValue,
  SubscriptionName,
  Subscriptions,
  SubscriptionTarget,
} from '@pmndrs/cannon-worker-api';
import * as THREE from 'three';

export class NgtCannonUtils {
  static incrementingId = 0;

  static getUUID<TObject extends THREE.Object3D = THREE.Object3D>(ref: Ref<TObject>, index?: number): string | null {
    const suffix = index === undefined ? '' : `/${index}`;
    if (typeof ref === 'function') return null;
    return ref && ref.value && `${ref.value.uuid}${suffix}`;
  }

  static subscribe<T extends SubscriptionName, TObject extends THREE.Object3D = THREE.Object3D>(
    ref: Ref<TObject>,
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
}

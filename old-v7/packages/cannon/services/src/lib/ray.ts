import { NgtPhysicsStore } from '@angular-three/cannon';
import { makeId, NgtComponentStore, NgtStore, tapEffect } from '@angular-three/core';
import { inject, Injectable, NgZone } from '@angular/core';
import { RayhitEvent, RayMode, RayOptions } from '@pmndrs/cannon-worker-api';

@Injectable()
export class NgtPhysicsRaycast extends NgtComponentStore {
  private readonly zone = inject(NgZone);
  private readonly store = inject(NgtStore);
  private readonly physicsStore = inject(NgtPhysicsStore, { skipSelf: true });

  useRaycastClosest(options: RayOptions, callback: (e: RayhitEvent) => void) {
    this.useRay('Closest', options, callback);
  }

  useRaycastAny(options: RayOptions, callback: (e: RayhitEvent) => void) {
    this.useRay('Any', options, callback);
  }

  useRaycastAll(options: RayOptions, callback: (e: RayhitEvent) => void) {
    this.useRay('All', options, callback);
  }

  private useRay(mode: RayMode, options: RayOptions, callback: (e: RayhitEvent) => void): void {
    this.zone.runOutsideAngular(() => {
      const uuid = makeId();

      this.store.onReady(() => {
        this.effect(
          tapEffect(() => {
            const { worker, events } = this.physicsStore.getState();
            events[uuid] = { rayhit: callback };
            worker.addRay({ props: { ...options, mode }, uuid });
            return () => {
              worker.removeRay({ uuid });
              delete events[uuid];
            };
          })
        )(this.physicsStore.select((s) => s.worker));
      });
    });
  }
}

import { NgtPhysicsStore } from '@angular-three/cannon';
import { makeId, NgtComponentStore, NgtStore, tapEffect } from '@angular-three/core';
import { inject, Injectable, NgZone } from '@angular/core';
import { ContactMaterialOptions, MaterialOptions } from '@pmndrs/cannon-worker-api';

@Injectable()
export class NgtPhysicsContactMaterial extends NgtComponentStore {
  private readonly zone = inject(NgZone);
  private readonly store = inject(NgtStore);
  private readonly physicsStore = inject(NgtPhysicsStore, { skipSelf: true });

  useContactMaterial(materialA: MaterialOptions, materialB: MaterialOptions, options: ContactMaterialOptions) {
    return this.zone.runOutsideAngular(() => {
      const physicsStore = this.physicsStore;
      const uuid = makeId();

      this.store.onReady(() => {
        this.effect(
          tapEffect(() => {
            const worker = physicsStore.getState((s) => s.worker);
            if (worker) {
              worker.addContactMaterial({
                props: [materialA, materialB, options],
                uuid,
              });

              return () => {
                worker.removeContactMaterial({ uuid });
              };
            }
          })
        )(physicsStore.select((s) => s.worker));
      });
    });
  }
}

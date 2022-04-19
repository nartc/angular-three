import {
    makeId,
    NgtComponentStore,
    NgtStore,
    tapEffect,
} from '@angular-three/core';
import { Injectable, NgZone, Optional } from '@angular/core';
import type {
    CannonWorkerAPI,
    RayhitEvent,
    RayMode,
    RayOptions,
} from '@pmndrs/cannon-worker-api';
import { NgtPhysicsStore } from './physics.store';

@Injectable()
export class NgtPhysicRaycast extends NgtComponentStore {
    constructor(
        private zone: NgZone,
        private store: NgtStore,
        @Optional() private physicsStore: NgtPhysicsStore
    ) {
        if (!physicsStore) {
            throw new Error(
                'NgtPhysicRaycast must be used inside of <ngt-physics>'
            );
        }
        super();
    }

    useRaycastClosest(options: RayOptions, callback: (e: RayhitEvent) => void) {
        this.useRay('Closest', options, callback);
    }

    useRaycastAny(options: RayOptions, callback: (e: RayhitEvent) => void) {
        this.useRay('Any', options, callback);
    }

    useRaycastAll(options: RayOptions, callback: (e: RayhitEvent) => void) {
        this.useRay('All', options, callback);
    }

    private useRay(
        mode: RayMode,
        options: RayOptions,
        callback: (e: RayhitEvent) => void
    ): void {
        this.zone.runOutsideAngular(() => {
            const uuid = makeId();

            this.onCanvasReady(this.store.ready$, () => {
                this.effect<CannonWorkerAPI>(
                    tapEffect((worker) => {
                        const events = this.physicsStore.get((s) => s.events);
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

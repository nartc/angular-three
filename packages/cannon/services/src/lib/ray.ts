import { injectNgtcStore } from '@angular-three/cannon';
import { makeId } from '@angular-three/core';
import { RayhitEvent, RayMode, RayOptions } from '@pmndrs/cannon-worker-api';

export function injectRaycastClosest(options: RayOptions, callback: (e: RayhitEvent) => void) {
    injectRay('Closest', options, callback);
}

export function injectRaycastAny(options: RayOptions, callback: (e: RayhitEvent) => void) {
    injectRay('Any', options, callback);
}

export function injectRaycastAll(options: RayOptions, callback: (e: RayhitEvent) => void) {
    injectRay('All', options, callback);
}

function injectRay(mode: RayMode, options: RayOptions, callback: (event: RayhitEvent) => void): void {
    const store = injectNgtcStore({ skipSelf: true });
    const uuid = makeId();

    store.effect(store.select('worker'), (worker) => {
        const events = store.get('events');
        events[uuid] = { rayhit: callback };
        worker.addRay({ props: { ...options, mode }, uuid });
        return () => {
            worker.removeRay({ uuid });
            delete events[uuid];
        };
    });
}

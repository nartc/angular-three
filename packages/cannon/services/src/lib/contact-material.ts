import { injectNgtcStore } from '@angular-three/cannon';
import { makeId } from '@angular-three/core';
import { ContactMaterialOptions, MaterialOptions } from '@pmndrs/cannon-worker-api';

export function injectContactMaterial(
    materialA: MaterialOptions,
    materialB: MaterialOptions,
    options: ContactMaterialOptions
) {
    const store = injectNgtcStore({ skipSelf: true });
    const uuid = makeId();

    store.effect(store.select('worker'), (worker) => {
        worker.addContactMaterial({ props: [materialA, materialB, options], uuid });
        return () => worker.removeContactMaterial({ uuid });
    });
}

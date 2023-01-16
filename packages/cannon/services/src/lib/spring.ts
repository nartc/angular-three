import { injectNgtcStore } from '@angular-three/cannon';
import { makeId, NgtInjectedRef } from '@angular-three/core';
import { SpringOptns } from '@pmndrs/cannon-worker-api';
import { combineLatest } from 'rxjs';

export interface NgtcSpringApi {
    setDamping: (value: number) => void;
    setRestLength: (value: number) => void;
    setStiffness: (value: number) => void;
    remove: () => void;
}

export interface NgtcSpringReturn<
    TObjectA extends THREE.Object3D = THREE.Object3D,
    TObjectB extends THREE.Object3D = THREE.Object3D
> {
    bodyA: NgtInjectedRef<TObjectA>;
    bodyB: NgtInjectedRef<TObjectB>;
    api: NgtcSpringApi;
}

export function injectSpring<
    TObjectA extends THREE.Object3D = THREE.Object3D,
    TObjectB extends THREE.Object3D = THREE.Object3D
>(
    bodyA: NgtInjectedRef<TObjectA>,
    bodyB: NgtInjectedRef<TObjectB>,
    opts: SpringOptns
): NgtcSpringReturn<TObjectA, TObjectB> {
    const store = injectNgtcStore({ skipSelf: true });
    const uuid = makeId();

    store.effect(combineLatest([store.select('worker'), bodyA.$, bodyB.$]), ([worker, bodyA, bodyB]) => {
        worker.addSpring({ props: [bodyA.uuid, bodyB.uuid, opts], uuid });
        return () => worker.removeSpring({ uuid });
    });

    const api = {
        setDamping: (value: number) => {
            const worker = store.get('worker');
            worker.setSpringDamping({ uuid, props: value });
        },
        setRestLength: (value: number) => {
            const worker = store.get('worker');
            worker.setSpringRestLength({ uuid, props: value });
        },
        setStiffness: (value: number) => {
            const worker = store.get('worker');
            worker.setSpringStiffness({ uuid, props: value });
        },
        remove: () => {
            const worker = store.get('worker');
            worker.removeSpring({ uuid });
        },
    } as NgtcSpringApi;

    return { bodyA, bodyB, api };
}

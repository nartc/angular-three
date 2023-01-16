import { injectNgtcStore, NgtcUtils } from '@angular-three/cannon';
import { injectNgtRef, NgtInjectedRef } from '@angular-three/core';
import { WheelInfoOptions } from '@pmndrs/cannon-worker-api';
import { combineLatest } from 'rxjs';
import { Object3D } from 'three';

export interface NgtcRaycastVehicleProps {
    chassisBody: NgtInjectedRef<THREE.Object3D>;
    wheelInfos: WheelInfoOptions[];
    wheels: Array<NgtInjectedRef<THREE.Object3D>>;
    indexForwardAxis?: number;
    indexRightAxis?: number;
    indexUpAxis?: number;
}

export interface NgtcRaycastVehiclePublicApi {
    applyEngineForce: (value: number, wheelIndex: number) => void;
    setBrake: (brake: number, wheelIndex: number) => void;
    setSteeringValue: (value: number, wheelIndex: number) => void;
    sliding: {
        subscribe: (callback: (sliding: boolean) => void) => void;
    };
    remove: () => void;
}

export interface NgtcRaycastVehicleReturn<TObject extends THREE.Object3D = THREE.Object3D> {
    ref: NgtInjectedRef<TObject>;
    api: NgtcRaycastVehiclePublicApi;
}

export function injectRaycastVehicle<TObject extends THREE.Object3D = THREE.Object3D>(
    fn: () => NgtcRaycastVehicleProps,
    instanceRef?: NgtInjectedRef<TObject>
): NgtcRaycastVehicleReturn<TObject> {
    const store = injectNgtcStore({ skipSelf: true });

    let ref = injectNgtRef<TObject>();

    if (instanceRef) {
        ref = instanceRef;
    }

    queueMicrotask(() => {
        if (!ref.nativeElement) {
            ref.nativeElement = new Object3D() as TObject;
        }
    });

    const { chassisBody, indexForwardAxis = 2, indexRightAxis = 0, indexUpAxis = 1, wheelInfos, wheels } = fn();

    store.effect(
        combineLatest([store.select('worker'), ref.$, chassisBody.$, ...wheels.map((wheel) => wheel.$)]),
        ([worker, object]) => {
            const uuid = object.uuid;
            const chassisBodyUUID = NgtcUtils.getUUID(chassisBody);
            const wheelUUIDs = wheels.map((wheel) => NgtcUtils.getUUID(wheel));

            if (!chassisBodyUUID || !wheelUUIDs.every((v) => typeof v === 'string')) return;

            worker.addRaycastVehicle({
                props: [
                    chassisBodyUUID,
                    wheelUUIDs as string[],
                    wheelInfos,
                    indexForwardAxis,
                    indexRightAxis,
                    indexUpAxis,
                ],
                uuid,
            });

            return () => worker.removeRaycastVehicle({ uuid });
        }
    );

    const api = {
        applyEngineForce: (value: number, wheelIndex: number) => {
            const worker = store.get('worker');
            const uuid = NgtcUtils.getUUID(ref);
            uuid && worker.applyRaycastVehicleEngineForce({ props: [value, wheelIndex], uuid });
        },
        setBrake: (brake: number, wheelIndex: number) => {
            const worker = store.get('worker');
            const uuid = NgtcUtils.getUUID(ref);
            uuid && worker.setRaycastVehicleBrake({ props: [brake, wheelIndex], uuid });
        },
        setSteeringValue: (value: number, wheelIndex: number) => {
            const worker = store.get('worker');
            const uuid = NgtcUtils.getUUID(ref);
            uuid && worker.setRaycastVehicleSteeringValue({ props: [value, wheelIndex], uuid });
        },
        sliding: {
            get subscribe() {
                const { worker, subscriptions } = store.get();
                return NgtcUtils.subscribe(ref, worker, subscriptions, 'sliding', undefined, 'vehicles');
            },
        },
        remove: () => {
            const worker = store.get('worker');
            const uuid = NgtcUtils.getUUID(ref);
            uuid && worker.removeRaycastVehicle({ uuid });
        },
    } as NgtcRaycastVehiclePublicApi;

    return { ref, api };
}

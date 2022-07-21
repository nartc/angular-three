import { is, NgtComponentStore, NgtStore, prepare, Ref, tapEffect } from '@angular-three/core';
import { Injectable, NgZone, Optional } from '@angular/core';
import type { CannonWorkerAPI, WheelInfoOptions } from '@pmndrs/cannon-worker-api';
import { combineLatest, filter } from 'rxjs';
import * as THREE from 'three/src/Three';
import { NgtPhysicsStore } from './physics.store';
import { NgtCannonUtils } from './utils';

export interface NgtPhysicRaycastVehicleProps {
  chassisBody: Ref<THREE.Object3D>;
  indexForwardAxis?: number;
  indexRightAxis?: number;
  indexUpAxis?: number;
  wheelInfos: WheelInfoOptions[];
  wheels: Array<Ref<THREE.Object3D>>;
}

export interface NgtPhysicRaycastVehiclePublicApi {
  applyEngineForce: (value: number, wheelIndex: number) => void;
  setBrake: (brake: number, wheelIndex: number) => void;
  setSteeringValue: (value: number, wheelIndex: number) => void;
  sliding: {
    subscribe: (callback: (sliding: boolean) => void) => void;
  };
  remove: () => void;
}

export interface NgtPhysicRaycastVehicleReturn<TObject extends THREE.Object3D = THREE.Object3D> {
  ref: Ref<TObject>;
  api: NgtPhysicRaycastVehiclePublicApi;
}

@Injectable()
export class NgtPhysicRaycastVehicle extends NgtComponentStore {
  constructor(private zone: NgZone, private store: NgtStore, @Optional() private physicsStore: NgtPhysicsStore) {
    if (!physicsStore) {
      throw new Error('NgtPhysicRaycastVehicle must be used inside of <ngt-physics>');
    }
    super();
  }

  useRaycastVehicle<TObject extends THREE.Object3D = THREE.Object3D>(
    fn: () => NgtPhysicRaycastVehicleProps,
    useOnTemplate = true,
    instanceRef?: Ref<TObject>
  ): NgtPhysicRaycastVehicleReturn<TObject> {
    return this.zone.runOutsideAngular(() => {
      let ref = instanceRef as Ref<TObject>;

      if (!ref) {
        ref = new Ref();
      }

      if (!ref.value && !useOnTemplate) {
        ref.set(prepare(new THREE.Object3D() as TObject, () => this.store.get()));
      }

      const { chassisBody, indexForwardAxis = 2, indexRightAxis = 0, indexUpAxis = 1, wheelInfos, wheels } = fn();
      const physicsStore = this.physicsStore;

      this.onCanvasReady(this.store.ready$, () => {
        this.effect<[CannonWorkerAPI, THREE.Object3D, THREE.Object3D, THREE.Object3D[]]>(
          tapEffect(() => {
            const worker = physicsStore.get((s) => s.worker);
            const uuid = ref.value.uuid;
            const chassisBodyUUID = NgtCannonUtils.getUUID(chassisBody);
            const wheelUUIDs = wheels.map((ref) => NgtCannonUtils.getUUID(ref));

            if (!chassisBodyUUID || !wheelUUIDs.every(is.str)) {
              return;
            }

            worker.addRaycastVehicle({
              props: [chassisBodyUUID, wheelUUIDs, wheelInfos, indexForwardAxis, indexRightAxis, indexUpAxis],
              uuid,
            });
            return () => {
              worker.removeRaycastVehicle({ uuid });
            };
          })
        )(
          combineLatest([
            physicsStore.select((s) => s.worker),
            ref.pipe(filter((obj): obj is TObject => !!obj)),
            chassisBody.pipe(filter((chassis) => !!chassis)),
            combineLatest(wheels.map((wheelRef) => wheelRef.pipe(filter((wheel): wheel is THREE.Object3D => !!wheel)))),
          ])
        );
      });

      return {
        ref,
        get api() {
          const { worker, subscriptions } = physicsStore.get();
          return {
            applyEngineForce(value: number, wheelIndex: number) {
              const uuid = NgtCannonUtils.getUUID(ref);
              uuid &&
                worker.applyRaycastVehicleEngineForce({
                  props: [value, wheelIndex],
                  uuid,
                });
            },
            setBrake(brake: number, wheelIndex: number) {
              const uuid = NgtCannonUtils.getUUID(ref);
              uuid &&
                worker.setRaycastVehicleBrake({
                  props: [brake, wheelIndex],
                  uuid,
                });
            },
            setSteeringValue(value: number, wheelIndex: number) {
              const uuid = NgtCannonUtils.getUUID(ref);
              uuid &&
                worker.setRaycastVehicleSteeringValue({
                  props: [value, wheelIndex],
                  uuid,
                });
            },
            sliding: {
              subscribe: NgtCannonUtils.subscribe(ref, worker, subscriptions, 'sliding', undefined, 'vehicles'),
            },
            remove() {
              const uuid = NgtCannonUtils.getUUID(ref);
              uuid && worker.removeRaycastVehicle({ uuid });
            },
          };
        },
      };
    });
  }
}

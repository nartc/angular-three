import { NgtPhysicsStore, NgtPhysicsUtils } from '@angular-three/cannon';
import { NgtComponentStore, NgtRef, NgtStore, prepare, tapEffect } from '@angular-three/core';
import { inject, Injectable, NgZone } from '@angular/core';
import type { CannonWorkerAPI, WheelInfoOptions } from '@pmndrs/cannon-worker-api';
import { combineLatest, filter } from 'rxjs';
import * as THREE from 'three';

export interface NgtPhysicsRaycastVehicleProps {
  chassisBody: NgtRef<THREE.Object3D>;
  indexForwardAxis?: number;
  indexRightAxis?: number;
  indexUpAxis?: number;
  wheelInfos: WheelInfoOptions[];
  wheels: Array<NgtRef<THREE.Object3D>>;
}

export interface NgtPhysicsRaycastVehiclePublicApi {
  applyEngineForce: (value: number, wheelIndex: number) => void;
  setBrake: (brake: number, wheelIndex: number) => void;
  setSteeringValue: (value: number, wheelIndex: number) => void;
  sliding: {
    subscribe: (callback: (sliding: boolean) => void) => void;
  };
  remove: () => void;
}

export interface NgtPhysicsRaycastVehicleReturn<TObject extends THREE.Object3D = THREE.Object3D> {
  ref: NgtRef<TObject>;
  api: NgtPhysicsRaycastVehiclePublicApi;
}

@Injectable()
export class NgtPhysicsRaycastVehicle extends NgtComponentStore {
  private readonly zone = inject(NgZone);
  private readonly store = inject(NgtStore);
  private readonly physicsStore = inject(NgtPhysicsStore, { skipSelf: true });

  useRaycastVehicle<TObject extends THREE.Object3D = THREE.Object3D>(
    fn: () => NgtPhysicsRaycastVehicleProps,
    useOnTemplate = true,
    instanceRef?: NgtRef<TObject>
  ): NgtPhysicsRaycastVehicleReturn<TObject> {
    return this.zone.runOutsideAngular(() => {
      let ref = instanceRef as NgtRef<TObject>;

      if (!ref) {
        ref = new NgtRef();
      }

      if (!ref.value && !useOnTemplate) {
        ref.set(prepare(new THREE.Object3D() as TObject, this.store.getState, this.store.rootStateGetter));
      }

      const { chassisBody, indexForwardAxis = 2, indexRightAxis = 0, indexUpAxis = 1, wheelInfos, wheels } = fn();
      const physicsStore = this.physicsStore;

      this.store.onReady(() => {
        this.effect<[CannonWorkerAPI, THREE.Object3D, THREE.Object3D, THREE.Object3D[]]>(
          tapEffect(() => {
            const worker = physicsStore!.getState((s) => s.worker);
            const uuid = ref.value.uuid;
            const chassisBodyUUID = NgtPhysicsUtils.getUUID(chassisBody);
            const wheelUUIDs = wheels.map((ref) => NgtPhysicsUtils.getUUID(ref));

            if (!chassisBodyUUID || !wheelUUIDs.every((uuid) => typeof uuid === 'string')) {
              return;
            }

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
            return () => {
              worker.removeRaycastVehicle({ uuid });
            };
          })
        )(
          combineLatest([
            physicsStore!.select((s) => s.worker),
            ref.pipe(filter((obj): obj is TObject => !!obj)),
            chassisBody.pipe(filter((chassis) => !!chassis)),
            combineLatest(wheels.map((wheelRef) => wheelRef.pipe(filter((wheel): wheel is THREE.Object3D => !!wheel)))),
          ])
        );
      });

      return {
        ref,
        get api() {
          const { worker, subscriptions } = physicsStore!.getState();
          return {
            applyEngineForce(value: number, wheelIndex: number) {
              const uuid = NgtPhysicsUtils.getUUID(ref);
              uuid &&
                worker.applyRaycastVehicleEngineForce({
                  props: [value, wheelIndex],
                  uuid,
                });
            },
            setBrake(brake: number, wheelIndex: number) {
              const uuid = NgtPhysicsUtils.getUUID(ref);
              uuid &&
                worker.setRaycastVehicleBrake({
                  props: [brake, wheelIndex],
                  uuid,
                });
            },
            setSteeringValue(value: number, wheelIndex: number) {
              const uuid = NgtPhysicsUtils.getUUID(ref);
              uuid &&
                worker.setRaycastVehicleSteeringValue({
                  props: [value, wheelIndex],
                  uuid,
                });
            },
            sliding: {
              subscribe: NgtPhysicsUtils.subscribe(ref, worker, subscriptions, 'sliding', undefined, 'vehicles'),
            },
            remove() {
              const uuid = NgtPhysicsUtils.getUUID(ref);
              uuid && worker.removeRaycastVehicle({ uuid });
            },
          };
        },
      };
    });
  }
}

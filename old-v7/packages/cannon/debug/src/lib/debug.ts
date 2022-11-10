import { NgtPhysicsStore } from '@angular-three/cannon';
import {
  coerceBoolean,
  coerceNumber,
  NgtBooleanInput,
  NgtInstance,
  NgtInstanceState,
  NgtNumberInput,
  NgtObservableInput,
  NgtPrepareInstanceFn,
  provideInstanceHostRef,
  provideInstanceRef,
  provideNgtInstance,
  tapEffect,
} from '@angular-three/core';
import { NgtObjectPrimitive } from '@angular-three/core/primitives';
import { Component, inject, Input } from '@angular/core';
import { BodyProps, BodyShapeType, propsToBody } from '@pmndrs/cannon-worker-api';
import { Body, Quaternion, Vec3 } from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { isObservable, map, tap } from 'rxjs';
import * as THREE from 'three';
import { World } from 'world/World';

const q = new THREE.Quaternion();
const s = new THREE.Vector3(1, 1, 1);
const v = new THREE.Vector3();
const m = new THREE.Matrix4();

function getMatrix(o: THREE.Object3D): THREE.Matrix4 {
  if (o instanceof THREE.InstancedMesh) {
    o.getMatrixAt(parseInt(o.uuid.split('/')[1]), m);
    return m;
  }
  return o.matrix;
}

export interface NgtDebugState extends NgtInstanceState<THREE.Scene> {
  cannonDebugger: typeof CannonDebugger.prototype;
  bodies: Body[];
  bodyMap: { [uuid: string]: Body };

  color: THREE.ColorRepresentation;
  impl: typeof CannonDebugger;
  scale: number;
  disabled: boolean;
}

@Component({
  selector: 'ngt-debug',
  standalone: true,
  template: `
    <ngt-object-primitive [object]="instanceRef"></ngt-object-primitive>
    <ng-content></ng-content>
  `,
  providers: [provideNgtInstance(NgtDebug), provideInstanceRef(NgtDebug), provideInstanceHostRef(NgtDebug)],
  imports: [NgtObjectPrimitive],
})
export class NgtDebug extends NgtInstance<THREE.Scene, NgtDebugState> {
  @Input() set color(color: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ color });
  }

  @Input() set scale(scale: NgtObservableInput<NgtNumberInput>) {
    this.set({
      scale: isObservable(scale) ? scale.pipe(map(coerceNumber)) : coerceNumber(scale),
    });
  }

  @Input() set impl(impl: typeof CannonDebugger) {
    this.set({ impl });
  }

  @Input() set disabled(disabled: NgtBooleanInput) {
    this.set({
      disabled: isObservable(disabled) ? disabled.pipe(map(coerceBoolean)) : coerceBoolean(disabled),
    });
  }

  private readonly physicsStore = inject(NgtPhysicsStore, { skipSelf: true });

  private readonly initDebugger = this.effect<void>(
    tap(() => {
      const { bodies, color, scale, impl } = this.getState();
      this.set({
        cannonDebugger: impl(this.instanceValue, { bodies } as World, {
          color,
          scale,
        }),
      });
    })
  );

  private readonly setBeforeRender = this.effect<void>(
    tapEffect(() =>
      this.store.registerBeforeRender({
        callback: () => {
          const { bodyMap, cannonDebugger, disabled } = this.getState();
          if (disabled || !cannonDebugger) return;
          const refs = this.physicsStore.getState((s) => s.refs);

          for (const uuid in bodyMap) {
            getMatrix(refs[uuid]).decompose(v, q, s);
            bodyMap[uuid].position.copy(v as unknown as Vec3);
            bodyMap[uuid].quaternion.copy(q as unknown as Quaternion);
          }

          cannonDebugger.update();
        },
      })
    )
  );

  override initialize() {
    super.initialize();
    this.set({
      disabled: false,
      impl: CannonDebugger,
      scale: 1,
      color: 'black',

      bodies: [],
      bodyMap: {},
    });
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<THREE.Scene>): (() => void) | void | undefined {
    prepareInstance(new THREE.Scene());
  }

  override postInit() {
    super.postInit();
    this.initDebugger();
    this.setBeforeRender();
  }

  get api() {
    const { bodies, bodyMap } = this.get();

    return {
      add(uuid: string, props: BodyProps, type: BodyShapeType) {
        const body = propsToBody({ uuid, props, type });
        bodies.push(body);
        bodyMap[uuid] = body;
      },
      remove(uuid: string) {
        const debugBodyIndex = bodies.indexOf(bodyMap[uuid]);
        if (debugBodyIndex > -1) bodies.splice(debugBodyIndex, 1);
        delete bodyMap[uuid];
      },
    };
  }
}

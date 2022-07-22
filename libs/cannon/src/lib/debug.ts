import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtInstance,
  NgtInstanceState,
  NgtStore,
  NumberInput,
  provideInstanceRef,
  tapEffect,
} from '@angular-three/core';
import { NgtPrimitive } from '@angular-three/core/primitive';
import { ChangeDetectionStrategy, Component, Input, NgModule, NgZone } from '@angular/core';
import { BodyProps, BodyShapeType, propsToBody } from '@pmndrs/cannon-worker-api';
import { Body, Quaternion, Vec3, World } from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import * as THREE from 'three';
import { NgtPhysicsStore } from './physics.store';

const q = new THREE.Quaternion();
const s = new THREE.Vector3(1, 1, 1);
const v = new THREE.Vector3();
const m = new THREE.Matrix4();

const getMatrix = (o: THREE.Object3D): THREE.Matrix4 => {
  if (o instanceof THREE.InstancedMesh) {
    o.getMatrixAt(parseInt(o.uuid.split('/')[1]), m);
    return m;
  }
  return o.matrix;
};

export interface NgtCannonDebugState extends NgtInstanceState<THREE.Scene> {
  cannonDebugger: typeof CannonDebugger.prototype;
  bodies: Body[];
  bodyMap: { [uuid: string]: Body };

  color: THREE.ColorRepresentation;
  impl: typeof CannonDebugger;
  scale: number;
  disabled: boolean;
}

@Component({
  selector: 'ngt-cannon-debug',
  standalone: true,
  template: `
    <ngt-primitive [object]="instance.value"></ngt-primitive>
    <ng-content></ng-content>
  `,
  imports: [NgtPrimitive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInstanceRef(NgtCannonDebug)],
})
export class NgtCannonDebug extends NgtInstance<THREE.Scene, NgtCannonDebugState> {
  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  @Input() set scale(scale: NumberInput) {
    this.set({ scale: coerceNumberProperty(scale) });
  }

  @Input() set impl(impl: typeof import('cannon-es-debugger').default) {
    this.set({ impl });
  }

  @Input() set disabled(disabled: BooleanInput) {
    this.set({ disabled: coerceBooleanProperty(disabled) });
  }

  constructor(zone: NgZone, store: NgtStore, private physicsStore: NgtPhysicsStore) {
    if (!physicsStore) {
      throw new Error('ngt-cannon-debug must be used within ngt-physics');
    }

    super(zone, store, null!, null!);
  }

  protected override preInit() {
    this.set((state) => ({
      color: state.color || 'black',
      scale: state.scale || 1,
      impl: state.impl || CannonDebugger,
      disabled: state.disabled || false,
      bodies: state.bodies || [],
      bodyMap: state.bodyMap || {},
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.prepareInstance(new THREE.Scene());
        this.set((state) => ({
          cannonDebugger: state.impl(this.instance.value, { bodies: state.bodies } as World, {
            color: state.color,
            scale: state.scale,
          }),
        }));
        this.registerBeforeRender();
      });
    });
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

  private readonly registerBeforeRender = this.effect<void>(
    tapEffect(() =>
      this.store.registerBeforeRender({
        callback: () => {
          const { bodyMap, cannonDebugger, disabled } = this.get();
          if (disabled) return;

          const refs = this.physicsStore.get((s) => s.refs);
          for (const bodyUuid in bodyMap) {
            getMatrix(refs[bodyUuid]).decompose(v, q, s);
            bodyMap[bodyUuid].position.copy(v as unknown as Vec3);
            bodyMap[bodyUuid].quaternion.copy(q as unknown as Quaternion);
          }

          cannonDebugger.update();
        },
      })
    )
  );
}

@NgModule({
  imports: [NgtCannonDebug],
  exports: [NgtCannonDebug],
})
export class NgtCannonDebugModule {}

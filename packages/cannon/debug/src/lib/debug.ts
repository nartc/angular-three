import { injectNgtcPhysicsStore } from '@angular-three/cannon';
import { createInjectionToken, injectNgtStore, NgtArgs } from '@angular-three/core-two';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnDestroy, OnInit } from '@angular/core';
import { BodyProps, BodyShapeType, propsToBody } from '@pmndrs/cannon-worker-api';
import { Body, Quaternion as CQuarternion, Vec3, World } from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { InstancedMesh, Matrix4, Quaternion, Scene, Vector3 } from 'three';

const q = new Quaternion();
const s = new Vector3(1, 1, 1);
const v = new Vector3();
const m = new Matrix4();

function getMatrix(o: THREE.Object3D): THREE.Matrix4 {
  if (o instanceof InstancedMesh) {
    o.getMatrixAt(parseInt(o.uuid.split('/')[1]), m);
    return m;
  }
  return o.matrix;
}

export type NgtcDebugApi = {
  add(id: string, props: BodyProps, type: BodyShapeType): void;
  remove(id: string): void;
};

export const [injectNgtcDebugApi, provideNgtcDebugApi] =
  createInjectionToken<NgtcDebugApi>('NgtDebug API');

@Component({
  selector: 'ngtc-debug',
  standalone: true,
  template: `
    <ngt-primitive *args="[scene]"></ngt-primitive>
    <ng-content></ng-content>
  `,
  providers: [
    provideNgtcDebugApi([NgtcDebug], (debug: NgtcDebug) => ({
      add: (uuid: string, props: BodyProps, type: BodyShapeType) => {
        const body = propsToBody({ uuid, props, type });
        debug.bodies.push(body);
        debug.bodyMap[uuid] = body;
      },
      remove: (id: string) => {
        const debugBodyIndex = debug.bodies.indexOf(debug.bodyMap[id]);
        if (debugBodyIndex > -1) debug.bodies.splice(debugBodyIndex, 1);
        delete debug.bodyMap[id];
      },
    })),
  ],
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtcDebug implements OnInit, OnDestroy {
  @Input() color = 'black';
  @Input() scale = 1;
  @Input() impl = CannonDebugger;
  @Input() disabled = false;

  readonly bodies: Body[] = [];
  readonly bodyMap: Record<string, Body> = {};
  readonly scene = new Scene();
  private readonly cannonDebugger = this.impl(this.scene, { bodies: this.bodies } as World, {
    color: this.color,
    scale: this.scale,
  });

  private readonly physicsStore = injectNgtcPhysicsStore({ skipSelf: true });
  private readonly store = injectNgtStore();

  private beforeRenderCleanup?: () => void;

  ngOnInit() {
    this.beforeRenderCleanup = this.store
      .get((s) => s.internal)
      .subscribe(
        () => {
          if (this.disabled || !this.cannonDebugger) return;
          const refs = this.physicsStore.get((s) => s.refs);
          for (const uuid in this.bodyMap) {
            getMatrix(refs[uuid]).decompose(v, q, s);
            this.bodyMap[uuid].position.copy(v as unknown as Vec3);
            this.bodyMap[uuid].quaternion.copy(q as unknown as CQuarternion);
          }
          this.cannonDebugger.update();
        },
        0,
        this.store
      );
  }

  ngOnDestroy() {
    this.beforeRenderCleanup?.();
  }
}

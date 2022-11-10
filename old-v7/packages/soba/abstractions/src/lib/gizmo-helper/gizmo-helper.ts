import {
  coerceBoolean,
  make,
  NgtBooleanInput,
  NgtObjectPassThrough,
  NgtPortal,
  NgtRef,
  prepare,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
  tapEffect,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { NgtSobaOrthographicCamera } from '@angular-three/soba/cameras';
import { useCamera } from '@angular-three/soba/misc';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as THREE from 'three';

type ControlsProto = { update(): void; target: THREE.Vector3 };

const turnRate = 2 * Math.PI; // turn rate in angles per second
const dummy = new THREE.Object3D();
const matrix = new THREE.Matrix4();
const [q1, q2] = [new THREE.Quaternion(), new THREE.Quaternion()];
const target = new THREE.Vector3();
const targetPosition = new THREE.Vector3();

@Component({
  selector: 'ngt-soba-gizmo-helper',
  standalone: true,
  template: `
    <ngt-portal [container]="virtualScene">
      <ngt-soba-orthographic-camera [ref]="virtualCamera" [position]="[0, 0, 200]"></ngt-soba-orthographic-camera>
      <ngt-group shouldPassThroughRef [ngtObjectPassThrough]="this" [position]="position$">
        <ng-content></ng-content>
      </ngt-group>
    </ngt-portal>
  `,
  imports: [NgtPortal, NgtGroup, NgtObjectPassThrough, NgtSobaOrthographicCamera],
  providers: [
    provideNgtObject(NgtSobaGizmoHelper),
    provideObjectRef(NgtSobaGizmoHelper),
    provideObjectHostRef(NgtSobaGizmoHelper),
  ],
})
export class NgtSobaGizmoHelper extends NgtGroup {
  override isWrapper = true;

  @Input() set alignment(alignment: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left') {
    this.patchState({ alignment });
  }

  @Input() set margin(margin: [number, number]) {
    this.patchState({ margin });
  }

  @Input() set renderPriority(renderPriority: number) {
    this.patchState({ renderPriority });
  }

  @Input() set autoClear(autoClear: NgtBooleanInput) {
    this.patchState({ autoClear: coerceBoolean(autoClear) });
  }

  @Output() override update = new EventEmitter();

  get virtualScene() {
    return this.getState((s) => s['virtualScene']);
  }

  get virtualCamera() {
    return this.getState((s) => s['virtualCamera']);
  }

  readonly position$ = this.select(
    this.select((s) => s['margin']),
    this.select((s) => s['alignment']),
    this.store.select((s) => s.size),
    ([marginX, marginY], alignment, size) => {
      const x = alignment.endsWith('-left') ? -size.width / 2 + marginX : size.width / 2 - marginX;
      const y = alignment.startsWith('top-') ? size.height / 2 - marginY : -size.height / 2 + marginY;

      return make(THREE.Vector3, [x, y, 0]);
    },
    { debounce: true }
  );

  private animating = false;
  private focusPoint = new THREE.Vector3();
  private radius = 0;

  private readonly switchBackground = this.effect<void>(
    tapEffect(() => {
      let mainSceneBackground: THREE.Scene['background'];
      const scene = this.store.getState((s) => s.scene);
      const virtualScene = this.getState((s) => s['virtualScene']) as NgtRef<THREE.Scene>;

      if (scene.background) {
        mainSceneBackground = scene.background;
        scene.background = null;
        virtualScene.value.background = mainSceneBackground;
      }

      return () => {
        if (mainSceneBackground) {
          scene.background = mainSceneBackground;
        }
      };
    })
  );

  private readonly setBeforeRender = this.effect<void>(
    tapEffect(() => {
      const renderPriority = this.getState((s) => s['renderPriority']);
      const gl = this.store.getState((s) => s.gl);

      return this.store.registerBeforeRender({
        callback: ({ delta }) => {
          const { camera: mainCamera, controls: defaultControls, invalidate } = this.store.getState();
          const { virtualScene, virtualCamera, autoClear } = this.getState();

          if (this.instanceValue && virtualScene.value && virtualCamera.value) {
            if (this.animating) {
              if (q1.angleTo(q2) < 0.01) {
                this.animating = false;
              } else {
                const step = delta * turnRate;
                // animate position by doing a slerp and then scaling the position on the unit sphere
                q1.rotateTowards(q2, step);
                // animate orientation
                mainCamera.position.set(0, 0, 1).applyQuaternion(q1).multiplyScalar(this.radius).add(this.focusPoint);
                mainCamera.up.set(0, 1, 0).applyQuaternion(q1).normalize();
                mainCamera.quaternion.copy(q1);
                if (this.update.observed) {
                  this.update.emit();
                } else if (defaultControls) {
                  (defaultControls as unknown as ControlsProto).update();
                }

                invalidate();
              }
            }

            // Sync Gizmo with main camera orientation
            matrix.copy(mainCamera.matrix).invert();
            this.instanceValue.quaternion.setFromRotationMatrix(matrix);

            // Render virtual camera
            if (autoClear) {
              gl.autoClear = false;
            }
            gl.clearDepth();
            gl.render(virtualScene.value, virtualCamera.value);
          }
        },
        priority: renderPriority,
      });
    })
  );

  override initialize() {
    super.initialize();
    this.patchState({
      virtualCamera: new NgtRef(),
      alignment: 'bottom-right',
      margin: [80, 80],
      renderPriority: 0,
      autoClear: true,
    });
  }

  override postStoreReady() {
    super.postStoreReady();
    this.set({
      virtualScene: new NgtRef(prepare(new THREE.Scene(), this.store.getState, this.store.rootStateGetter)),
      gizmoRaycast: useCamera(
        this.virtualCamera,
        this.store.getState((s) => s.pointer)
      ),
    });
  }

  override postInit() {
    super.postInit();
    this.switchBackground();
    this.setBeforeRender();
  }

  tweenCamera(direction: THREE.Vector3) {
    this.animating = true;

    const { controls: defaultControls, camera: mainCamera, invalidate } = this.store.getState();

    if (defaultControls) {
      this.focusPoint = (defaultControls as unknown as ControlsProto).target;
    }

    this.radius = mainCamera.position.distanceTo(target);

    // Rotate from current camera orientation
    q1.copy(mainCamera.quaternion);

    // To new current camera orientation
    targetPosition.copy(direction).multiplyScalar(this.radius).add(target);
    dummy.lookAt(targetPosition);
    q2.copy(dummy.quaternion);

    invalidate();
  }
}

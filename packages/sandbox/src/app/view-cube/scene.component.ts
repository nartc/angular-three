import {
  extend,
  injectNgtRef,
  injectNgtStore,
  NgtArgs,
  NgtAttachArray,
  NgtPortal,
  NgtPortalContent,
  NgtPush,
  NgtRef,
  NgtRepeat,
  NgtRxStore,
  NgtVector3,
  prepare,
} from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { injectNgtCameraRaycast } from '@angular-three/soba/misc';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { RxActionFactory } from '@rx-angular/state/actions';
import * as THREE from 'three';
import {
  AmbientLight,
  BoxGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  MeshNormalMaterial,
  PointLight,
  TorusGeometry,
} from 'three';

extend({
  Mesh,
  MeshLambertMaterial,
  BoxGeometry,
  AmbientLight,
  PointLight,
  TorusGeometry,
  MeshNormalMaterial,
});

@Component({
  selector: 'view-cube',
  standalone: true,
  template: `
    <ngt-portal [container]="virtualSceneRef">
      <ng-template ngtPortalContent>
        <ngt-mesh
          *ref="meshRef"
          [raycast]="cameraRaycast"
          [position]="position$ | ngtPush : [0, 0, 0]"
          (pointerout)="hovered = -1"
          (pointermove)="onPointerMove($any($event).faceIndex)"
        >
          <ng-container *ngFor="let i; repeat: 6">
            <ngt-mesh-lambert-material
              *attachArray="['material', i]"
              [color]="hovered === i ? 'hotpink' : 'white'"
            >
            </ngt-mesh-lambert-material>
          </ng-container>
          <ngt-box-geometry *args="[60, 60, 60]"></ngt-box-geometry>
        </ngt-mesh>
        <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
        <ngt-point-light [position]="10" intensity="0.5"></ngt-point-light>
      </ng-template>
    </ngt-portal>
  `,
  imports: [NgtPortal, NgtPortalContent, NgtPush, NgtArgs, NgtRepeat, NgtRef, NgtAttachArray],
  providers: [RxActionFactory],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewCube extends NgtRxStore implements OnInit {
  readonly #store = injectNgtStore();
  readonly #actions$ = inject(RxActionFactory<{ setBeforeRender: void }>).create();

  readonly events = this.#store.get('events');

  readonly position$ = this.#store.select(
    'size',
    (size) => [size.width / 2 - 80, size.height / 2 - 80, 0] as NgtVector3
  );

  readonly meshRef = injectNgtRef<Mesh>();
  readonly virtualCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
  readonly cameraRaycast = injectNgtCameraRaycast(this.virtualCam);
  readonly virtualSceneRef = injectNgtRef<THREE.Scene>(prepare(new THREE.Scene()));

  hovered = -1;

  ngOnInit() {
    this.hold(this.#store.select('size'), () => {
      const size = this.#store.get('size');
      this.virtualCam.left = -size.width / 2;
      this.virtualCam.right = size.width / 2;
      this.virtualCam.top = size.height / 2;
      this.virtualCam.bottom = -size.height / 2;
      this.virtualCam.position.set(0, 0, 100);
      this.virtualCam.updateProjectionMatrix();
    });

    this.effect(this.#actions$.setBeforeRender$, () => {
      const matrix = new Matrix4();
      return this.#store.get('internal').subscribe(
        ({ scene, camera, gl }) => {
          if (this.meshRef.nativeElement) {
            matrix.copy(camera.matrix).invert();
            this.meshRef.nativeElement.quaternion.setFromRotationMatrix(matrix);
            gl.autoClear = true;
            gl.render(scene, camera);
            gl.autoClear = false;
            gl.clearDepth();
            gl.render(this.virtualSceneRef.nativeElement, this.virtualCam);
          }
        },
        1,
        this.#store
      );
    });

    this.#actions$.setBeforeRender();
  }

  onPointerMove(faceIndex?: number) {
    this.hovered = Math.floor((faceIndex || 0) / 2);
  }
}

@Component({
  selector: 'view-cube-scene',
  standalone: true,
  template: `
    <ngt-mesh>
      <ngt-torus-geometry *args="[1, 0.5, 32, 100]"></ngt-torus-geometry>
      <ngt-mesh-normal-material></ngt-mesh-normal-material>
    </ngt-mesh>
    <ngts-orbit-controls></ngts-orbit-controls>
    <view-cube></view-cube>
  `,
  imports: [ViewCube, NgtArgs, NgtsOrbitControls],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}

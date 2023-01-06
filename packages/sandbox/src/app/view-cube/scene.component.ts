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
  NgtRenderState,
  NgtRepeat,
  NgtRxStore,
  NgtVector3,
} from '@angular-three/core';
import { NgtsOrthographicCamera } from '@angular-three/soba/cameras';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { NgtsEnvironment } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  AmbientLight,
  BoxGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  MeshStandardMaterial,
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
  MeshStandardMaterial,
});

@Component({
  selector: 'view-cube',
  standalone: true,
  template: `
    <ngt-portal (beforeRender)="onBeforeRender($event.root)">
      <ng-template ngtPortalContent>
        <ngts-orthographic-camera
          [makeDefault]="true"
          [position]="[0, 0, 100]"
        ></ngts-orthographic-camera>
        <ngt-mesh
          *ref="meshRef"
          [position]="position$ | ngtPush : [0, 0, 0]"
          (pointerout)="hovered = -1"
          (pointermove)="hovered = Math.floor(($any($event).faceIndex || 0) / 2)"
        >
          <ng-container *ngFor="let i; repeat: 6">
            <ngt-mesh-lambert-material
              *attachArray="['material', i]"
              [color]="hovered === i ? 'lightblue' : 'white'"
            >
            </ngt-mesh-lambert-material>
          </ng-container>
          <ngt-box-geometry *args="[60, 60, 60]"></ngt-box-geometry>
        </ngt-mesh>
        <ngt-ambient-light intensity="1"></ngt-ambient-light>
        <ngt-point-light [position]="[200, 200, 100]" intensity="0.5"></ngt-point-light>
      </ng-template>
    </ngt-portal>
  `,
  imports: [
    NgtPortal,
    NgtPortalContent,
    NgtPush,
    NgtArgs,
    NgtRepeat,
    NgtRef,
    NgtAttachArray,
    NgtsOrthographicCamera,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewCube extends NgtRxStore {
  readonly #store = injectNgtStore();
  readonly #matrix = new Matrix4();

  readonly Math = Math;
  readonly position$ = this.#store.select(
    'size',
    (size) => [size.width / 2 - 80, size.height / 2 - 80, 0] as NgtVector3
  );
  readonly meshRef = injectNgtRef<Mesh>();

  hovered = -1;

  onBeforeRender({ camera }: NgtRenderState) {
    if (this.meshRef.nativeElement) {
      this.#matrix.copy(camera.matrix).invert();
      this.meshRef.nativeElement.quaternion.setFromRotationMatrix(this.#matrix);
    }
  }
}

@Component({
  selector: 'view-cube-scene',
  standalone: true,
  template: `
    <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
    <ngt-mesh scale="2">
      <ngt-torus-geometry *args="[1, 0.25, 32, 100]"></ngt-torus-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
    </ngt-mesh>
    <ngts-orbit-controls></ngts-orbit-controls>
    <ngts-environment preset="city"></ngts-environment>
    <view-cube></view-cube>
  `,
  imports: [ViewCube, NgtArgs, NgtsOrbitControls, NgtsEnvironment],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}

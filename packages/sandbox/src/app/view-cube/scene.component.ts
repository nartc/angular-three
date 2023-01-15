import {
  extend,
  injectNgtRef,
  injectNgtStore,
  NgtArgs,
  NgtPortal,
  NgtPortalContent,
  NgtPush,
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
        <ngts-orthographic-camera [makeDefault]="true" [position]="[0, 0, 100]" />
        <ngt-mesh
          [ref]="meshRef"
          [position]="position$ | ngtPush : [0, 0, 0]"
          (pointerout)="hovered = -1"
          (pointermove)="hovered = Math.floor(($any($event).faceIndex || 0) / 2)"
        >
          <ngt-mesh-lambert-material
            *ngFor="let i; repeat: 6"
            [attach]="['material', i]"
            [color]="hovered === i ? 'orange' : 'white'"
          />
          <ngt-box-geometry *args="[60, 60, 60]" />
        </ngt-mesh>
        <ngt-ambient-light intensity="1" />
        <ngt-point-light [position]="200" intensity="0.5" />
      </ng-template>
    </ngt-portal>
  `,
  imports: [NgtPortal, NgtPortalContent, NgtPush, NgtArgs, NgtRepeat, NgtsOrthographicCamera],
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
    <ngt-ambient-light intensity="0.5" />
    <ngt-mesh scale="2">
      <ngt-torus-geometry *args="[1, 0.25, 32, 100]" />
      <ngt-mesh-standard-material />
    </ngt-mesh>
    <ngts-orbit-controls />
    <ngts-environment preset="city" />
    <view-cube />
  `,
  imports: [ViewCube, NgtArgs, NgtsOrbitControls, NgtsEnvironment],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}

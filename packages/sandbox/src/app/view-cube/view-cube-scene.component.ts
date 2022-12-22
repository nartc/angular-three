import {
  injectNgtStore,
  injectRef,
  NgtArgs,
  NgtAttachArray,
  NgtComponentStore,
  NgtPortal,
  NgtPortalContent,
  NgtPush,
  NgtRef,
  NgtRepeat,
  NgtScene,
  NgtVector3,
  prepare,
  tapEffect,
} from '@angular-three/core';
import { NgtsOrthographicCamera } from '@angular-three/soba/cameras';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { injectCameraRaycast } from '@angular-three/soba/misc';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'view-cube',
  standalone: true,
  template: `
    <ngt-portal
      [container]="virtualSceneRef"
      [state]="{ camera: virtualCamRef, events: { priority: events.priority + 1 } }"
    >
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
            ></ngt-mesh-lambert-material>
          </ng-container>
          <ngt-box-geometry *args="[60, 60, 60]"></ngt-box-geometry>
        </ngt-mesh>
        <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
        <ngt-point-light [position]="10" intensity="0.5"></ngt-point-light>
      </ng-template>
    </ngt-portal>
  `,
  imports: [
    NgtPortal,
    NgtPortalContent,
    NgtRef,
    NgtsOrthographicCamera,
    NgtRepeat,
    NgtAttachArray,
    NgtArgs,
    NgtPush,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewCube extends NgtComponentStore implements OnInit {
  hovered = -1;

  private readonly store = injectNgtStore();
  readonly events = this.store.get((s) => s.events);

  readonly position$ = this.select(
    this.store.select((s) => s.size),
    (size) => [size.width / 2 - 80, size.height / 2 - 80, 0] as NgtVector3
  );

  readonly meshRef = injectRef<THREE.Mesh>();
  readonly virtualCamRef = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
  readonly cameraRaycast = injectCameraRaycast(this.virtualCamRef);
  readonly virtualSceneRef = injectRef<THREE.Scene>(prepare(new THREE.Scene()));
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    setTimeout(() => {
      console.log(this.virtualSceneRef.nativeElement);
      console.log(this.cameraRaycast);
    }, 1000);

    this.effect(
      tap(() => {
        const size = this.store.get((s) => s.size);
        this.virtualCamRef.left = -size.width / 2;
        this.virtualCamRef.right = size.width / 2;
        this.virtualCamRef.top = size.height / 2;
        this.virtualCamRef.bottom = -size.height / 2;
        this.virtualCamRef.position.set(0, 0, 100);
        this.virtualCamRef.updateProjectionMatrix();
      })
    )(this.store.select((s) => s.size, { debounce: true }));

    this.effect<void>(
      tapEffect(() => {
        const matrix = new THREE.Matrix4();
        return this.store
          .get((s) => s.internal)
          .subscribe(
            ({ scene, camera, gl }) => {
              if (this.virtualCamRef && this.meshRef.nativeElement) {
                matrix.copy(camera.matrix).invert();
                this.meshRef.nativeElement.quaternion.setFromRotationMatrix(matrix);
                gl.autoClear = true;
                gl.render(scene, camera);
                gl.autoClear = false;
                gl.clearDepth();
                gl.render(this.virtualSceneRef.nativeElement, this.virtualCamRef);
              }
            },
            1,
            this.store
          );
      })
    )();
  }

  onPointerMove(faceIndex?: number) {
    this.hovered = Math.floor((faceIndex || 0) / 2);
  }
}

@NgtScene()
@Component({
  standalone: true,
  template: `
    <ngt-mesh>
      <ngt-torus-geometry *args="[1, 0.5, 32, 100]"></ngt-torus-geometry>
      <ngt-mesh-normal-material></ngt-mesh-normal-material>
    </ngt-mesh>
    <ngts-orbit-controls></ngts-orbit-controls>
    <view-cube></view-cube>
  `,
  imports: [NgtArgs, NgtsOrbitControls, ViewCube],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class Scene {}

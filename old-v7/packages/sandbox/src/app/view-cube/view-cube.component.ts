import {
  NgtCanvas,
  NgtComponentStore,
  NgtPortal,
  NgtRef,
  NgtRepeat,
  NgtStore,
  NgtVector3,
  tapEffect,
} from '@angular-three/core';
import { NgtColorAttribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry, NgtTorusGeometry } from '@angular-three/core/geometries';
import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtMeshLambertMaterial, NgtMeshNormalMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtSobaOrthographicCamera } from '@angular-three/soba/cameras';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgtSobaUseCamera } from '@angular-three/soba/misc';
import { Component, inject, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'view-cube',
  standalone: true,
  template: `
    <ngt-portal [container]="virtualScene">
      <ngt-soba-orthographic-camera [ref]="virtualCam" [position]="[0, 0, 100]"></ngt-soba-orthographic-camera>
      <ngt-mesh
        [ref]="meshRef"
        [raycast]="virtualCam | useCamera"
        [position]="position$"
        (pointerout)="hovered = -1"
        (pointermove)="onPointerMove($event.faceIndex)"
      >
        <ngt-mesh-lambert-material
          *ngFor="let i; repeat: 6"
          [attach]="['material', i]"
          [color]="hovered === i ? 'hotpink' : 'white'"
        ></ngt-mesh-lambert-material>
        <ngt-box-geometry [args]="[60, 60, 60]"></ngt-box-geometry>
      </ngt-mesh>
      <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
      <ngt-point-light [position]="[10, 10, 10]" intensity="0.5"></ngt-point-light>
    </ngt-portal>
  `,

  imports: [
    NgtPortal,
    NgtSobaOrthographicCamera,
    NgtMesh,
    NgtSobaUseCamera,
    NgtMeshLambertMaterial,
    NgtRepeat,
    NgtBoxGeometry,
    NgtAmbientLight,
    NgtPointLight,
  ],
})
class ViewCube extends NgtComponentStore implements OnInit {
  hovered = -1;

  private readonly store = inject(NgtStore);

  readonly position$ = this.select(
    this.store.select((s) => s.size),
    (size) => [size.width / 2 - 80, size.height / 2 - 80, 0] as NgtVector3,
    { debounce: true }
  );

  get virtualScene() {
    return this.getState((s) => s.virtualScene);
  }

  get virtualCam() {
    return this.getState((s) => s.virtualCam);
  }

  get meshRef() {
    return this.getState((s) => s.meshRef);
  }

  ngOnInit() {
    this.store.onReady(() => {
      this.patchState({
        meshRef: new NgtRef(),
        virtualScene: new NgtRef(new THREE.Scene()),
        virtualCam: new NgtRef(),
      });

      this.effect<void>(
        tapEffect(() => {
          const matrix = new THREE.Matrix4();
          return this.store.registerBeforeRender({
            priority: 1,
            callback: ({ scene, camera, gl }) => {
              if (this.virtualCam.value && this.meshRef.value) {
                matrix.copy(camera.matrix).invert();
                this.meshRef.value.quaternion.setFromRotationMatrix(matrix);
                gl.autoClear = true;
                gl.render(scene, camera);
                gl.autoClear = false;
                gl.clearDepth();
                gl.render(this.virtualScene.value, this.virtualCam.value);
              }
            },
          });
        })
      )();
    });
  }

  onPointerMove(faceIndex: number | undefined) {
    this.hovered = Math.floor((faceIndex || 0) / 2);
  }
}

@Component({
  selector: 'scene',
  standalone: true,
  template: `
    <ngt-mesh>
      <ngt-torus-geometry [args]="[1, 0.5, 32, 100]"></ngt-torus-geometry>
      <ngt-mesh-normal-material></ngt-mesh-normal-material>
    </ngt-mesh>
    <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
    <view-cube></view-cube>
  `,

  imports: [NgtMesh, NgtTorusGeometry, NgtMeshNormalMaterial, NgtSobaOrbitControls, ViewCube],
})
class Scene {}

@Component({
  selector: 'sandbox-view-cube',
  standalone: true,
  template: `
    <ngt-canvas initialLog>
      <scene></scene>
    </ngt-canvas>
  `,

  imports: [NgtCanvas, Scene, NgtColorAttribute],
})
export default class ViewCubeComponent {}

import {
  NgtCanvas,
  NgtObjectPassThrough,
  NgtObjectProps,
  NgtRadianPipe,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtGroup } from '@angular-three/core/group';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import { NgtSobaStage, NgtSobaStageContent } from '@angular-three/soba/staging';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

interface ShoeGLTF extends GLTF {
  nodes: {
    [key in 'shoe' | 'shoe_1' | 'shoe_2' | 'shoe_3' | 'shoe_4' | 'shoe_5' | 'shoe_6' | 'shoe_7']: THREE.Mesh;
  };
  materials: {
    [key in 'laces' | 'mesh' | 'caps' | 'inner' | 'sole' | 'stripes' | 'band' | 'patch']: THREE.MeshStandardMaterial;
  };
}

@Component({
  selector: 'sandbox-shoe',
  standalone: true,
  template: `
    <ng-container *ngIf="shoe$ | async as shoe">
      <ngt-group [ngtObjectPassThrough]="this">
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe.geometry" [material]="shoe.materials.laces">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>

        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_1.geometry">
          <ngt-mesh-standard-material
            [color]="$any(color)"
            [aoMap]="shoe.materials.mesh.aoMap"
            [normalMap]="shoe.materials.mesh.normalMap"
            [roughnessMap]="shoe.materials.mesh.roughnessMap"
            [metalnessMap]="shoe.materials.mesh.metalnessMap"
            envMapIntensity="0.8"
          >
            <ngt-value [attach]="['normalMap', 'encoding']" [value]="encoding"></ngt-value>
          </ngt-mesh-standard-material>
        </ngt-mesh>

        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_2.geometry" [material]="shoe.materials.caps">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_3.geometry" [material]="shoe.materials.inner">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_4.geometry" [material]="shoe.materials.sole">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_5.geometry" [material]="shoe.materials.stripes">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_6.geometry" [material]="shoe.materials.band">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_7.geometry" [material]="shoe.materials.patch">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
      </ngt-group>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtObject(Shoe), provideObjectRef(Shoe), provideObjectHostRef(Shoe)],
  imports: [NgIf, AsyncPipe, NgtGroup, NgtObjectPassThrough, NgtMesh, NgtValueAttribute, NgtMeshStandardMaterial],
})
export class Shoe extends NgtObjectProps<THREE.Group> {
  private gltfLoader = inject(NgtGLTFLoader);

  readonly shoe$: Observable<ShoeGLTF> = this.gltfLoader.load('assets/shoe.gltf') as Observable<ShoeGLTF>;
  readonly encoding = THREE.LinearEncoding;
}

@Component({
  selector: 'sandbox-scene',
  standalone: true,
  template: `
    <ngt-soba-stage environment="city" intensity="0.6">
      <ng-template ngt-soba-stage-content>
        <sandbox-shoe color="tomato" [position]="[0, 0, 0]"></sandbox-shoe>
        <sandbox-shoe
          color="orange"
          [scale]="-1"
          [rotation]="[0, 0.5, 180 | radian]"
          [position]="[0, 0, -2]"
        ></sandbox-shoe>
      </ng-template>
    </ngt-soba-stage>

    <ngt-soba-orbit-controls autoRotate></ngt-soba-orbit-controls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtSobaStage, NgtSobaStageContent, Shoe, NgtRadianPipe, NgtSobaOrbitControls],
})
export class Scene {}

@Component({
  selector: 'sandbox-reuse-gltf',
  standalone: true,
  template: `
    <ngt-canvas shadows [dpr]="[1, 2]" initialLog [camera]="{ position: [0, 0, 150], fov: 40 }">
      <sandbox-scene></sandbox-scene>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtCanvas, Scene],
})
export class ReuseGltfComponent {}

import { NgtCanvas, NgtObjectPassThrough, NgtRadianPipe } from '@angular-three/core';
import { NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtGroup, NgtMesh } from '@angular-three/core/objects';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgtGLTFLoader, NgtSobaLoader } from '@angular-three/soba/loaders';
import { NgtSobaStage } from '@angular-three/soba/staging';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  selector: 'shoe',
  standalone: true,
  template: `
    <ng-container *ngIf="shoe$ | async as shoe">
      <ngt-group shouldPassThroughRef skipColor [ngtObjectPassThrough]="this" [dispose]="null">
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
  imports: [
    NgIf,
    AsyncPipe,
    NgtGroup,
    NgtObjectPassThrough,
    NgtMesh,
    NgtValueAttribute,
    NgtMeshStandardMaterial,
    NgtGroup,
    NgtObjectPassThrough,
    NgtMesh,
    NgtValueAttribute,
    NgtMeshStandardMaterial,
  ],
})
class Shoe extends NgtGroup {
  override isWrapper = true;

  readonly shoe$: Observable<ShoeGLTF> = inject(NgtGLTFLoader).load('assets/shoe.gltf') as Observable<ShoeGLTF>;
  readonly encoding = THREE.LinearEncoding;
}

@Component({
  selector: 'scene',
  standalone: true,
  template: `
    <ngt-soba-stage environment="city" intensity="0.6">
      <shoe color="tomato" [position]="[0, 0, 0]"></shoe>
      <shoe color="orange" [scale]="-1" [rotation]="[0, 0.5, 180 | radian]" [position]="[0, 0, -2]"></shoe>
    </ngt-soba-stage>

    <ngt-soba-orbit-controls autoRotate></ngt-soba-orbit-controls>
  `,
  imports: [NgtSobaStage, NgtSobaOrbitControls, Shoe, NgtRadianPipe],
})
class Scene {}

@Component({
  selector: 'sandbox-resuse-gltf',
  standalone: true,
  template: `
    <ngt-canvas shadows [dpr]="[1, 2]" initialLog [camera]="{ position: [0, 0, 150], fov: 40 }">
      <scene></scene>
    </ngt-canvas>
    <ngt-soba-loader></ngt-soba-loader>
  `,
  imports: [NgtCanvas, Scene, NgtSobaLoader],
})
export default class SandboxReuseGLTF {}

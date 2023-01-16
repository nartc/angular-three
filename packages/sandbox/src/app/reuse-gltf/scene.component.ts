import { extend, NgtPush } from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgtsBakeShadows } from '@angular-three/soba/misc';
import { NgtsStage } from '@angular-three/soba/staging';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Group, LinearEncoding, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';
import { GLTF } from 'three-stdlib';

interface ShoeGLTF extends GLTF {
  nodes: {
    [key in
      | 'shoe'
      | 'shoe_1'
      | 'shoe_2'
      | 'shoe_3'
      | 'shoe_4'
      | 'shoe_5'
      | 'shoe_6'
      | 'shoe_7']: THREE.Mesh;
  };
  materials: {
    [key in
      | 'laces'
      | 'mesh'
      | 'caps'
      | 'inner'
      | 'sole'
      | 'stripes'
      | 'band'
      | 'patch']: THREE.MeshStandardMaterial;
  };
}

extend({ Group, Mesh, MeshStandardMaterial, SphereGeometry });

@Component({
  selector: 'sandbox-shoe',
  standalone: true,
  template: `
    <ngt-group ngtCompound>
      <ng-container *ngIf="shoe$ | ngtPush : null as shoe">
        <ngt-mesh
          castShadow
          receiveShadow
          [geometry]="shoe.nodes.shoe.geometry"
          [material]="shoe.materials.laces"
        >
          <ngt-value attach="material.envMapIntensity" [rawValue]="0.8" />
        </ngt-mesh>
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_1.geometry">
          <ngt-mesh-standard-material
            [color]="color"
            [aoMap]="shoe.materials.mesh.aoMap"
            [normalMap]="shoe.materials.mesh.normalMap"
            [roughnessMap]="shoe.materials.mesh.roughnessMap"
            [metalnessMap]="shoe.materials.mesh.metalnessMap"
            envMapIntensity="0.8"
          >
            <ngt-value attach="normalMap.encoding" [rawValue]="LinearEncoding" />
          </ngt-mesh-standard-material>
        </ngt-mesh>
        <ngt-mesh
          castShadow
          receiveShadow
          [geometry]="shoe.nodes.shoe_2.geometry"
          [material]="shoe.materials.caps"
        >
          <ngt-value attach="material.envMapIntensity" [rawValue]="0.8" />
        </ngt-mesh>

        <ngt-mesh
          castShadow
          receiveShadow
          [geometry]="shoe.nodes.shoe_3.geometry"
          [material]="shoe.materials.inner"
        >
          <ngt-value attach="material.envMapIntensity" [rawValue]="0.8" />
        </ngt-mesh>

        <ngt-mesh
          castShadow
          receiveShadow
          [geometry]="shoe.nodes.shoe_4.geometry"
          [material]="shoe.materials.sole"
        >
          <ngt-value attach="material.envMapIntensity" [rawValue]="0.8" />
        </ngt-mesh>

        <ngt-mesh
          castShadow
          receiveShadow
          [geometry]="shoe.nodes.shoe_5.geometry"
          [material]="shoe.materials.stripes"
        >
          <ngt-value attach="material.envMapIntensity" [rawValue]="0.8" />
        </ngt-mesh>

        <ngt-mesh
          castShadow
          receiveShadow
          [geometry]="shoe.nodes.shoe_6.geometry"
          [material]="shoe.materials.band"
        >
          <ngt-value attach="material.envMapIntensity" [rawValue]="0.8" />
        </ngt-mesh>

        <ngt-mesh
          castShadow
          receiveShadow
          [geometry]="shoe.nodes.shoe_7.geometry"
          [material]="shoe.materials.patch"
        >
          <ngt-value attach="material.envMapIntensity" [rawValue]="0.8" />
        </ngt-mesh>
      </ng-container>
    </ngt-group>
  `,
  imports: [NgtPush, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Shoe {
  @Input() color = 'white';

  readonly LinearEncoding = LinearEncoding;
  readonly shoe$ = injectNgtsGLTFLoader('assets/shoe.gltf') as Observable<ShoeGLTF>;
}

@Component({
  selector: 'sandbox-reuse-gltf-scene',
  standalone: true,
  template: `
    <ngts-stage [environment]="'city'" [intensity]="0.6">
      <sandbox-shoe color="tomato" [position]="[0, 0, 0]" />
      <sandbox-shoe
        color="orange"
        [scale]="-1"
        [position]="[0, 0, -2]"
        [rotation]="[0, 0.5, Math.PI]"
      />
    </ngts-stage>
    <ngts-bake-shadows />
    <ngts-orbit-controls [autoRotate]="true" />
  `,
  imports: [Shoe, NgtsStage, NgtsBakeShadows, NgtsOrbitControls],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {
  readonly Math = Math;
}

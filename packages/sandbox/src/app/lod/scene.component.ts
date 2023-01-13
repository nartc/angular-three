import { extend, NgtArgs, NgtEuler, NgtPush, NgtVector3 } from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgtsBakeShadows } from '@angular-three/soba/misc';
import { NgtsDetailed } from '@angular-three/soba/performance';
import { NgtsEnvironment } from '@angular-three/soba/staging';
import { NgFor } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Mesh, PointLight, SpotLight } from 'three';
import { GLTF } from 'three-stdlib';

const positions = [...Array(800)].map(() => ({
  position: [40 - Math.random() * 80, 40 - Math.random() * 80, 40 - Math.random() * 80],
  rotation: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
})) as Array<{ position: NgtVector3; rotation: NgtEuler }>;

interface BustGLTF extends GLTF {
  nodes: { Mesh_0001: THREE.Mesh };
  materials: { default: THREE.MeshStandardMaterial };
}

extend({ Mesh, PointLight, SpotLight });

@Component({
  selector: 'sandbox-bust',
  standalone: true,
  template: `
    <ngts-detailed [distances]="[0, 15, 25, 35, 100]" [position]="position" [rotation]="rotation">
      <ngt-mesh
        *ngFor="let level of levels$ | ngtPush : []"
        receiveShadow
        castShadow
        [geometry]="level.nodes.Mesh_0001.geometry"
        [material]="level.materials.default"
      >
        <ngt-value *args="[0.25]" attach="material.envMapIntensity"></ngt-value>
      </ngt-mesh>
    </ngts-detailed>
  `,
  imports: [NgtsDetailed, NgFor, NgtPush, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Bust {
  @Input() position: NgtVector3 = [0, 0, 0];
  @Input() rotation: NgtEuler = [0, 0, 0];

  readonly levels$ = injectNgtsGLTFLoader([
    'assets/bust-1-d.glb',
    'assets/bust-2-d.glb',
    'assets/bust-3-d.glb',
    'assets/bust-4-d.glb',
    'assets/bust-5-d.glb',
  ]) as Observable<BustGLTF[]>;
}

@Component({
  selector: 'sandbox-lod-scene',
  standalone: true,
  template: `
    <sandbox-bust
      *ngFor="let position of positions"
      [position]="position.position"
      [rotation]="position.rotation"
    ></sandbox-bust>
    <ngts-orbit-controls [zoomSpeed]="0.075"></ngts-orbit-controls>
    <ngt-point-light [position]="[0, 0, 0]" intensity="0.5"></ngt-point-light>
    <ngt-spot-light [position]="[50, 50, 50]" intensity="2.5" castShadow></ngt-spot-light>
    <ngts-environment preset="city"></ngts-environment>
    <ngts-bake-shadows></ngts-bake-shadows>
  `,
  imports: [Bust, NgtsOrbitControls, NgtsEnvironment, NgFor, NgtsBakeShadows],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {
  readonly positions = positions;
}

import { NgtCanvas, NgtEuler, NgtVector3 } from '@angular-three/core';
import { NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtPointLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgtGLTFLoader, NgtSobaLoader } from '@angular-three/soba/loaders';
import { NgtSobaDetailed } from '@angular-three/soba/performances';
import { NgtSobaEnvironment } from '@angular-three/soba/staging';
import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { GLTF } from 'three-stdlib';

const positions = [...Array(800)].map(() => ({
  position: [40 - Math.random() * 80, 40 - Math.random() * 80, 40 - Math.random() * 80],
  rotation: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
})) as Array<{ position: NgtVector3; rotation: NgtEuler }>;

interface BustGLTF extends GLTF {
  nodes: { Mesh_0001: THREE.Mesh };
  materials: { default: THREE.MeshStandardMaterial };
}

@Component({
  selector: 'bust',
  standalone: true,
  template: `
    <ngt-soba-detailed [distances]="[15, 25, 35, 100]" [position]="position" [rotation]="rotation">
      <ngt-mesh
        *ngFor="let level of levels$ | async"
        receiveShadow
        castShadow
        [geometry]="level.nodes.Mesh_0001.geometry"
        [material]="level.materials.default"
      >
        <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.25"></ngt-value>
      </ngt-mesh>
    </ngt-soba-detailed>
  `,
  imports: [NgtSobaDetailed, NgtMesh, NgForOf, AsyncPipe, NgtValueAttribute],
})
class Bust {
  @Input() position?: NgtVector3;
  @Input() rotation?: NgtEuler;

  readonly levels$ = inject(NgtGLTFLoader).load([
    'assets/bust-1-d.glb',
    'assets/bust-2-d.glb',
    'assets/bust-3-d.glb',
    'assets/bust-4-d.glb',
  ]) as Observable<BustGLTF[]>;
}
@Component({
  selector: 'scene',
  standalone: true,
  template: `
    <bust *ngFor="let position of positions" [position]="position.position" [rotation]="position.rotation"></bust>
    <ngt-soba-orbit-controls zoomSpeed="0.075"></ngt-soba-orbit-controls>
    <ngt-point-light [position]="[0, 0, 0]" intensity="0.5"></ngt-point-light>
    <ngt-spot-light intensity="2.5" [position]="[50, 50, 50]" castShadow></ngt-spot-light>
    <ngt-soba-environment preset="city"></ngt-soba-environment>
  `,
  imports: [NgtSobaOrbitControls, NgtPointLight, NgtSpotLight, NgtSobaEnvironment, Bust, NgForOf],
})
class Scene {
  readonly positions = positions;
}

@Component({
  selector: 'sandbox-level-of-detail',
  standalone: true,
  template: `
    <ngt-canvas
      shadows
      frameloop="demand"
      [dpr]="[1, 2]"
      [camera]="{ position: [0, 0, 40] }"
      (created)="$event.gl.shadowMap.autoUpdate = false; $event.gl.shadowMap.needsUpdate = true"
    >
      <scene></scene>
    </ngt-canvas>
    <ngt-soba-loader></ngt-soba-loader>
  `,
  imports: [NgtCanvas, Scene, NgtSobaLoader],
})
export default class SandboxLevelOfDetail {}

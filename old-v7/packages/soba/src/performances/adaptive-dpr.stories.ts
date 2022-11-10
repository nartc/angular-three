import { NgtRadianPipe } from '@angular-three/core';
import { NgtValueAttribute, NgtVector2Attribute } from '@angular-three/core/attributes';
import { NgtDirectionalLight } from '@angular-three/core/lights';
import { NgtGroup, NgtMesh } from '@angular-three/core/objects';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { NgtSobaOrbitControls } from '../../controls/src';
import { NgtSobaAdaptiveDpr, NgtSobaAdaptiveEvents } from '../../performances/src';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

interface ArcherGLTF extends GLTF {
  materials: { material_0: THREE.Material };
  nodes: Record<'mesh_0' | 'mesh_1' | 'mesh_2', THREE.Mesh>;
}

@Component({
  selector: 'storybook-default-archer',
  standalone: true,
  template: `
    <ng-container *ngIf="archer$ | async as archer">
      <ngt-group [dispose]="null">
        <ngt-group [rotation]="[-90 | radian, 0, 0]">
          <ngt-group [position]="[0, 0, 2]">
            <ngt-mesh
              castShadow
              receiveShadow
              [material]="archer.materials.material_0"
              [geometry]="archer.nodes['mesh_0'].geometry"
            ></ngt-mesh>
            <ngt-mesh
              castShadow
              receiveShadow
              [material]="archer.materials.material_0"
              [geometry]="archer.nodes['mesh_1'].geometry"
            ></ngt-mesh>
            <ngt-mesh
              castShadow
              receiveShadow
              [material]="archer.materials.material_0"
              [geometry]="archer.nodes['mesh_2'].geometry"
            ></ngt-mesh>
          </ngt-group>
        </ngt-group>
      </ngt-group>
    </ng-container>
  `,
  imports: [NgIf, AsyncPipe, NgtGroup, NgtMesh, NgtRadianPipe],
})
class DefaultArcher {
  readonly archer$ = inject(NgtGLTFLoader).load('soba/archer.glb') as Observable<ArcherGLTF>;
}

@Component({
  selector: 'storybook-default-adaptive',
  standalone: true,
  template: `
    <storybook-default-archer></storybook-default-archer>
    <ngt-directional-light intensity="0.2" [position]="[10, 10, 5]" castShadow>
      <ngt-vector2 [attach]="['shadow', 'mapSize']" [vector2]="[64, 64]"></ngt-vector2>
      <ngt-value [attach]="['shadow', 'bias']" [value]="-0.001"></ngt-value>
    </ngt-directional-light>
    <ngt-soba-adaptive-dpr pixelated></ngt-soba-adaptive-dpr>
    <ngt-soba-adaptive-events></ngt-soba-adaptive-events>
    <ngt-soba-orbit-controls regress></ngt-soba-orbit-controls>
  `,
  imports: [
    DefaultArcher,
    NgtDirectionalLight,
    NgtVector2Attribute,
    NgtValueAttribute,
    NgtSobaAdaptiveDpr,
    NgtSobaAdaptiveEvents,
    NgtSobaOrbitControls,
  ],
})
class DefaultAdaptive {}

export default {
  title: 'Performances/Adaptive DPR',
  decorators: [
    componentWrapperDecorator(
      setupCanvas({
        camera: { position: [0, 0, 30], fov: 50 },
        controls: false,
        lights: false,
        performance: { min: 0.2 },
      })
    ),
    moduleMetadata({
      imports: [setupCanvasImports, DefaultAdaptive],
    }),
  ],
} as Meta;

export const Default: Story = () => ({
  template: '<storybook-default-adaptive></storybook-default-adaptive>',
});

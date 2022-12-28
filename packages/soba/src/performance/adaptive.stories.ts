import { extend, NgtArgs, NgtPush } from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgtsAdaptiveDpr, NgtsAdaptiveEvents } from '@angular-three/soba/performance';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { Observable } from 'rxjs';
import { DirectionalLight, Group, Mesh, Vector2 } from 'three';
import { GLTF } from 'three-stdlib';
import { StorybookSetup } from '../setup-canvas';

interface ArcherGLTF extends GLTF {
  materials: { material_0: THREE.Material };
  nodes: Record<'mesh_0' | 'mesh_1' | 'mesh_2', THREE.Mesh>;
}

extend({
  DirectionalLight,
  Vector2,
  Group,
  Mesh,
});

@Component({
  selector: 'archer',
  standalone: true,
  template: `
    <ng-container *ngIf="archer$ | ngtPush as archer">
      <ngt-group>
        <ngt-group [rotation]="[-Math.PI / 2, 0, 0]">
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
  imports: [NgIf, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class Archer {
  readonly archer$ = injectNgtsGLTFLoader('soba/archer.glb') as Observable<ArcherGLTF>;
  readonly Math = Math;
}

@Component({
  selector: 'storybook-adaptive',
  standalone: true,
  template: `
    <archer></archer>
    <ngt-directional-light intensity="0.2" [position]="[10, 10, 5]" castShadow>
      <ngt-vector2 *args="[64, 64]" attach="shadow.mapSize"></ngt-vector2>
      <ngt-value *args="[-0.001]" attach="shadow.bias"></ngt-value>
    </ngt-directional-light>
    <ngts-adaptive-dpr></ngts-adaptive-dpr>
    <ngts-adaptive-events></ngts-adaptive-events>
    <ngts-orbit-controls [regress]="true"></ngts-orbit-controls>
  `,
  imports: [NgtArgs, NgtsAdaptiveDpr, NgtsAdaptiveEvents, NgtsOrbitControls, Archer],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class AdaptiveStory {}

export default {
  title: 'Performance/Adaptive DPR',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = () => ({
  props: {
    camera: { position: [0, 0, 30], fov: 50 },
    controls: false,
    lights: false,
    performance: { min: 0.2 },
    storyComponent: AdaptiveStory,
  },
  template: `
<storybook-setup [camera]="camera" [controls]="controls" [lights]="lights" [performance]="performance" [storyComponent]="storyComponent">
</storybook-setup>
  `,
});

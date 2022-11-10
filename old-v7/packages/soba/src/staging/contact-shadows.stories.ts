import { NgtRadianPipe, NgtRenderState } from '@angular-three/core';
import { NgtPlaneGeometry, NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtSobaContactShadows } from '@angular-three/soba/staging';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import * as THREE from 'three';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

export default {
  title: 'Staging/Contact Shadows',
  decorators: [
    componentWrapperDecorator(setupCanvas()),
    moduleMetadata({
      imports: [
        setupCanvasImports,
        NgtMesh,
        NgtSphereGeometry,
        NgtPlaneGeometry,
        NgtMeshBasicMaterial,
        NgtSobaContactShadows,
        NgtRadianPipe,
      ],
    }),
  ],
} as Meta;

function animate({ object, state: { clock } }: { state: NgtRenderState; object: THREE.Object3D }) {
  object.position.y = Math.sin(clock.getElapsedTime()) + 2.5;
}

export const Default: Story = (args) => ({
  props: { ...args, animate },
  template: `
<ngt-mesh [position]="[0, 2, 0]" (beforeRender)="animate($event)">
  <ngt-sphere-geometry [args]="[1, 32, 32]"></ngt-sphere-geometry>
  <ngt-mesh-basic-material color="#2A8AFF"></ngt-mesh-basic-material>
</ngt-mesh>
<ngt-soba-contact-shadows
  far="3"
  blur="3"
  [position]="[0, 0, 0]"
  [scale]="10"
  [rotation]="[90 | radian, 0, 0]"
  [color]="colorized ? '#2A8AFF' : 'black'"
></ngt-soba-contact-shadows>
<ngt-mesh [position]="[0, -0.01, 0]" [rotation]="[-90 | radian, 0, 0]">
  <ngt-plane-geometry [args]="[10, 10]"></ngt-plane-geometry>
  <ngt-mesh-basic-material color="white"></ngt-mesh-basic-material>
</ngt-mesh>
    `,
});

Default.args = {
  colorized: false,
};

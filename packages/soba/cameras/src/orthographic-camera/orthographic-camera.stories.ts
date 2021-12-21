import { NgtCoreModule, NgtVector3 } from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtSobaIcosahedronModule } from '@angular-three/soba/shapes';
import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import {
  NgtSobaOrthographicCamera,
  NgtSobaOrthographicCameraModule,
} from './orthographic-camera.component';

const NUM = 3;
const half = (NUM - 1) / 2;

const positions: NgtVector3[] = [];
for (let x = 0; x < NUM; x++) {
  for (let y = 0; y < NUM; y++) {
    positions.push([(x - half) * 4, (y - half) * 4, 0]);
  }
}

export default {
  title: 'Soba/Cameras/Orthographic Camera',
  component: NgtSobaOrthographicCamera,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        NgtCoreModule,
        NgtSobaOrthographicCameraModule,
        NgtSobaOrbitControlsModule,
        NgtGroupModule,
        NgtSobaIcosahedronModule,
        NgtMeshBasicMaterialModule,
      ],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
    <ngt-canvas (created)='$event.renderer.setClearColor("black")'>
      <ngt-soba-orthographic-camera (ready)='$event.zoom = 40' [makeDefault]='true' [position]='[0, 0, 10]'></ngt-soba-orthographic-camera>
      <ngt-group [position]='[0, 0, -10]'>
        <ngt-soba-icosahedron *ngFor='let position of positions' [position]='position' [args]='[1, 1]'>
          <ngt-mesh-basic-material [parameters]='{color: "white", wireframe: true}'></ngt-mesh-basic-material>
        </ngt-soba-icosahedron>
      </ngt-group>
      <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
    </ngt-canvas>
  `,
});

Default.args = {
  positions,
};

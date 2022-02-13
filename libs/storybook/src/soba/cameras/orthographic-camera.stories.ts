import {
    NgtColorPipeModule,
    NgtCoreModule,
    NgtVector3,
} from '@angular-three/core';
import { NgtIcosahedronGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaOrthographicCameraModule } from '@angular-three/soba/cameras';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

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
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                NgtCoreModule,
                NgtSobaOrthographicCameraModule,
                NgtGroupModule,
                NgtIcosahedronGeometryModule,
                NgtMeshModule,
                NgtMeshBasicMaterialModule,
                NgtSobaOrbitControlsModule,
                NgtColorPipeModule,
            ],
        }),
    ],
} as Meta;

export const Default: Story = (args) => ({
    props: args,
    template: `
      <ngt-canvas [scene]="{background: 'black'|color}">
          <ngt-soba-orthographic-camera (ready)="$event.zoom = 40" [makeDefault]="true" [position]="[0, 0, 10]"></ngt-soba-orthographic-camera>
          <ngt-icosahedron-geometry
            #ngtGeometry="ngtIcosahedronGeometry"
            [args]="[1, 1]"
          ></ngt-icosahedron-geometry>
          <ngt-mesh-basic-material
            #ngtMaterial="ngtMeshBasicMaterial"
            [parameters]='{color: "white", wireframe: true}'
          ></ngt-mesh-basic-material>
          <ngt-group [position]="[0, 0, -10]">
            <ngt-mesh
              *ngFor="let position of positions"
              [geometry]="ngtGeometry.geometry"
              [material]="ngtMaterial.material"
              [position]="position"
            ></ngt-mesh>
          </ngt-group>
          <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
      </ngt-canvas>
  `,
});

Default.args = {
    positions,
};

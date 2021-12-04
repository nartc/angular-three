import { NgtCoreModule } from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import {
  NgtAmbientLightModule,
  NgtSpotLightModule,
} from '@angular-three/core/lights';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { Meta, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Introduction/Examples',
  decorators: [
    moduleMetadata({
      imports: [
        NgtCoreModule,
        NgtMeshModule,
        NgtMeshStandardMaterialModule,
        NgtBoxGeometryModule,
        NgtAmbientLightModule,
        NgtSpotLightModule,
      ],
    }),
  ],
  parameters: { viewMode: 'story' },
} as Meta;

export const SimpleCube = () => ({
  template: `
    <ngt-canvas [camera]='{position: [0, 0, 2]}'>
      <ngt-ambient-light></ngt-ambient-light>
      <ngt-spot-light [position]='[1, 1, 1]'></ngt-spot-light>

      <ngt-mesh #mesh='ngtMesh' (animateReady)='
        mesh.mesh.rotation.x = mesh.mesh.rotation.x + 0.01;
        mesh.mesh.rotation.y = mesh.mesh.rotation.y + 0.01
      '>
        <ngt-mesh-standard-material
          [parameters]="{ color: 'turquoise' }"
        ></ngt-mesh-standard-material>
        <ngt-box-geometry></ngt-box-geometry>
      </ngt-mesh>
    </ngt-canvas>
  `,
  id: 'introduction--simple-cube',
});

import { NgtCoreModule } from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { Meta, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Introduction/Examples',
  decorators: [
    moduleMetadata({
      imports: [
        NgtCoreModule,
        NgtMeshModule,
        NgtMeshBasicMaterialModule,
        NgtBoxGeometryModule,
      ],
    }),
  ],
  parameters: { viewMode: 'story' },
} as Meta;

export const SimpleCube = () => ({
  template: `
    <ngt-canvas>
      <ngt-mesh #mesh='ngtMesh' (animateReady)='
        mesh.mesh.rotation.x = mesh.mesh.rotation.x + 0.01;
        mesh.mesh.rotation.y = mesh.mesh.rotation.y + 0.01
      '>
        <ngt-mesh-basic-material
          [parameters]="{ color: 'turquoise' }"
        ></ngt-mesh-basic-material>
        <ngt-box-geometry></ngt-box-geometry>
      </ngt-mesh>
    </ngt-canvas>
  `,
  id: 'introduction--simple-cube',
});

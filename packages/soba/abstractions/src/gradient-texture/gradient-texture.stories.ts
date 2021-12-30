import { NgtSidePipeModule } from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import { NgtSobaGradientTextureModule } from './gradient-texture.directive';

export default {
  title: 'Soba/Abstractions/Gradient Texture',
  decorators: [
    componentWrapperDecorator(setupCanvas({ black: true })),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaGradientTextureModule,
        NgtMeshModule,
        NgtMeshBasicMaterialModule,
        NgtPlaneGeometryModule,
        NgtSidePipeModule,
      ],
    }),
  ],
} as Meta;

export const Default = () => ({
  template: `
    <ngt-mesh>
      <ngt-plane-geometry></ngt-plane-geometry>
      <ngt-mesh-basic-material [parameters]='{depthWrite: false, side: ""|side:"double"}'>
        <ngt-soba-gradient-texture [stops]='[0, 1]' [colors]='["aquamarine", "hotpink"]'></ngt-soba-gradient-texture>
      </ngt-mesh-basic-material>
    </ngt-mesh>
  `,
});

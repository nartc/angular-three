import { NgtSidePipe } from '@angular-three/core';
import { NgtPlaneGeometry } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtSobaGradientTexture } from '@angular-three/soba/abstractions';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

export default {
  title: 'Abstractions/Gradient Texture',
  decorators: [
    componentWrapperDecorator(setupCanvas({ camera: { position: [-5, 5, 5] } })),
    moduleMetadata({
      imports: [
        setupCanvasImports,
        NgtSobaGradientTexture,
        NgtMesh,
        NgtMeshBasicMaterial,
        NgtPlaneGeometry,
        NgtSidePipe,
      ],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
<ngt-mesh>
  <ngt-plane-geometry [args]="[5, 5]"></ngt-plane-geometry>
  <ngt-mesh-basic-material [depthWrite]="false" [side]="'double' | side">
    <ngt-soba-gradient-texture [stops]="stops" [colors]="colors"></ngt-soba-gradient-texture>
  </ngt-mesh-basic-material>
</ngt-mesh>
    `,
});

Default.args = {
  stops: [0, 1],
  colors: ['aquamarine', 'hotpink'],
};

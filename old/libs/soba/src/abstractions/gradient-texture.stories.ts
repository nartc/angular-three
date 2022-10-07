import { NgtSidePipeModule } from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaGradientTextureModule } from '@angular-three/soba/abstractions';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

export default {
  title: 'Abstractions/Gradient Texture',
  decorators: [
    componentWrapperDecorator(setupCanvas()),
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

export const Default: Story = (args) => ({
  props: args,
  template: `
        <ngt-mesh>
            <ngt-plane-geometry></ngt-plane-geometry>
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

import { NgtRadianPipeModule } from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtAxesHelperModule } from '@angular-three/core/helpers';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaStars, NgtSobaStarsModule } from '@angular-three/soba/staging';
import { componentWrapperDecorator, Meta, moduleMetadata } from '@storybook/angular';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

export default {
  title: 'Staging/Stars',
  component: NgtSobaStars,
  decorators: [
    componentWrapperDecorator(setupCanvas()),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtRadianPipeModule,
        NgtSobaStarsModule,
        NgtMeshModule,
        NgtPlaneGeometryModule,
        NgtAxesHelperModule,
        NgtMeshBasicMaterialModule,
      ],
    }),
  ],
} as Meta;

export const Default = () => ({
  template: `
        <ngt-soba-stars></ngt-soba-stars>
        <ngt-mesh [rotation]="[90 | radian, 0, 0]">
            <ngt-plane-geometry  [args]="[100, 100, 4, 4]"></ngt-plane-geometry>
            <ngt-mesh-basic-material wireframe></ngt-mesh-basic-material>
        </ngt-mesh>
        <ngt-axes-helper></ngt-axes-helper>
  `,
});

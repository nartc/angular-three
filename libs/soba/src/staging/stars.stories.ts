import { NgtRadianPipeModule } from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtAxesHelperModule } from '@angular-three/core/helpers';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaStars, NgtSobaStarsModule } from '@angular-three/soba/staging';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { createRangeControl } from '../create-control';
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

export const Default: Story = (args) => ({
    props: args,
  template: `
        <ngt-soba-stars [radius]="radius" [count]="count" [factor]="factor" [fade]="fade" [speed]="speed"></ngt-soba-stars>
        <ngt-mesh [rotation]="[90 | radian, 0, 0]">
            <ngt-plane-geometry  [args]="[100, 100, 4, 4]"></ngt-plane-geometry>
            <ngt-mesh-basic-material wireframe></ngt-mesh-basic-material>
        </ngt-mesh>
        <ngt-axes-helper></ngt-axes-helper>
  `,
});

Default.args = {
    radius: 100,
    count: 5000,
    factor: 4,
    fade: false,
    speed: 1,

};

Default.argTypes = {
    radius: {
        control: createRangeControl(100, 400, 100),
    },
    count: {
        control: createRangeControl(500, 5000, 500),
    },
    factor: {
        control: createRangeControl(1, 10, 1),
    },
    speed: {
        control: createRangeControl(1, 4, 1),
    },
};

import { NgtRadianPipe } from '@angular-three/core';
import { NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtPlaneGeometry } from '@angular-three/core/geometries';
import { NgtAxesHelper } from '@angular-three/core/helpers';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtSobaSky } from '@angular-three/soba/staging';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { createRangeControl } from '../create-control';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

export default {
  title: 'Staging/Sky',
  decorators: [
    componentWrapperDecorator(setupCanvas()),
    moduleMetadata({
      imports: [
        setupCanvasImports,
        NgtSobaSky,
        NgtAxesHelper,
        NgtMesh,
        NgtPlaneGeometry,
        NgtMeshBasicMaterial,
        NgtRadianPipe,
        NgtValueAttribute,
      ],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
        <ngt-soba-sky
          [turbidity]="turbidity"
          [rayleigh]="rayleigh"
          [mieCoefficient]="mieCoefficient"
          [mieDirectionalG]="mieDirectionalG"
          [sunPosition]="[sunPositionX, sunPositionY, sunPositionZ]"
        ></ngt-soba-sky>
        <ngt-mesh>
            <ngt-value [attach]="['rotation', 'x']" [value]="90 | radian"></ngt-value>
            <ngt-plane-geometry [args]="[100, 100, 4, 4]"></ngt-plane-geometry>
            <ngt-mesh-basic-material color="black" wireframe></ngt-mesh-basic-material>
        </ngt-mesh>
        <ngt-axes-helper></ngt-axes-helper>
    `,
});

Default.args = {
  turbidity: 8,
  rayleigh: 6,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.8,
  sunPositionX: 0,
  sunPositionY: 0,
  sunPositionZ: 0,
};
Default.argTypes = {
  turbidity: {
    control: createRangeControl(0, 10, 0.1),
  },
  rayleigh: {
    control: createRangeControl(0, 10, 1),
  },
  mieCoefficient: {
    control: createRangeControl(0, 0.1, 0.001),
  },
  mieDirectionalG: {
    control: createRangeControl(0, 1, 0.1),
  },
};

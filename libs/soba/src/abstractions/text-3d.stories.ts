import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtSobaText3D } from '@angular-three/soba/abstractions';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { createRangeControl } from '../create-control';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

export default {
  title: 'Abstractions/Text 3D',
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ camera: { position: [0, 0, 10] } })
    ),
    moduleMetadata({
      imports: [setupCanvasImports, NgtSobaText3D, NgtMeshStandardMaterial],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
<ngt-soba-text-3d
  font="soba/helvetiker_regular.typeface.json"
  [text]="text"
  [size]="size"
  [height]="height"
  [curveSegments]="curveSegments"
  [bevelEnabled]="bevelEnabled"
  [bevelThickness]="bevelThickness"
  [bevelSize]="bevelSize"
  [bevelOffset]="bevelOffset"
>
  <ngt-mesh-standard-material [attach]="['material', 0]" color="#b00000"></ngt-mesh-standard-material>
  <ngt-mesh-standard-material [attach]="['material', 1]" color="#ff8000"></ngt-mesh-standard-material>
</ngt-soba-text-3d>
`,
});

Default.args = {
  text: `@angular-three`,
  size: 3,
  height: 0.5,
  curveSegments: 2,
  bevelEnabled: false,
  bevelThickness: 0.1,
  bevelSize: 0.1,
  bevelOffset: 0,
};

Default.argTypes = {
  size: {
    control: createRangeControl(1, 10, 1),
  },
  height: {
    control: createRangeControl(0.1, 5, 0.1),
  },
  curveSegments: {
    control: createRangeControl(1, 5, 1),
  },
  bevelThickness: {
    control: createRangeControl(0.1, 4, 0.1),
  },
  bevelSize: {
    control: createRangeControl(0.1, 4, 0.1),
  },
  bevelOffset: {
    control: createRangeControl(0, 0.4, 0.1),
  },
};

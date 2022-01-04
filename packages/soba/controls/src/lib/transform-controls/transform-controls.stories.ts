import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtSobaBoxModule } from '@angular-three/soba/shapes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import {
  NgtSobaTransformControls,
  NgtSobaTransformControlsModule,
} from './transform-controls.component';

export default {
  title: 'Soba/Controls/Transform Controls',
  component: NgtSobaTransformControls,
} as Meta;

export const Default: Story = () => ({
  template: `
    <ngt-soba-transform-controls>
      <ngt-soba-box>
        <ngt-mesh-basic-material [parameters]='{wireframe: true}'></ngt-mesh-basic-material>
      </ngt-soba-box>
    </ngt-soba-transform-controls>
  `,
});
Default.decorators = [
  componentWrapperDecorator(setupCanvas({ black: true })),
  moduleMetadata({
    imports: [
      ...setupCanvasModules,
      NgtSobaTransformControlsModule,
      NgtSobaBoxModule,
      NgtMeshBasicMaterialModule,
    ],
  }),
];

export const LockOrbitControls: Story = Default.bind({});
LockOrbitControls.decorators = [
  componentWrapperDecorator(
    setupCanvas({ black: true, makeControlsDefault: true })
  ),
  moduleMetadata({
    imports: [
      ...setupCanvasModules,
      NgtSobaTransformControlsModule,
      NgtSobaBoxModule,
      NgtMeshBasicMaterialModule,
    ],
  }),
];

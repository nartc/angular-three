import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtSobaBoxModule } from '@angular-three/soba/shapes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import {
  NgtSobaFirstPersonControls,
  NgtSobaFirstPersonControlsModule,
} from './first-person-controls.directive';

export default {
  title: 'Soba/Controls/First Person Controls',
  component: NgtSobaFirstPersonControls,
  decorators: [
    componentWrapperDecorator(setupCanvas({ controls: false, black: true })),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaFirstPersonControlsModule,
        NgtSobaBoxModule,
        NgtMeshBasicMaterialModule,
      ],
    }),
  ],
} as Meta;

export const Default = () => ({
  template: `
    <ngt-soba-first-person-controls></ngt-soba-first-person-controls>
    <ngt-soba-box>
      <ngt-mesh-basic-material [parameters]='{wireframe: true}'></ngt-mesh-basic-material>
    </ngt-soba-box>
  `,
});

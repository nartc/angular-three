import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtSobaBoxModule } from '@angular-three/soba/shapes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import {
  NgtSobaFlyControls,
  NgtSobaFlyControlsModule,
} from './fly-controls.directive';

export default {
  title: 'Soba/Controls/Fly Controls',
  component: NgtSobaFlyControls,
  decorators: [
    componentWrapperDecorator(setupCanvas({ controls: false, black: true })),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaFlyControlsModule,
        NgtSobaBoxModule,
        NgtMeshBasicMaterialModule,
      ],
    }),
  ],
} as Meta;

export const Default = () => ({
  template: `
    <ngt-soba-fly-controls></ngt-soba-fly-controls>
    <ngt-soba-box>
      <ngt-mesh-basic-material [parameters]='{wireframe: true}'></ngt-mesh-basic-material>
    </ngt-soba-box>
  `,
});

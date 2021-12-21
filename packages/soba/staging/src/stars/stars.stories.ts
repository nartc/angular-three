import { NgtMathPipeModule } from '@angular-three/core';
import { NgtAxesHelperModule } from '@angular-three/core/helpers';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtSobaPlaneModule } from '@angular-three/soba/shapes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import { NgtSobaStars, NgtSobaStarsModule } from './stars.component';

export default {
  title: 'Soba/Staging/Stars',
  component: NgtSobaStars,
  decorators: [
    componentWrapperDecorator(setupCanvas({ black: true })),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtMathPipeModule,
        NgtSobaStarsModule,
        NgtSobaPlaneModule,
        NgtAxesHelperModule,
        NgtMeshBasicMaterialModule,
      ],
    }),
  ],
} as Meta;

export const Default = () => ({
  template: `
    <ngt-soba-stars></ngt-soba-stars>
    <ngt-soba-plane [rotation]='[0.5 | mathConst:"PI", 0, 0]' [args]='[100, 100, 4, 4]'>
      <ngt-mesh-basic-material [parameters]='{ wireframe: true }'></ngt-mesh-basic-material>
    </ngt-soba-plane>
    <ngt-axes-helper></ngt-axes-helper>
  `,
});

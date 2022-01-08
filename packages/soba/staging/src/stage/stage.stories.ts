import { NgtMeshPhongMaterialModule } from '@angular-three/core/materials';
import { presetsObj } from '@angular-three/soba';
import { NgtSobaSphereModule } from '@angular-three/soba/shapes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { NgtSobaStageModule } from './stage.component';

export default {
  title: 'Soba/Staging/Stage',
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ cameraPosition: [0, 0, 3], black: true })
    ),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaStageModule,
        NgtSobaSphereModule,
        NgtMeshPhongMaterialModule,
      ],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
    <ngt-soba-stage
      [contactShadow]='contactShadow'
      [shadows]='shadows'
      [intensity]='intensity'
      [environment]='environment'
      [preset]='preset'
    >
      <ngt-soba-sphere [args]='[1, 24, 24]'>
        <ngt-mesh-phong-material [parameters]='{color: "royalblue"}'></ngt-mesh-phong-material>
      </ngt-soba-sphere>
    </ngt-soba-stage>
  `,
});

enum presets {
  rembrant = 'rembrandt',
  portrait = 'portrait',
  upfront = 'upfront',
  soft = 'soft',
}

Default.args = {
  contactShadow: {
    blur: 2,
    opacity: 0.5,
    position: [0, 0, 0],
  },
  shadows: true,
  intensity: 1,
  environment: Object.keys(presetsObj)[0],
  preset: presets.rembrant,
};

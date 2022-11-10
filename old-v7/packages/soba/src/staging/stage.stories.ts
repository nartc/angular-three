import { NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtMeshPhongMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtSobaStage, presetsObj } from '@angular-three/soba/staging';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

export default {
  title: 'Staging/Stage',
  decorators: [
    componentWrapperDecorator(setupCanvas({ camera: { position: [0, 0, 3] }, whiteBackground: true })),
    moduleMetadata({
      imports: [setupCanvasImports, NgtSobaStage, NgtMesh, NgtSphereGeometry, NgtMeshPhongMaterial],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
<ngt-soba-stage
  [contactShadow]="contactShadow"
  [shadows]="shadows"
  [intensity]="intensity"
  [environment]="environment"
  [preset]="preset"
>
  <ngt-mesh>
    <ngt-sphere-geometry [args]="[1, 24, 24]"></ngt-sphere-geometry>
    <ngt-mesh-phong-material color="royalblue"></ngt-mesh-phong-material>
  </ngt-mesh>
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

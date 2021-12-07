import { NgtTorusKnotGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { presetsObj } from '@angular-three/soba';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import {
  NgtSobaEnvironment,
  NgtSobaEnvironmentModule,
} from './environment.directive';

export default {
  title: 'Soba/Staging/Environment',
  component: NgtSobaEnvironment,
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ controls: false, cameraPosition: [0, 0, 10] })
    ),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaEnvironmentModule,
        NgtMeshModule,
        NgtTorusKnotGeometryModule,
        NgtMeshStandardMaterialModule,
      ],
    }),
  ],
  argTypes: {
    preset: {
      options: Object.keys(presetsObj),
      control: { type: 'select' },
    },
    background: {
      control: { type: 'boolean' },
    },
  },
} as Meta;

export const Default: Story<NgtSobaEnvironment> = (args) => {
  return {
    props: args,
    template: `
      <ngt-mesh>
        <ngt-torus-knot-geometry [args]='[1, 0.5, 128, 32]'></ngt-torus-knot-geometry>
        <ngt-mesh-standard-material [parameters]='{metalness: 1, roughness: 0}'></ngt-mesh-standard-material>
      </ngt-mesh>

      <ngt-soba-environment [preset]='preset' [background]='background'></ngt-soba-environment>

      <ngt-soba-orbit-controls
        #sobaOrbitControls='ngtSobaOrbitControls'
        (ready)='sobaOrbitControls.controls.autoRotate = true;'
      >
      </ngt-soba-orbit-controls>
  `,
  };
};

Default.args = {
  preset: 'sunset',
  background: true,
};

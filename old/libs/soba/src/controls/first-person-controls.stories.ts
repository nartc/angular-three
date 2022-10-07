import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaFirstPersonControlsModule } from '@angular-three/soba/controls';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

export default {
  title: 'Controls/First Person Controls',
  decorators: [
    componentWrapperDecorator(setupCanvas({ controls: false })),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaFirstPersonControlsModule,
        NgtMeshModule,
        NgtBoxGeometryModule,
        NgtMeshBasicMaterialModule,
      ],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
        <ngt-soba-first-person-controls
            [activeLook]="activeLook"
            [autoForward]="autoForward"
            [constrainVertical]="constrainVertical"
            [enabled]="enabled"
            [heightCoef]="heightCoef"
            [heightMax]="heightMax"
            [heightMin]="heightMin"
            [heightSpeed]="heightSpeed"
            [lookVertical]="lookVertical"
            [lookSpeed]="lookSpeed"
            [movementSpeed]="movementSpeed"
            [verticalMax]="verticalMax"
            [verticalMin]="verticalMin"
        ></ngt-soba-first-person-controls>

        <ngt-mesh>
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-basic-material wireframe></ngt-mesh-basic-material>
        </ngt-mesh>
    `,
});

Default.args = {
  activeLook: true,
  autoForward: false,
  constrainVertical: false,
  enabled: true,
  heightCoef: 1,
  heightMax: 1,
  heightMin: 0,
  heightSpeed: false,
  lookVertical: true,
  lookSpeed: 0.005,
  movementSpeed: 1,
  verticalMax: Math.PI,
  verticalMin: 0,
};

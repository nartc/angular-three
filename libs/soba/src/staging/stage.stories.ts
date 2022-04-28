import { NgtSphereGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshPhongMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaStageModule, presetsObj } from '@angular-three/soba/staging';
import {
    componentWrapperDecorator,
    Meta,
    moduleMetadata,
    Story,
} from '@storybook/angular';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

export default {
    title: 'Staging/Stage',
    decorators: [
        componentWrapperDecorator(setupCanvas({ cameraPosition: [0, 0, 3] })),
        moduleMetadata({
            imports: [
                ...setupCanvasModules,
                NgtSobaStageModule,
                NgtMeshModule,
                NgtSphereGeometryModule,
                NgtMeshPhongMaterialModule,
            ],
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
          <ng-template ngt-soba-stage-content>
              <ngt-mesh>
                  <ngt-sphere-geometry [args]="[1, 24, 24]"></ngt-sphere-geometry>
                  <ngt-mesh-phong-material color="royalblue"></ngt-mesh-phong-material>
              </ngt-mesh>
          </ng-template>
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

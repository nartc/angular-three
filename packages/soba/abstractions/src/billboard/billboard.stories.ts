import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtSobaPlaneModule } from '@angular-three/soba/shapes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import {
  NgtSobaBillboard,
  NgtSobaBillboardModule,
} from './billboard.component';

export default {
  title: 'Soba/Abstractions/Billboard',
  component: NgtSobaBillboard,
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ black: true, controls: false, cameraPosition: [0, 0, 10] })
    ),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaBillboardModule,
        NgtMeshStandardMaterialModule,
        NgtSobaPlaneModule,
      ],
    }),
  ],
} as Meta;

export const Planes = () => ({
  template: `
    <ngt-soba-orbit-controls
      #ngtOrbitControls='ngtSobaOrbitControls'
      (ready)='ngtOrbitControls.controls.enablePan = true; ngtOrbitControls.controls.zoomSpeed = 0.5'
    ></ngt-soba-orbit-controls>

    <ngt-soba-billboard [position]='[-4, -2, 0]'>
      <ngt-soba-plane [args]='[3, 2]'>
        <ngt-mesh-standard-material
          [parameters]="{ color: 'red' }"
        ></ngt-mesh-standard-material>
      </ngt-soba-plane>
    </ngt-soba-billboard>

    <ngt-soba-billboard [position]='[-4, 2, 0]'>
      <ngt-soba-plane [args]='[3, 2]'>
        <ngt-mesh-standard-material
          [parameters]="{ color: 'orange' }"
        ></ngt-mesh-standard-material>
      </ngt-soba-plane>
    </ngt-soba-billboard>

    <ngt-soba-billboard [position]='[0, 0, 0]'>
      <ngt-soba-plane [args]='[3, 2]'>
        <ngt-mesh-standard-material
          [parameters]="{ color: 'green' }"
        ></ngt-mesh-standard-material>
      </ngt-soba-plane>
    </ngt-soba-billboard>

    <ngt-soba-billboard [position]='[4, -2, 0]'>
      <ngt-soba-plane [args]='[3, 2]'>
        <ngt-mesh-standard-material
          [parameters]="{ color: 'blue' }"
        ></ngt-mesh-standard-material>
      </ngt-soba-plane>
    </ngt-soba-billboard>

    <ngt-soba-billboard [position]='[4, 2, 0]'>
      <ngt-soba-plane [args]='[3, 2]'>
        <ngt-mesh-standard-material
          [parameters]="{ color: 'yellow' }"
        ></ngt-mesh-standard-material>
      </ngt-soba-plane>
    </ngt-soba-billboard>
  `,
});

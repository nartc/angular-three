import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import {
  NgtSobaBoxModule,
  NgtSobaConeModule,
  NgtSobaPlaneModule,
} from '@angular-three/soba/shapes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import { NgtSobaTextModule } from '../text/text.component';
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
        NgtGroupModule,
        NgtSobaTextModule,
        NgtSobaConeModule,
        NgtSobaBoxModule,
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

export const Text = () => ({
  template: `
    <ngt-soba-orbit-controls
      #ngtOrbitControls='ngtSobaOrbitControls'
      (ready)='ngtOrbitControls.controls.enablePan = true; ngtOrbitControls.controls.zoomSpeed = 0.5'
    ></ngt-soba-orbit-controls>

    <ngt-soba-billboard
      [position]='[0.5, 2.05, 0.5]'
    >
      <ngt-soba-text
        [fontSize]='1'
        outlineWidth='5%'
        outlineColor='#000000'
        [outlineOpacity]='1'
      >
        box
      </ngt-soba-text>
    </ngt-soba-billboard>

    <ngt-soba-box [position]='[0.5, 1, 0.5]'>
      <ngt-mesh-standard-material
        [parameters]="{ color: 'red' }"
      ></ngt-mesh-standard-material>
    </ngt-soba-box>

    <ngt-group #group='ngtGroup' [position]='[-2.5, -3, -1]'>
      <ngt-soba-billboard
        [appendTo]='group.object3d'
        [position]='[0, 1.05, 0]'
      >
        <ngt-soba-text
          [fontSize]='1'
          outlineWidth='5%'
          outlineColor='#000000'
          [outlineOpacity]='1'
        >
          cone
        </ngt-soba-text>
      </ngt-soba-billboard>

      <ngt-soba-cone>
        <ngt-mesh-standard-material
          [parameters]="{ color: 'green' }"
        ></ngt-mesh-standard-material>
      </ngt-soba-cone>
    </ngt-group>

    <ngt-soba-billboard [position]='[0, 0, -5]'>
      <ngt-soba-plane [args]='[2, 2]'>
        <ngt-mesh-standard-material
          [parameters]="{ color: '#000066' }"
        ></ngt-mesh-standard-material>
      </ngt-soba-plane>
    </ngt-soba-billboard>
  `,
});

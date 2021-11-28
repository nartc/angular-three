import { NgtOrbitControlsModule } from '@angular-three/controls/orbit-controls';
import { NgtCoreModule } from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import {
  NgtAmbientLightModule,
  NgtPointLightModule,
} from '@angular-three/core/lights';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtStatsModule } from '@angular-three/core/stats';
import {
  NgtSobaBoxModule,
  NgtSobaConeModule,
  NgtSobaPlaneModule,
} from '@angular-three/soba/shapes';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { NgtSobaTextModule } from '../text/text.component';
import {
  NgtSobaBillboard,
  NgtSobaBillboardModule,
} from './billboard.component';

export default {
  title: 'Abstractions/Billboard',
  component: NgtSobaBillboard,
  decorators: [
    moduleMetadata({
      imports: [
        NgtCoreModule,
        NgtGroupModule,
        NgtSobaTextModule,
        NgtStatsModule,
        NgtOrbitControlsModule,
        NgtSobaBillboardModule,
        NgtSobaBoxModule,
        NgtMeshStandardMaterialModule,
        NgtSobaConeModule,
        NgtSobaPlaneModule,
        NgtAmbientLightModule,
        NgtPointLightModule,
      ],
    }),
  ],
} as Meta;

export const Planes = () =>
  ({
    template: `
      <ngt-canvas
        (created)="$event.gl.setClearColor('black')"
        [camera]='{ position: [0, 0, 10] }'
      >
        <ngt-stats></ngt-stats>

        <ngt-ambient-light [intensity]='0.8'></ngt-ambient-light>
        <ngt-point-light [intensity]='1' [position]='[0, 6, 0]'></ngt-point-light>

        <ngt-orbit-controls
          (ready)='$event.enablePan = true; $event.zoomSpeed = 0.5'
        ></ngt-orbit-controls>

        <ngt-soba-billboard #billboard='ngtSobaBillboard' [position]='[-4, -2, 0]'>
          <ngt-soba-plane [appendTo]='billboard.group.object3d' [args]='[3, 2]'>
            <ngt-mesh-standard-material
              [parameters]="{ color: 'red' }"
            ></ngt-mesh-standard-material>
          </ngt-soba-plane>
        </ngt-soba-billboard>

        <ngt-soba-billboard #billboardSecond='ngtSobaBillboard' [position]='[-4, 2, 0]'>
          <ngt-soba-plane [appendTo]='billboardSecond.group.object3d' [args]='[3, 2]'>
            <ngt-mesh-standard-material
              [parameters]="{ color: 'orange' }"
            ></ngt-mesh-standard-material>
          </ngt-soba-plane>
        </ngt-soba-billboard>

        <ngt-soba-billboard #billboardThird='ngtSobaBillboard' [position]='[0, 0, 0]'>
          <ngt-soba-plane [appendTo]='billboardThird.group.object3d' [args]='[3, 2]'>
            <ngt-mesh-standard-material
              [parameters]="{ color: 'green' }"
            ></ngt-mesh-standard-material>
          </ngt-soba-plane>
        </ngt-soba-billboard>

        <ngt-soba-billboard #billboardFourth='ngtSobaBillboard' [position]='[4, -2, 0]'>
          <ngt-soba-plane [appendTo]='billboardFourth.group.object3d' [args]='[3, 2]'>
            <ngt-mesh-standard-material
              [parameters]="{ color: 'blue' }"
            ></ngt-mesh-standard-material>
          </ngt-soba-plane>
        </ngt-soba-billboard>
  
        <ngt-soba-billboard #billboardFifth='ngtSobaBillboard' [position]='[4, 2, 0]'>
          <ngt-soba-plane [appendTo]='billboardFifth.group.object3d' [args]='[3, 2]'>
            <ngt-mesh-standard-material
              [parameters]="{ color: 'yellow' }"
            ></ngt-mesh-standard-material>
          </ngt-soba-plane>
        </ngt-soba-billboard>
      </ngt-canvas>
  `,
  } as ReturnType<Story<NgtSobaBillboard>>);

export const Text = () =>
  ({
    template: `
      <ngt-canvas
      (created)="$event.gl.setClearColor('black')"
      [camera]='{ position: [0, 0, 10] }'
    >
      <ngt-stats></ngt-stats>
      <ngt-orbit-controls
        (ready)='$event.enablePan = true; $event.zoomSpeed = 0.5'
      ></ngt-orbit-controls>

      <ngt-soba-billboard
        #firstBillboard='ngtSobaBillboard'
        [position]='[0.5, 2.05, 0.5]'
      >
        <ngt-soba-text
          [appendTo]='firstBillboard.group.object3d'
          [fontSize]='1'
          outlineWidth='5%'
          outlineColor='#000000'
          [outlineOpacity]='1'
        >
          <ngt-soba-text-content> box</ngt-soba-text-content>
        </ngt-soba-text>
      </ngt-soba-billboard>

      <ngt-soba-box [position]='[0.5, 1, 0.5]'>
        <ngt-mesh-standard-material
          [parameters]="{ color: 'red' }"
        ></ngt-mesh-standard-material>
      </ngt-soba-box>

      <ngt-group #group='ngtGroup' [position]='[-2.5, -3, -1]'>
        <ngt-soba-billboard
          #secondBillboard='ngtSobaBillboard'
          [appendTo]='group.object3d'
          [position]='[0, 1.05, 0]'
        >
          <ngt-soba-text
            [appendTo]='secondBillboard.group.object3d'
            [fontSize]='1'
            outlineWidth='5%'
            outlineColor='#000000'
            [outlineOpacity]='1'
          >
            <ngt-soba-text-content> cone</ngt-soba-text-content>
          </ngt-soba-text>
        </ngt-soba-billboard>

        <ngt-soba-cone>
          <ngt-mesh-standard-material
            [parameters]="{ color: 'green' }"
          ></ngt-mesh-standard-material>
        </ngt-soba-cone>
      </ngt-group>

      <ngt-soba-billboard #billboard='ngtSobaBillboard' [position]='[0, 0, -5]'>
        <ngt-soba-plane [appendTo]='billboard.group.object3d' [args]='[2, 2]'>
          <ngt-mesh-standard-material
            [parameters]="{ color: '#000066' }"
          ></ngt-mesh-standard-material>
        </ngt-soba-plane>
      </ngt-soba-billboard>

      <ngt-ambient-light [intensity]='0.8'></ngt-ambient-light>
      <ngt-point-light [intensity]='1' [position]='[0, 6, 0]'></ngt-point-light>
    </ngt-canvas>
    `,
  } as ReturnType<Story<NgtSobaBillboard>>);

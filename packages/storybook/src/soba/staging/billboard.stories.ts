import { provideCanvasOptions } from '@angular-three/core';
import {
  NgtBoxGeometryModule,
  NgtConeGeometryModule,
  NgtPlaneGeometryModule,
} from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import {
  NgtSobaBillboardModule,
  NgtSobaTextModule,
} from '@angular-three/soba/abstractions';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import { setupCanvas, setupCanvasModules } from '../../setup-canvas';

export default {
  title: 'Soba/Abstractions/Billboard',
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ controls: false, cameraPosition: [0, 0, 10] })
    ),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaBillboardModule,
        NgtMeshStandardMaterialModule,
        NgtMeshModule,
        NgtPlaneGeometryModule,
        NgtGroupModule,
        NgtSobaTextModule,
        NgtConeGeometryModule,
        NgtBoxGeometryModule,
      ],
      providers: [provideCanvasOptions({ initialLog: true })],
    }),
  ],
} as Meta;

export const Planes = () => ({
  template: `
    <ngt-soba-orbit-controls
      (ready)='$event.enablePan = true; $event.zoomSpeed = 0.5'
    ></ngt-soba-orbit-controls>

    <ngt-soba-billboard [position]='[-4, -2, 0]'>
      <ng-template sobaBillboardContent>
        <ngt-mesh>
          <ngt-plane-geometry [args]='[3, 2]'></ngt-plane-geometry>
          <ngt-mesh-standard-material
            [parameters]="{ color: 'red' }"
          ></ngt-mesh-standard-material>
        </ngt-mesh>
      </ng-template>
    </ngt-soba-billboard>

    <ngt-soba-billboard [position]='[-4, 2, 0]'>
      <ng-template sobaBillboardContent>
        <ngt-mesh>
          <ngt-plane-geometry [args]='[3, 2]'></ngt-plane-geometry>
          <ngt-mesh-standard-material
            [parameters]="{ color: 'orange' }"
          ></ngt-mesh-standard-material>
        </ngt-mesh>
      </ng-template>
    </ngt-soba-billboard>

    <ngt-soba-billboard [position]='[0, 0, 0]'>
      <ng-template sobaBillboardContent>
        <ngt-mesh>
          <ngt-plane-geometry [args]='[3, 2]'></ngt-plane-geometry>
          <ngt-mesh-standard-material
            [parameters]="{ color: 'green' }"
          ></ngt-mesh-standard-material>
        </ngt-mesh>
      </ng-template>
    </ngt-soba-billboard>

    <ngt-soba-billboard [position]='[4, -2, 0]'>
      <ng-template sobaBillboardContent>
        <ngt-mesh>
          <ngt-plane-geometry [args]='[3, 2]'></ngt-plane-geometry>
          <ngt-mesh-standard-material
            [parameters]="{ color: 'blue' }"
          ></ngt-mesh-standard-material>
        </ngt-mesh>
      </ng-template>
    </ngt-soba-billboard>

    <ngt-soba-billboard [position]='[4, 2, 0]'>
      <ng-template sobaBillboardContent>
        <ngt-mesh>
          <ngt-plane-geometry [args]='[3, 2]'></ngt-plane-geometry>
          <ngt-mesh-standard-material
            [parameters]="{ color: 'yellow' }"
          ></ngt-mesh-standard-material>
        </ngt-mesh>
      </ng-template>
    </ngt-soba-billboard>
  `,
});

export const Text = () => ({
  template: `
    <ngt-soba-orbit-controls
      (ready)='$event.enablePan = true; $event.zoomSpeed = 0.5'
    ></ngt-soba-orbit-controls>

    <ngt-soba-billboard
      [position]='[0.5, 2.05, 0.5]'
    >
      <ng-template sobaBillboardContent>
        <ngt-soba-text
          [fontSize]='1'
          outlineWidth='5%'
          outlineColor='#000000'
          [outlineOpacity]='1'
        >
          box
        </ngt-soba-text>
      </ng-template>
    </ngt-soba-billboard>

    <ngt-mesh [position]='[0.5, 1, 0.5]'>
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material
        [parameters]="{ color: 'red' }"
      ></ngt-mesh-standard-material>
    </ngt-mesh>

    <ngt-group [position]='[-2.5, -3, -1]'>
      <ngt-soba-billboard [position]='[0, 1.05, 0]'>
        <ng-template sobaBillboardContent let-billboard='group'>
          <ngt-soba-text
            [appendTo]='billboard'
            [fontSize]='1'
            outlineWidth='5%'
            outlineColor='#000000'
            [outlineOpacity]='1'
          >
            cone
          </ngt-soba-text>
        </ng-template>
      </ngt-soba-billboard>

      <ngt-mesh>
        <ngt-cone-geometry></ngt-cone-geometry>
        <ngt-mesh-standard-material
          [parameters]="{ color: 'green' }"
        ></ngt-mesh-standard-material>
      </ngt-mesh>
    </ngt-group>

    <ngt-soba-billboard [position]='[0, 0, -5]'>
      <ng-template sobaBillboardContent>
        <ngt-mesh>
          <ngt-plane-geometry [args]='[2, 2]'></ngt-plane-geometry>
          <ngt-mesh-standard-material
            [parameters]="{ color: '#000066' }"
          ></ngt-mesh-standard-material>
        </ngt-mesh>
      </ng-template>
    </ngt-soba-billboard>
  `,
});

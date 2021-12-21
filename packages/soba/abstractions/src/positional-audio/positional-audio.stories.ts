import { NgtSphereGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import { CommonModule } from '@angular/common';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import * as THREE from 'three';
import {
  NgtSobaPositionalAudio,
  NgtSobaPositionalAudioModule,
} from './positional-audio.component';

export default {
  title: 'Soba/Abstractions/Positional Audio',
  component: NgtSobaPositionalAudio,
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ cameraPosition: [0, 0, 20], black: true })
    ),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        CommonModule,
        NgtSobaPositionalAudioModule,
        NgtGroupModule,
        NgtMeshModule,
        NgtSphereGeometryModule,
        NgtMeshBasicMaterialModule,
      ],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
    <ngt-group [position]='[0, 0, 5]'>
      <ngt-mesh *ngFor='let item of items' [position]='item.position'>
        <ngt-sphere-geometry></ngt-sphere-geometry>
        <ngt-mesh-basic-material [parameters]='{color: "hotpink", wireframe: true}'></ngt-mesh-basic-material>
        <ngt-soba-positional-audio [url]='item.url' [autoplay]='true'></ngt-soba-positional-audio>
      </ngt-mesh>
    </ngt-group>
  `,
});

Default.args = {
  items: [
    {
      position: new THREE.Vector3(10, 0, 10),
      url: 'sounds/1.mp3',
    },
    {
      position: new THREE.Vector3(-10, 0, 10),
      url: 'sounds/2.mp3',
    },
    {
      position: new THREE.Vector3(10, 0, -10),
      url: 'sounds/3.mp3',
    },
    {
      position: new THREE.Vector3(-10, 0, -10),
      url: 'sounds/4.mp3',
    },
  ],
};

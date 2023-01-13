import { extend, NgtArgs } from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { NgtsDetailed } from '@angular-three/soba/performance';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { IcosahedronGeometry, Mesh, MeshBasicMaterial } from 'three';
import { StorybookSetup } from '../setup-canvas';

extend({ Mesh, IcosahedronGeometry, MeshBasicMaterial });

@Component({
  selector: 'storybook-default-detailed',
  standalone: true,
  template: `
    <ngts-detailed [distances]="[0, 50, 150]">
      <ngt-mesh>
        <ngt-icosahedron-geometry *args="[10, 3]" />
        <ngt-mesh-basic-material color="hotpink" wireframe />
      </ngt-mesh>

      <ngt-mesh>
        <ngt-icosahedron-geometry *args="[10, 2]" />
        <ngt-mesh-basic-material color="lightgreen" wireframe />
      </ngt-mesh>

      <ngt-mesh>
        <ngt-icosahedron-geometry *args="[10, 1]" />
        <ngt-mesh-basic-material color="lightblue" wireframe />
      </ngt-mesh>
    </ngts-detailed>
    <ngts-orbit-controls [enablePan]="false" [enableRotate]="false" [zoomSpeed]="0.5" />
  `,
  imports: [NgtsDetailed, NgtArgs, NgtsOrbitControls],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultDetailedStory {}

export default {
  title: 'Performance/Detailed',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = () => ({
  props: {
    controls: false,
    camera: { position: [0, 0, 100] },
    storyComponent: DefaultDetailedStory,
  },
  template: `
<storybook-setup [storyComponent]="storyComponent" [controls]="controls" [camera]="camera" />
    `,
});

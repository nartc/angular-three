import { extend } from '@angular-three/core';
import { NgtsText3D } from '@angular-three/soba/abstractions';
import { NgtsCenter, NgtsFloat } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { MeshNormalMaterial } from 'three';
import { StorybookSetup } from '../setup-canvas';

extend({ MeshNormalMaterial });

@Component({
  selector: 'storybook-default-text-3d',
  standalone: true,
  template: `
    <ngts-center>
      <ngts-float [floatIntensity]="5" [speed]="2">
        <ngts-text-3d
          [font]="'soba/helvetiker_regular.typeface.json'"
          [bevelEnabled]="true"
          [bevelSize]="0.05"
          [text]="'Text 3D'"
        >
          <ngt-mesh-normal-material></ngt-mesh-normal-material>
        </ngts-text-3d>
      </ngts-float>
    </ngts-center>
  `,
  imports: [NgtsCenter, NgtsFloat, NgtsText3D],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultText3DStory {}

export default {
  title: 'Abstractions/Text 3D',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = () => ({
  props: { camera: { position: [0, 0, 5] }, storyComponent: DefaultText3DStory },
  template: `
<storybook-setup [camera]="camera" [storyComponent]="storyComponent"></storybook-setup>
    `,
});

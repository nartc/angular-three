import { NgtsLine } from '@angular-three/soba/abstractions';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { Vector3 } from 'three';
import { GeometryUtils } from 'three-stdlib';
import { StorybookSetup } from '../setup-canvas';

const points = GeometryUtils.hilbert3D(new Vector3(0), 5).map((p) => [p.x, p.y, p.z]) as [
  number,
  number,
  number
][];

const colors = new Array(points.length)
  .fill(0)
  .map(() => [Math.random(), Math.random(), Math.random()]) as [number, number, number][];

@Component({
  selector: 'storybook-vertex-colors-line',
  standalone: true,
  template: `
    <ngts-line
      [color]="color"
      [vertexColors]="colors"
      [lineWidth]="lineWidth"
      [dashed]="dashed"
      [points]="points"
    ></ngts-line>
    <ngts-orbit-controls [zoomSpeed]="0.5"></ngts-orbit-controls>
  `,
  imports: [NgtsLine, NgtsOrbitControls],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class VertexColorsLineStory {
  readonly points = points;
  readonly colors = colors;

  @Input() color = 'red';
  @Input() lineWidth = 3;
  @Input() dashed = false;
}

@Component({
  selector: 'storybook-default-line',
  standalone: true,
  template: `
    <ngts-line
      [color]="color"
      [lineWidth]="lineWidth"
      [dashed]="dashed"
      [points]="points"
    ></ngts-line>
    <ngts-orbit-controls [zoomSpeed]="0.5"></ngts-orbit-controls>
  `,
  imports: [NgtsLine, NgtsOrbitControls],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultLineStory {
  readonly points = points;
  @Input() color = 'red';
  @Input() lineWidth = 3;
  @Input() dashed = false;
}

export default {
  title: 'Abstractions/Line',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = (args) => ({
  props: {
    storyComponent: DefaultLineStory,
    camera: { position: [0, 0, 17] },
    controsl: false,
    storyInputs: args,
  },
  template: `
<storybook-setup [storyComponent]="storyComponent" [storyInputs]="storyInputs" [camera]="camera" [controls]="controls"></storybook-setup>
    `,
});

Default.args = {
  color: 'red',
  lineWidth: 3,
  dashed: false,
};

export const VertexColors: Story = (args) => ({
  props: {
    storyComponent: VertexColorsLineStory,
    camera: { position: [0, 0, 17] },
    controsl: false,
    storyInputs: args,
  },
  template: `
<storybook-setup [storyComponent]="storyComponent" [storyInputs]="storyInputs" [camera]="camera" [controls]="controls"></storybook-setup>
    `,
});

VertexColors.args = {
  color: 'red',
  lineWidth: 3,
  dashed: false,
};

import { extend, NgtArgs, NgtPush, NgtVector3 } from '@angular-three/core';
import { NgtsSky } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { scan, timer } from 'rxjs';
import { AxesHelper, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { StorybookSetup } from '../setup-canvas';

extend({ Mesh, PlaneGeometry, MeshBasicMaterial, AxesHelper });

@Component({
  selector: 'storybook-rotation-sky',
  standalone: true,
  template: `
    <ngts-sky
      [turbidity]="turbidity"
      [rayleigh]="rayleigh"
      [mieCoefficient]="mieCoefficient"
      [mieDirectionalG]="mieDirectionalG"
      [inclination]="inclination$ | ngtPush : 0"
      [azimuth]="azimuth"
      [distance]="3000"
    />
    <ngt-mesh [rotation]="[Math.PI / 2, 0, 0]">
      <ngt-plane-geometry *args="[100, 100, 4, 4]" />
      <ngt-mesh-basic-material wireframe color="black" />
    </ngt-mesh>
    <ngt-axes-helper />
  `,
  imports: [NgtsSky, NgtArgs, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class RotationSkyStory {
  @Input() turbidity = 8;
  @Input() rayleigh = 6;
  @Input() mieCoefficient = 0.005;
  @Input() mieDirectionalG = 0.8;
  @Input() azimuth = 0.25;

  readonly inclination$ = timer(0, 7.5).pipe(scan((value) => value + 0.001, 0));
  readonly Math = Math;
}
@Component({
  selector: 'storybook-custom-angles-sky',
  standalone: true,
  template: `
    <ngts-sky
      [turbidity]="turbidity"
      [rayleigh]="rayleigh"
      [mieCoefficient]="mieCoefficient"
      [mieDirectionalG]="mieDirectionalG"
      [inclination]="inclination"
      [azimuth]="azimuth"
      [distance]="3000"
    />
    <ngt-mesh [rotation]="[Math.PI / 2, 0, 0]">
      <ngt-plane-geometry *args="[100, 100, 4, 4]" />
      <ngt-mesh-basic-material wireframe color="black" />
    </ngt-mesh>
    <ngt-axes-helper />
  `,
  imports: [NgtsSky, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class CustomAnglesSkyStory {
  @Input() turbidity = 8;
  @Input() rayleigh = 6;
  @Input() mieCoefficient = 0.005;
  @Input() mieDirectionalG = 0.8;
  @Input() inclination = 0.49;
  @Input() azimuth = 0.25;

  readonly Math = Math;
}

@Component({
  selector: 'storybook-default-sky',
  standalone: true,
  template: `
    <ngts-sky
      [turbidity]="turbidity"
      [rayleigh]="rayleigh"
      [mieCoefficient]="mieCoefficient"
      [mieDirectionalG]="mieDirectionalG"
      [sunPosition]="sunPosition"
    />
    <ngt-mesh [rotation]="[Math.PI / 2, 0, 0]">
      <ngt-plane-geometry *args="[100, 100, 4, 4]" />
      <ngt-mesh-basic-material wireframe color="black" />
    </ngt-mesh>
    <ngt-axes-helper />
  `,
  imports: [NgtsSky, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultSkyStory {
  @Input() turbidity = 8;
  @Input() rayleigh = 6;
  @Input() mieCoefficient = 0.005;
  @Input() mieDirectionalG = 0.8;
  @Input() sunPosition: NgtVector3 = [0, 0, 0];

  readonly Math = Math;
}

export default {
  title: 'Staging/Sky',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = (args) => ({
  props: { storyComponent: DefaultSkyStory, storyInputs: args },
  template: `
<storybook-setup [storyComponent]="storyComponent" [storyInputs]="storyInputs" />
    `,
});

Default.args = {
  turbidity: 8,
  rayleigh: 6,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.8,
  sunPosition: [0, 0, 0],
};

export const CustomAngles: Story = (args) => ({
  props: { storyComponent: CustomAnglesSkyStory, storyInputs: args },
  template: `
<storybook-setup [storyComponent]="storyComponent" [storyInputs]="storyInputs" />
    `,
});

CustomAngles.args = {
  turbidity: 8,
  rayleigh: 6,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.8,
  inclination: 0.49,
  azimuth: 0.25,
};

export const Rotation: Story = (args) => ({
  props: { storyComponent: RotationSkyStory, storyInputs: args },
  template: `
<storybook-setup [storyComponent]="storyComponent" [storyInputs]="storyInputs" />
    `,
});

Rotation.args = {
  turbidity: 8,
  rayleigh: 6,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.8,
  azimuth: 0.25,
};

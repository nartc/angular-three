import { extend, NgtArgs } from '@angular-three/core';
import { NgtsContactShadows } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { Clock, Mesh, MeshBasicMaterial, PlaneGeometry, SphereGeometry } from 'three';
import { StorybookSetup } from '../setup-canvas';

extend({
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  PlaneGeometry,
});

@Component({
  selector: 'storybook-default-contact-shadows',
  standalone: true,
  template: `
    <ngt-mesh
      [position]="[0, 2, 0]"
      (beforeRender)="onBeforeRender($any($event).object, $any($event).state.clock)"
    >
      <ngt-sphere-geometry *args="[1, 32, 32]"></ngt-sphere-geometry>
      <ngt-mesh-basic-material color="#2a8aff"></ngt-mesh-basic-material>
    </ngt-mesh>
    <ngts-contact-shadows
      [position]="[0, 0, 0]"
      [scale]="10"
      [far]="3"
      [blur]="3"
      [rotation]="[Math.PI / 2, 0, 0]"
      [color]="colorized ? '#2a8aff' : 'black'"
    ></ngts-contact-shadows>
    <ngt-mesh [position]="[0, -0.01, 0]" [rotation]="[-Math.PI / 2, 0, 0]">
      <ngt-plane-geometry *args="[10, 10]"></ngt-plane-geometry>
      <ngt-mesh-basic-material color="white"></ngt-mesh-basic-material>
    </ngt-mesh>
  `,
  imports: [NgtArgs, NgtsContactShadows],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultContactShadowsStory {
  @Input() colorized = false;
  readonly Math = Math;

  onBeforeRender(mesh: Mesh, clock: Clock) {
    mesh.position.y = Math.sin(clock.getElapsedTime()) + 2;
  }
}

export default {
  title: 'Staging/Contact Shadows',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = () => ({
  props: { storyComponent: DefaultContactShadowsStory },
  template: `
<storybook-setup [storyComponent]="storyComponent"></storybook-setup>
  `,
});

export const Colorized: Story = (args) => ({
  props: { storyComponent: DefaultContactShadowsStory, storyInputs: args },
  template: `
<storybook-setup [storyComponent]="storyComponent" [storyInputs]="storyInputs"></storybook-setup>
    `,
});

Colorized.args = { colorized: true };

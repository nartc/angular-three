import { extend } from '@angular-three/core';
import { NgtsPerspectiveCamera } from '@angular-three/soba/cameras';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { NgtsSparkles } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { AxesHelper } from 'three';
import { StorybookSetup } from '../setup-canvas';

extend({ AxesHelper });

@Component({
  selector: 'storybook-default-sparkles',
  standalone: true,
  template: `
    <ngts-sparkles
      [size]="sparklesSize"
      [color]="'orange'"
      [count]="amount"
      [opacity]="opacity"
      [speed]="speed"
      [noise]="noise"
    />
    <ngts-orbit-controls />
    <ngt-axes-helper />
    <ngts-perspective-camera [position]="[2, 2, 2]" [makeDefault]="true" />
  `,
  imports: [NgtsSparkles, NgtsPerspectiveCamera, NgtsOrbitControls],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultSparklesStory implements OnChanges {
  @Input() size = 5;
  @Input() opacity = 1;
  @Input() amount = 100;
  @Input() speed = 0.3;
  @Input() noise = 1;
  @Input() random = true;

  sizes = new Float32Array(Array.from({ length: this.amount }, () => Math.random() * this.size));

  get sparklesSize() {
    return this.random ? this.sizes : this.size;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['size'] || changes['amount']) {
      this.sizes = new Float32Array(
        Array.from(
          { length: changes['amount'].currentValue },
          () => Math.random() * changes['size'].currentValue
        )
      );
    }
  }
}

export default {
  title: 'Staging/Sparkles',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = (args) => ({
  props: {
    storyComponent: DefaultSparklesStory,
    storyInputs: args,
    camera: { position: [1, 1, 1] },
    controls: false,
  },
  template: `
<storybook-setup [storyComponent]="storyComponent" [storyInputs]="storyInputs" [camera]="camera" [controls]="controls" />
    `,
});

Default.args = {
  size: 5,
  opacity: 1,
  amount: 100,
  speed: 0.3,
  noise: 1,
  random: true,
};

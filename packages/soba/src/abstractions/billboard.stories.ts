import { extend, NgtArgs } from '@angular-three/core';
import { NgtsBillboard, NgtsText } from '@angular-three/soba/abstractions';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BoxGeometry, ConeGeometry, Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { StorybookSetup } from '../setup-canvas';

extend({
  Mesh,
  PlaneGeometry,
  BoxGeometry,
  ConeGeometry,
  MeshStandardMaterial,
  Group,
});

@Component({
  selector: 'storybook-cone',
  standalone: true,
  template: `
    <ngt-mesh>
      <ngt-cone-geometry *args="args" />
      <ngt-value attach="material.color" *args="[color]" />
      <ng-content />
    </ngt-mesh>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class Cone {
  @Input() args: ConstructorParameters<typeof ConeGeometry> = [];
  @Input() color = 'white';
}

@Component({
  selector: 'storybook-box',
  standalone: true,
  template: `
    <ngt-mesh ngtCompound>
      <ngt-box-geometry *args="args" />
      <ngt-value attach="material.color" *args="[color]" />
      <ng-content />
    </ngt-mesh>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class Box {
  @Input() args: ConstructorParameters<typeof BoxGeometry> = [];
  @Input() color = 'white';
}

@Component({
  selector: 'storybook-plane',
  standalone: true,
  template: `
    <ngt-mesh>
      <ngt-plane-geometry *args="args" />
      <ngt-value attach="material.color" *args="[color]" />
      <ng-content />
    </ngt-mesh>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class Plane {
  @Input() args: ConstructorParameters<typeof PlaneGeometry> = [];
  @Input() color = 'white';
}

@Component({
  selector: 'storybook-text-billboard',
  standalone: true,
  template: `
    <ngts-billboard
      [follow]="follow"
      [lockX]="lockX"
      [lockY]="lockY"
      [lockZ]="lockZ"
      [position]="[0.5, 2.05, 0.5]"
    >
      <ngts-text text="box" [fontSize]="1" [outlineWidth]="'5%'" [outlineColor]="'#000'" [outlineOpacity]="1" />
    </ngts-billboard>
    <storybook-box [position]="[0.5, 1, 0.5]" color="red">
      <ngt-mesh-standard-material />
    </storybook-box>
    <ngt-group [position]="[-2.5, -3, -1]">
      <ngts-billboard
        [follow]="follow"
        [lockX]="lockX"
        [lockY]="lockY"
        [lockZ]="lockZ"
        [position]="[0, 1.05, 0]"
      >
        <ngts-text
          text="cone"
          [fontSize]="1"
          [outlineWidth]="'5%'"
          [outlineColor]="'#000'"
          [outlineOpacity]="1"
        />
      </ngts-billboard>
      <storybook-cone color="green">
        <ngt-mesh-standard-material />
      </storybook-cone>
    </ngt-group>
    <ngts-billboard
      [follow]="follow"
      [lockX]="lockX"
      [lockY]="lockY"
      [lockZ]="lockZ"
      [position]="[0, 0, -5]"
    >
      <storybook-plane [args]="[2, 2]" color="#000066">
        <ngt-mesh-standard-material />
      </storybook-plane>
    </ngts-billboard>

    <ngts-orbit-controls [enablePan]="true" [zoomSpeed]="0.5" />
  `,
  imports: [NgtsBillboard, NgtsOrbitControls, NgtsText, Cone, Box, Plane],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class TextBillboardStory {
  @Input() follow = true;
  @Input() lockX = false;
  @Input() lockY = false;
  @Input() lockZ = false;
}

@Component({
  selector: 'storybook-default-billboard',
  standalone: true,
  template: `
    <ngts-billboard
      [follow]="follow"
      [lockX]="lockX"
      [lockY]="lockY"
      [lockZ]="lockZ"
      [position]="[-4, -2, 0]"
    >
      <storybook-plane [args]="[3, 2]" color="red" />
    </ngts-billboard>
    <ngts-billboard
      [follow]="follow"
      [lockX]="lockX"
      [lockY]="lockY"
      [lockZ]="lockZ"
      [position]="[-4, 2, 0]"
    >
      <storybook-plane [args]="[3, 2]" color="orange" />
    </ngts-billboard>
    <ngts-billboard
      [follow]="follow"
      [lockX]="lockX"
      [lockY]="lockY"
      [lockZ]="lockZ"
      [position]="[0, 0, 0]"
    >
      <storybook-plane [args]="[3, 2]" color="green" />
    </ngts-billboard>
    <ngts-billboard
      [follow]="follow"
      [lockX]="lockX"
      [lockY]="lockY"
      [lockZ]="lockZ"
      [position]="[4, -2, 0]"
    >
      <storybook-plane [args]="[3, 2]" color="blue" />
    </ngts-billboard>
    <ngts-billboard
      [follow]="follow"
      [lockX]="lockX"
      [lockY]="lockY"
      [lockZ]="lockZ"
      [position]="[4, 2, 0]"
    >
      <storybook-plane [args]="[3, 2]" color="yellow" />
    </ngts-billboard>

    <ngts-orbit-controls [enablePan]="true" [zoomSpeed]="0.5" />
  `,
  imports: [NgtsBillboard, Plane, NgtsOrbitControls],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultBillboardStory {
  @Input() follow = true;
  @Input() lockX = false;
  @Input() lockY = false;
  @Input() lockZ = false;
}

export default {
  title: 'Abstractions/Billboard',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = (args) => ({
  props: {
    camera: { position: [0, 0, 10] },
    controls: false,
    storyComponent: DefaultBillboardStory,
    storyInputs: args,
  },
  template: `
<storybook-setup [camera]="camera" [controls]="controls" [storyComponent]="storyComponent" [storyInputs]="storyInputs" />
    `,
});

Default.args = {
  follow: true,
  lockX: false,
  lockY: false,
  lockZ: false,
};

export const Text: Story = (args) => ({
  props: {
    camera: { position: [0, 0, 10] },
    controls: false,
    storyComponent: TextBillboardStory,
    storyInputs: args,
  },
  template: `
<storybook-setup [camera]="camera" [controls]="controls" [storyComponent]="storyComponent" [storyInputs]="storyInputs" />
    `,
});

Text.args = {
  follow: true,
  lockX: false,
  lockY: false,
  lockZ: false,
};

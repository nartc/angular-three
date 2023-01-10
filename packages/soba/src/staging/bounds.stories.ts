import {
  extend,
  NgtAnyRecord,
  NgtArgs,
  NgtPush,
  NgtRxStore,
  NgtThreeEvent,
} from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { injectNgtsBoundsApi, NgtsBounds, NgtsContactShadows } from '@angular-three/soba/staging';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { map } from 'rxjs';
import { Color, Group, HemisphereLight, Mesh, SpotLight } from 'three';
import { StorybookSetup } from '../setup-canvas';

extend({ Mesh, Color, SpotLight, HemisphereLight, Group });

@Component({
  selector: 'storybook-model[name]',
  standalone: true,
  template: `
    <ngt-mesh
      *ngIf="model$ | ngtPush : null as model"
      ngtCompound
      [material]="model.material"
      [geometry]="model.geometry"
    >
      <ngt-value *args="['red']" attach="material.emissive" />
      <ngt-value *args="[1]" attach="material.roughness" />
    </ngt-mesh>
  `,
  imports: [NgtArgs, NgIf, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class Model extends NgtRxStore {
  readonly models$ = injectNgtsGLTFLoader('soba/bounds-assets.glb');
  readonly model$ = this.models$.pipe(map(({ nodes }) => nodes[this.name] as Mesh));

  @Input() name!: string;
}

@Component({
  selector: 'models',
  standalone: true,
  template: `
    <ngt-group (click)="onClick($any($event))" (pointermissed)="onPointerMissed($any($event))">
      <storybook-model name="Curly" [position]="[1, -11, -20]" [rotation]="[2, 0, -0]" />
      <storybook-model name="DNA" [position]="[20, 0, -17]" [rotation]="[1, 1, -2]" />
      <storybook-model name="Headphones" [position]="[20, 2, 4]" [rotation]="[1, 0, -1]" />
      <storybook-model name="Notebook" [position]="[-21, -15, -13]" [rotation]="[2, 0, 1]" />
      <storybook-model name="Rocket003" [position]="[18, 15, -25]" [rotation]="[1, 1, 0]" />
      <storybook-model name="Roundcube001" [position]="[-25, -4, 5]" [rotation]="[1, 0, 0]" [scale]="0.5" />
      <storybook-model name="Table" [position]="[1, -4, -28]" [rotation]="[1, 0, -1]" [scale]="0.5" />
      <storybook-model name="VR_Headset" [position]="[7, -15, 28]" [rotation]="[1, 0, -1]" [scale]="5" />
      <storybook-model name="Zeppelin" [position]="[-20, 10, 10]" [rotation]="[3, -1, 3]" [scale]="0.005" />
    </ngt-group>
  `,
  imports: [Model, NgIf, NgtPush],
  schemas: [NO_ERRORS_SCHEMA],
})
class Models {
  readonly #boundsApi = injectNgtsBoundsApi();

  onClick(event: NgtThreeEvent<MouseEvent>) {
    event.stopPropagation();
    event.delta <= 2 && this.#boundsApi.refresh(event.object).fit();
  }

  onPointerMissed(event: NgtThreeEvent<PointerEvent>) {
    (event as NgtAnyRecord)['button'] === 0 && this.#boundsApi.refresh().fit();
  }
}

@Component({
  selector: 'storybook-default-bounds',
  standalone: true,
  template: `
    <ngt-color *args="['#f08080']" attach="background" />

    <ngt-spot-light [position]="[-100, -100, -100]" intensity="0.2" angle="0.3" penumbra="1" />
    <ngt-hemisphere-light color="white" groundColor="#ff0f00" [position]="[-7, 25, 13]" intensity="1" />

    <ngts-bounds>
      <models />
    </ngts-bounds>

    <ngts-contact-shadows
      [position]="[0, -35, 0]"
      [opacity]="1"
      [width]="200"
      [height]="200"
      [blur]="1"
      [far]="50"
    />

    <ngts-orbit-controls
      [makeDefault]="true"
      [minPolarAngle]="0"
      [maxPolarAngle]="Math.PI * 1.75"
    />
  `,
  imports: [NgtsBounds, NgtArgs, NgtsOrbitControls, NgtsContactShadows, Models],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultBoundsStory {
  readonly Math = Math;
}

export default {
  title: 'Staging/Bounds',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = () => ({
  props: {
    camera: { fov: 50, position: [0, -10, 100] },
    controls: false,
    lights: false,
    storyComponent: DefaultBoundsStory,
  },
  template: `
<storybook-setup [camera]="camera" [controls]="controls" [lights]="lights" [storyComponent]="storyComponent" />
    `,
});

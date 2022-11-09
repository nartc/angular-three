import {
  NgtObjectPassThrough,
  NgtPiPipe,
  NgtRadianPipe,
  NgtThreeEvent,
  provideObjectHostRef,
  UnknownRecord,
} from '@angular-three/core';
import {
  NgtColorAttribute,
  NgtValueAttribute,
} from '@angular-three/core/attributes';
import { NgtHemisphereLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgtGroup, NgtMesh } from '@angular-three/core/objects';
import { NgtPrimitive } from '@angular-three/core/primitives';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import {
  NgtSobaBounds,
  NgtSobaBoundsApi,
  NgtSobaContactShadows,
} from '@angular-three/soba/staging';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { map, switchMap } from 'rxjs';
import * as THREE from 'three';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

@Component({
  selector: 'model',
  standalone: true,
  template: `
    <ng-container *ngIf="model$ | async as model">
      <ngt-mesh [ngtObjectPassThrough]="this" [dispose]="null">
        <ngt-primitive [ref]="model.geometry" attach="geometry"></ngt-primitive>
        <ngt-primitive [ref]="model.material" attach="material">
          <ngt-value attach="emissive" value="red"></ngt-value>
          <ngt-value attach="roughness" [value]="1"></ngt-value>
        </ngt-primitive>
      </ngt-mesh>
    </ng-container>
  `,
  providers: [provideObjectHostRef(Model)],
  imports: [
    NgIf,
    AsyncPipe,
    NgtMesh,
    NgtObjectPassThrough,
    NgtValueAttribute,
    NgtPrimitive,
  ],
})
class Model extends NgtMesh {
  override isWrapper = true;
  override shouldPassThroughRef = true;

  readonly #gltfLoader = inject(NgtGLTFLoader);

  readonly model$ = this.select((s) => s.name).pipe(
    switchMap((name) =>
      this.#gltfLoader
        .load('soba/bounds-assets.glb')
        .pipe(map(({ nodes }) => nodes[name] as THREE.Mesh))
    )
  );
}

@Component({
  selector: 'storybook-default-bounds',
  standalone: true,
  template: `
    <ngt-color attach="background" color="#f08080"></ngt-color>

    <ngt-spot-light
      [position]="[-100, -100, -100]"
      intensity="0.2"
      angle="0.3"
      penumbra="1"
    ></ngt-spot-light>

    <ngt-hemisphere-light
      color="white"
      groundColor="#ff0f00"
      [position]="[-7, 25, 13]"
      intensity="1"
    ></ngt-hemisphere-light>

    <ngt-soba-bounds #bounds>
      <ngt-group
        (click)="onGroupClick($event, bounds.api)"
        (pointermissed)="onPointerMissed($event, bounds.api)"
      >
        <model
          name="Curly"
          [position]="[1, -11, -20]"
          [rotation]="[2, 0, -0]"
        ></model>
        <model
          name="DNA"
          [position]="[20, 0, -17]"
          [rotation]="[1, 1, -2]"
        ></model>
        <model
          name="Headphones"
          [position]="[20, 2, 4]"
          [rotation]="[1, 0, -1]"
        ></model>
        <model
          name="Notebook"
          [position]="[-21, -15, -13]"
          [rotation]="[2, 0, 1]"
        ></model>
        <model
          name="Rocket003"
          [position]="[18, 15, -25]"
          [rotation]="[1, 1, 0]"
        ></model>
        <model
          name="Roundcube001"
          [position]="[-25, -4, 5]"
          [rotation]="[1, 0, 0]"
          [scale]="0.5"
        ></model>
        <model
          name="Table"
          [position]="[1, -4, -28]"
          [rotation]="[1, 0, -1]"
          [scale]="0.5"
        ></model>
        <model
          name="VR_Headset"
          [position]="[7, -15, 28]"
          [rotation]="[1, 0, -1]"
          [scale]="5"
        ></model>
        <model
          name="Zeppelin"
          [position]="[-20, 10, 10]"
          [rotation]="[3, -1, 3]"
          [scale]="0.005"
        ></model>
      </ngt-group>
    </ngt-soba-bounds>

    <ngt-soba-contact-shadows
      [position]="[0, -35, 0]"
      opacity="1"
      width="200"
      height="200"
      blur="1"
      far="50"
    >
      <ngt-value [attach]="['rotation', 'x']" [value]="90 | radian"></ngt-value>
    </ngt-soba-contact-shadows>

    <ngt-soba-orbit-controls
      makeDefault
      minPolarAngle="0"
      [maxPolarAngle]="1.75 | pi"
    ></ngt-soba-orbit-controls>
  `,
  imports: [
    NgtColorAttribute,
    NgtSpotLight,
    NgtHemisphereLight,
    NgtSobaBounds,
    NgtGroup,
    Model,
    NgtSobaOrbitControls,
    NgtPiPipe,
    NgtSobaContactShadows,
    NgtValueAttribute,
    NgtRadianPipe,
  ],
})
class DefaultBounds {
  onGroupClick(event: NgtThreeEvent<MouseEvent>, api: NgtSobaBoundsApi) {
    event.stopPropagation();
    event.delta <= 2 && api.refresh(event.object).fit();
  }

  onPointerMissed(event: NgtThreeEvent<PointerEvent>, api: NgtSobaBoundsApi) {
    (event as unknown as UnknownRecord)['button'] === 0 && api.refresh().fit();
  }
}

export default {
  title: 'Staging/Bounds',
  decorators: [
    componentWrapperDecorator(
      setupCanvas({
        camera: { fov: 50, position: [0, -10, 100] },
        controls: false,
        lights: false,
      })
    ),
    moduleMetadata({
      imports: [setupCanvasImports, DefaultBounds],
    }),
  ],
} as Meta;

export const Default: Story = () => ({
  template: `
<storybook-default-bounds></storybook-default-bounds>
    `,
});

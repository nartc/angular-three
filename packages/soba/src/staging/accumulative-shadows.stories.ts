import { applyProps, extend, NgtArgs, NgtPush, NgtRxStore } from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import {
  NgtsAccumulativeShadows,
  NgtsEnvironment,
  NgtsRandomizedLight,
} from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { Color } from 'three';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';
import { StorybookSetup } from '../setup-canvas';

@Component({
  selector: 'storybook-suzi',
  standalone: true,
  template: `<ngt-primitive ngtCompound *args="[(suzi$ | ngtPush : null)?.scene]"></ngt-primitive>`,
  imports: [NgtArgs, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class Suzi extends NgtRxStore implements OnInit {
  readonly suzi$ = injectNgtsGLTFLoader(
    'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf'
  ) as Observable<any>;

  ngOnInit() {
    this.hold(this.suzi$, ({ scene, materials }) => {
      scene.traverse((obj: any) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true));
      applyProps(materials.default, {
        color: 'orange',
        roughness: 0,
        normalMap: new THREE.CanvasTexture(
          new FlakesTexture(),
          THREE.UVMapping,
          THREE.RepeatWrapping,
          THREE.RepeatWrapping
        ),
        normalScale: [0.05, 0.05],
      });
      applyProps(materials.default.normalMap, {
        flipY: false,
        repeat: [40, 40],
      });
    });
  }
}

extend({ Color });

@Component({
  selector: 'storybook-default-accumulative-shadows',
  standalone: true,
  template: `
    <ngt-color *args="['goldenrod']" attach="background"></ngt-color>

    <storybook-suzi
      [rotation]="[-0.63, 0, 0]"
      [scale]="2"
      [position]="[0, -1.175, 0]"
    ></storybook-suzi>
    <ngts-accumulative-shadows
      [color]="'goldenrod'"
      [temporal]="true"
      [frames]="100"
      [alphaTest]="0.65"
      [opacity]="2"
      [scale]="14"
      [position]="[0, -0.5, 0]"
    >
      <ngts-randomized-light
        [amount]="8"
        [radius]="4"
        [ambient]="0.5"
        [bias]="0.001"
        [position]="[5, 5, -10]"
      ></ngts-randomized-light>
    </ngts-accumulative-shadows>
    <ngts-orbit-controls [autoRotate]="true"></ngts-orbit-controls>
    <ngts-environment [preset]="'city'"></ngts-environment>
  `,
  imports: [
    NgtsAccumulativeShadows,
    NgtsRandomizedLight,
    Suzi,
    NgtsOrbitControls,
    NgtsEnvironment,
    NgtArgs,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultAccumulativeShadowsStory {}

export default {
  title: 'Staging/Accumulative Shadows',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = () => ({
  props: { storyComponent: DefaultAccumulativeShadowsStory },
  template: `
<storybook-setup [storyComponent]="storyComponent"></storybook-setup>
    `,
});

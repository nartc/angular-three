import { NgtRadianPipe, NgtSidePipe } from '@angular-three/core';
import { NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry, NgtPlaneGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtSobaCameraShake } from '@angular-three/soba/staging';
import { Component } from '@angular/core';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import * as THREE from 'three';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

@Component({
  selector: 'storybook-default-camera-shake',
  standalone: true,
  template: `
    <ngt-mesh (beforeRender)="onBeforeRender($event.object)">
      <ngt-box-geometry [args]="[2, 2, 2]"></ngt-box-geometry>
      <ngt-mesh-standard-material wireframe></ngt-mesh-standard-material>
    </ngt-mesh>
    <ngt-mesh [position]="[0, -6, 0]" [rotation]="[-90 | radian, 0, 0]">
      <ngt-plane-geometry [args]="[200, 200, 75, 75]"></ngt-plane-geometry>
      <ngt-mesh-standard-material wireframe color="red" [side]="'double' | side"></ngt-mesh-standard-material>
    </ngt-mesh>
  `,
  imports: [
    NgtMesh,
    NgtBoxGeometry,
    NgtMeshStandardMaterial,
    NgtValueAttribute,
    NgtRadianPipe,
    NgtPlaneGeometry,
    NgtSidePipe,
  ],
})
class DefaultCameraShake {
  onBeforeRender(cube: THREE.Object3D) {
    cube.rotation.x = cube.rotation.y += 0.01;
  }
}

export default {
  title: 'Staging/Camera Shake',
  decorators: [
    componentWrapperDecorator(setupCanvas({ camera: { position: [0, 0, 10] }, controls: false })),
    moduleMetadata({
      imports: [setupCanvasImports, NgtSobaCameraShake, DefaultCameraShake],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
<ngt-soba-camera-shake
  [maxPitch]="maxPitch"
  [maxRoll]="maxRoll"
  [maxYaw]="maxYaw"
  [pitchFrequency]="pitchFrequency"
  [rollFrequency]="rollFrequency"
  [yawFrequency]="yawFrequency"
></ngt-soba-camera-shake>
<storybook-default-camera-shake></storybook-default-camera-shake>
    `,
});

Default.args = {
  maxPitch: 0.05,
  maxRoll: 0.05,
  maxYaw: 0.05,
  pitchFrequency: 0.8,
  rollFrequency: 0.8,
  yawFrequency: 0.8,
};

export const WithOrbitControls: Story = (args) => ({
  props: args,
  template: `
<!-- orbit controls needs to be BEFORE camera-shake -->
<ngt-soba-orbit-controls makeDefault></ngt-soba-orbit-controls>
<ngt-soba-camera-shake
  [maxPitch]="maxPitch"
  [maxRoll]="maxRoll"
  [maxYaw]="maxYaw"
  [pitchFrequency]="pitchFrequency"
  [rollFrequency]="rollFrequency"
  [yawFrequency]="yawFrequency"
></ngt-soba-camera-shake>
<storybook-default-camera-shake></storybook-default-camera-shake>
  `,
});

WithOrbitControls.args = {
  maxPitch: 0.05,
  maxRoll: 0.05,
  maxYaw: 0.05,
  pitchFrequency: 0.8,
  rollFrequency: 0.8,
  yawFrequency: 0.8,
};

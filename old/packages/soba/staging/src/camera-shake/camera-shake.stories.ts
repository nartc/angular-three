import { NgtMathPipeModule, NgtSidePipeModule } from '@angular-three/core';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import {
  NgtSobaBoxModule,
  NgtSobaPlaneModule,
} from '@angular-three/soba/shapes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import * as THREE from 'three';
import { NgtSobaCameraShakeModule } from './camera-shake.directive';

@Component({
  selector: 'ngt-default-camera-shake-scene',
  template: `
    <ngt-soba-box
      [args]="[2, 2, 2]"
      (animateReady)="onAnimateReady($event.entity)"
    >
      <ngt-mesh-standard-material
        [parameters]="{ wireframe: true }"
      ></ngt-mesh-standard-material>
    </ngt-soba-box>
    <ngt-soba-plane
      [args]="[200, 200, 75, 75]"
      [position]="[0, -6, 0]"
      [rotation]="[-0.5 | mathConst: 'PI', 0, 0]"
    >
      <ngt-mesh-standard-material
        [parameters]="{
          wireframe: true,
          color: 'red',
          side: '' | side: 'double'
        }"
      ></ngt-mesh-standard-material>
    </ngt-soba-plane>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DefaultCameraShakeScene {
  onAnimateReady(cube: THREE.Mesh) {
    cube.rotation.x = cube.rotation.y += 0.01;
  }
}

@NgModule({
  declarations: [DefaultCameraShakeScene],
  exports: [DefaultCameraShakeScene],
  imports: [
    NgtSobaBoxModule,
    NgtMeshStandardMaterialModule,
    NgtSobaPlaneModule,
    NgtMathPipeModule,
    NgtSidePipeModule,
  ],
})
class DefaultCameraShakeSceneModule {}

export default {
  title: 'Soba/Staging/Camera Shake',
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ cameraPosition: [0, 0, 10], controls: false, black: true })
    ),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaCameraShakeModule,
        DefaultCameraShakeSceneModule,
      ],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
    <ngt-soba-camera-shake
      [maxPitch]='maxPitch'
      [maxRoll]='maxRoll'
      [maxYaw]='maxYaw'
      [pitchFrequency]='pitchFrequency'
      [rollFrequency]='rollFrequency'
      [yawFrequency]='yawFrequency'
    ></ngt-soba-camera-shake>
    <ngt-default-camera-shake-scene></ngt-default-camera-shake-scene>
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
    <ngt-soba-camera-shake
      [maxPitch]='maxPitch'
      [maxRoll]='maxRoll'
      [maxYaw]='maxYaw'
      [pitchFrequency]='pitchFrequency'
      [rollFrequency]='rollFrequency'
      [yawFrequency]='yawFrequency'
    ></ngt-soba-camera-shake>
    <ngt-default-camera-shake-scene></ngt-default-camera-shake-scene>
    <ngt-soba-orbit-controls [makeDefault]='true'></ngt-soba-orbit-controls>
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

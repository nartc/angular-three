import {
    NgtMathPipeModule,
    NgtRadianPipeModule,
    NgtSidePipeModule,
} from '@angular-three/core';
import {
    NgtBoxGeometryModule,
    NgtPlaneGeometryModule,
} from '@angular-three/core/geometries';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaCameraShakeModule } from '@angular-three/soba/staging';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import {
    componentWrapperDecorator,
    Meta,
    moduleMetadata,
    Story,
} from '@storybook/angular';
import * as THREE from 'three';
import { setupCanvas, setupCanvasModules } from '../../setup-canvas';

@Component({
    selector: 'ngt-default-camera-shake-scene',
    template: `
        <ngt-mesh (animateReady)="onAnimateReady($event.object)">
            <ngt-box-geometry [args]="[2, 2, 2]"></ngt-box-geometry>
            <ngt-mesh-standard-material
                [parameters]="{ wireframe: true }"
            ></ngt-mesh-standard-material>
        </ngt-mesh>
        <ngt-mesh [position]="[0, -6, 0]" [rotation]="[-90 | radian, 0, 0]">
            <ngt-plane-geometry
                [args]="[200, 200, 75, 75]"
            ></ngt-plane-geometry>
            <ngt-mesh-standard-material
                [parameters]="{
                    wireframe: true,
                    color: 'red',
                    side: 'double' | side
                }"
            ></ngt-mesh-standard-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class DefaultCameraShakeScene {
    onAnimateReady(cube: THREE.Object3D) {
        cube.rotation.x = cube.rotation.y += 0.01;
    }
}

@NgModule({
    declarations: [DefaultCameraShakeScene],
    exports: [DefaultCameraShakeScene],
    imports: [
        NgtBoxGeometryModule,
        NgtMeshStandardMaterialModule,
        NgtPlaneGeometryModule,
        NgtMathPipeModule,
        NgtSidePipeModule,
        NgtMeshModule,
        NgtRadianPipeModule,
    ],
})
class DefaultCameraShakeSceneModule {}

export default {
    title: 'Soba/Staging/Camera Shake',
    decorators: [
        componentWrapperDecorator(
            setupCanvas({ cameraPosition: [0, 0, 10], controls: false })
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
      [maxPitch]="maxPitch"
      [maxRoll]="maxRoll"
      [maxYaw]="maxYaw"
      [pitchFrequency]="pitchFrequency"
      [rollFrequency]="rollFrequency"
      [yawFrequency]="yawFrequency"
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
    <!-- orbit controls needs to be BEFORE camera-shake -->
    <ngt-soba-orbit-controls [makeDefault]="true"></ngt-soba-orbit-controls>
    <ngt-soba-camera-shake
      [maxPitch]="maxPitch"
      [maxRoll]="maxRoll"
      [maxYaw]="maxYaw"
      [pitchFrequency]="pitchFrequency"
      [rollFrequency]="rollFrequency"
      [yawFrequency]="yawFrequency"
    ></ngt-soba-camera-shake>
    <ngt-default-camera-shake-scene></ngt-default-camera-shake-scene>
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

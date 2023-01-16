import { extend, NgtArgs } from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { NgtsCameraShake } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry } from 'three';
import { StorybookSetup } from '../setup-canvas';

extend({ Mesh, BoxGeometry, MeshStandardMaterial, PlaneGeometry, MeshBasicMaterial });

@Component({
    selector: 'storybook-shake-scene',
    standalone: true,
    template: `
        <ngt-mesh (beforeRender)="onBeforeRender($any($event).object)">
            <ngt-box-geometry *args="[2, 2, 2]" />
            <ngt-mesh-standard-material wireframe color="white" />
        </ngt-mesh>
        <ngt-mesh [position]="[0, -6, 0]" [rotation]="[Math.PI / -2, 0, 0]">
            <ngt-plane-geometry *args="[200, 200, 75, 75]" />
            <ngt-mesh-basic-material wireframe color="red" [side]="DoubleSide" />
        </ngt-mesh>
    `,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class Scene {
    readonly Math = Math;
    readonly DoubleSide = DoubleSide;

    onBeforeRender(mesh: Mesh) {
        mesh.rotation.x = mesh.rotation.y += 0.01;
    }
}

@Component({
    selector: 'storybook-with-orbit-controls-shake',
    standalone: true,
    template: `
        <ngts-orbit-controls [makeDefault]="true" />
        <ngts-camera-shake
            [maxPitch]="maxPitch"
            [maxRoll]="maxRoll"
            [maxYaw]="maxYaw"
            [pitchFrequency]="pitchFrequency"
            [rollFrequency]="rollFrequency"
            [yawFrequency]="yawFrequency"
        />
        <storybook-shake-scene />
    `,
    imports: [NgtsCameraShake, NgtsOrbitControls, Scene],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class WithOrbitControlsShakeStory {
    @Input() maxPitch = 0.05;
    @Input() maxRoll = 0.05;
    @Input() maxYaw = 0.05;
    @Input() pitchFrequency = 0.8;
    @Input() rollFrequency = 0.8;
    @Input() yawFrequency = 0.8;
}

@Component({
    selector: 'storybook-default-shake',
    standalone: true,
    template: `
        <ngts-camera-shake
            [maxPitch]="maxPitch"
            [maxRoll]="maxRoll"
            [maxYaw]="maxYaw"
            [pitchFrequency]="pitchFrequency"
            [rollFrequency]="rollFrequency"
            [yawFrequency]="yawFrequency"
        />
        <storybook-shake-scene />
    `,
    imports: [NgtsCameraShake, Scene],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultShakeStory {
    @Input() maxPitch = 0.05;
    @Input() maxRoll = 0.05;
    @Input() maxYaw = 0.05;
    @Input() pitchFrequency = 0.8;
    @Input() rollFrequency = 0.8;
    @Input() yawFrequency = 0.8;
}

export default {
    title: 'Staging/Camera Shake',
    decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = (args) => ({
    props: {
        camera: { position: [0, 0, 10] },
        controls: false,
        storyComponent: DefaultShakeStory,
        storyInputs: args,
    },
    template: `
<storybook-setup [camera]="camera" [controls]="controls" [storyComponent]="storyComponent" [storyInputs]="storyInputs" />
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
    props: {
        camera: { position: [0, 0, 10] },
        controls: false,
        storyComponent: WithOrbitControlsShakeStory,
        storyInputs: args,
    },
    template: `
<storybook-setup [camera]="camera" [controls]="controls" [storyComponent]="storyComponent" [storyInputs]="storyInputs" />
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

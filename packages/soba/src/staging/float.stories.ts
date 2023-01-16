import { extend, NgtArgs } from '@angular-three/core';
import { NgtsFloat } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry } from 'three';
import { StorybookSetup } from '../setup-canvas';

extend({ Mesh, BoxGeometry, PlaneGeometry, MeshStandardMaterial, MeshBasicMaterial });

@Component({
    selector: 'storybook-default-float',
    standalone: true,
    template: `
        <ngts-float
            [position]="[0, 1.1, 0]"
            [rotation]="[Math.PI / 3.5, 0, 0]"
            [floatIntensity]="floatIntensity"
            [floatingRange]="floatingRange"
            [rotationIntensity]="rotationIntensity"
            [speed]="speed"
        >
            <ngt-mesh>
                <ngt-box-geometry *args="[2, 2, 2]" />
                <ngt-mesh-standard-material wireframe color="white" />
            </ngt-mesh>
        </ngts-float>
        <ngt-mesh [position]="[0, -6, 0]" [rotation]="[Math.PI / -2, 0, 0]">
            <ngt-plane-geometry *args="[200, 200, 75, 75]" />
            <ngt-mesh-basic-material wireframe color="red" [side]="DoubleSide" />
        </ngt-mesh>
    `,
    imports: [NgtsFloat, NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultFloatStory {
    @Input() floatingRange: [number?, number?] = [undefined, 1];
    @Input() rotationIntensity = 4;
    @Input() floatIntensity = 2;
    @Input() speed = 5;

    readonly Math = Math;
    readonly DoubleSide = DoubleSide;
}

export default {
    title: 'Staging/Float',
    decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = (args) => ({
    props: {
        camera: { position: [0, 0, 10] },
        storyComponent: DefaultFloatStory,
        storyInputs: args,
    },
    template: `
<storybook-setup [camera]="camera" [storyComponent]="storyComponent" [storyInputs]="storyInputs" />
    `,
});

Default.args = {
    floatingRange: [undefined, 1],
    rotationIntensity: 4,
    floatIntensity: 2,
    speed: 5,
};

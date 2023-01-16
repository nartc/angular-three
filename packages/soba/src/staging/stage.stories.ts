import { extend, NgtArgs } from '@angular-three/core';
import { ngtsEnvironmentPresetsObj, NgtsStage } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { Color, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';
import { StorybookSetup } from '../setup-canvas';

enum presets {
    rembrant = 'rembrandt',
    portrait = 'portrait',
    upfront = 'upfront',
    soft = 'soft',
}

extend({ Color, Mesh, SphereGeometry, MeshStandardMaterial });

@Component({
    selector: 'storybook-default-stage',
    standalone: true,
    template: `
        <ngt-color attach="background" *args="['white']" />
        <ngts-stage [intensity]="intensity" [environment]="envPreset" [preset]="preset">
            <ngt-mesh>
                <ngt-sphere-geometry *args="[1, 64, 64]" />
                <ngt-mesh-standard-material roughness="0" color="royalblue" />
            </ngt-mesh>
        </ngts-stage>
    `,
    imports: [NgtsStage, NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultStageStory {
    @Input() intensity = 1;
    @Input() envPreset = Object.keys(ngtsEnvironmentPresetsObj)[0];
    @Input() preset = Object.keys(presets)[0];
}

export default {
    title: 'Staging/Stage',
    decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = (args) => ({
    props: { camera: { position: [0, 0, 3] }, storyComponent: DefaultStageStory, storyInputs: args },
    template: `
<storybook-setup [camera]="camera" [storyComponent]="storyComponent" [storyInputs]="storyInputs" />
    `,
});

Default.args = {
    intensity: 1,
    envPreset: Object.keys(ngtsEnvironmentPresetsObj)[0],
    preset: Object.keys(presets)[0],
};

Default.argTypes = {
    preset: { options: presets, control: { type: 'select' } },
    envPreset: { options: ngtsEnvironmentPresetsObj, control: { type: 'select' } },
};

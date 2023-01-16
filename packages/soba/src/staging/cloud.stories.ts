import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { NgtsCloud } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { StorybookSetup } from '../setup-canvas';

@Component({
    selector: 'storybook-default-cloud',
    standalone: true,
    template: `
        <ngts-cloud [position]="[-4, -2, 0]" />
        <ngts-cloud [position]="[-4, 2, 0]" />
        <ngts-cloud />
        <ngts-cloud [position]="[4, -2, 0]" />
        <ngts-cloud [position]="[4, 2, 0]" />
        <ngts-orbit-controls [enablePan]="false" [zoomSpeed]="0.5" />
    `,
    imports: [NgtsCloud, NgtsOrbitControls],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultCloudStory {}

export default {
    title: 'Staging/Cloud',
    decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = () => ({
    props: {
        camera: { position: [0, 0, 10] },
        controls: false,
        storyComponent: DefaultCloudStory,
    },
    template: `
<storybook-setup [camera]="camera" [controls]="controls" [storyComponent]="storyComponent" />
    `,
});

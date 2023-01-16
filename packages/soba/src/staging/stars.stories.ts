import { extend, NgtArgs } from '@angular-three/core';
import { NgtsStars } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { AxesHelper, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { StorybookSetup } from '../setup-canvas';

extend({ Mesh, PlaneGeometry, MeshBasicMaterial, AxesHelper });

@Component({
    selector: 'storybook-default-stars',
    standalone: true,
    template: `
        <ngts-stars />
        <ngt-mesh [rotation]="[Math.PI / 2, 0, 0]">
            <ngt-plane-geometry *args="[100, 100, 4, 4]" />
            <ngt-mesh-basic-material color="black" wireframe />
        </ngt-mesh>
        <ngt-axes-helper />
    `,
    imports: [NgtsStars, NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultStarsStory {
    readonly Math = Math;
}

export default {
    title: 'Staging/Stars',
    decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = () => ({
    props: { storyComponent: DefaultStarsStory },
    template: `
<storybook-setup [storyComponent]="storyComponent" />
    `,
});

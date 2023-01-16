import { extend, NgtArgs, NgtPush } from '@angular-three/core';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgtsCenter } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { map } from 'rxjs';
import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three';
import { StorybookSetup, turn } from '../setup-canvas';

extend({ Mesh, BoxGeometry, MeshNormalMaterial });

@Component({
    selector: 'storybook-default-center',
    standalone: true,
    template: `
        <ngts-center [position]="[5, 5, 10]">
            <ngt-mesh>
                <ngt-box-geometry *args="[10, 10, 10]" />
                <ngt-mesh-normal-material wireframe />
            </ngt-mesh>
            <ngt-primitive *args="[model$ | ngtPush : null]" scale="0.01" (beforeRender)="turn($any($event).object)" />
        </ngts-center>
    `,
    imports: [NgtsCenter, NgtPush, NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultCenterStory {
    readonly model$ = injectNgtsGLTFLoader('soba/assets/LittlestTokyo.glb').pipe(map((node) => node.scene));
    readonly turn = turn;
}

export default {
    title: 'Staging/Center',
    decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = () => ({
    props: { camera: { position: [0, 0, -10] }, storyComponent: DefaultCenterStory },
    template: `
<storybook-setup [camera]="camera" [storyComponent]="storyComponent" />
    `,
});

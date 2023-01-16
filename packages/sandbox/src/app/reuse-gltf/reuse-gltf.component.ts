import { NgtCanvas } from '@angular-three/core';
import { NgtsLoader } from '@angular-three/soba/loaders';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
    selector: 'sandbox-reuse-gltf',
    standalone: true,
    template: `
        <ngt-canvas
            [scene]="Scene"
            [shadows]="true"
            [camera]="{ position: [0, 0, 150], fov: 40 }"
            [compoundPrefixes]="['sandbox-shoe']"
        />
        <ngts-loader />
    `,
    imports: [NgtCanvas, NgtsLoader],
})
export default class SandboxReuseGLTF {
    readonly Scene = Scene;
}

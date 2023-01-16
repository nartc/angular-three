import { NgtCanvas } from '@angular-three/core';
import { NgtsLoader } from '@angular-three/soba/loaders';
import { NgtsStats } from '@angular-three/soba/performance';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
    selector: 'sandbox-lod',
    standalone: true,
    template: `
        <ngt-canvas [scene]="Scene" [shadows]="true" frameloop="demand" [camera]="{ position: [0, 0, 40] }" />
        <ngts-stats />
        <ngts-loader />
    `,
    imports: [NgtCanvas, NgtsLoader, NgtsStats],
})
export default class SandboxLOD {
    readonly Scene = Scene;
}

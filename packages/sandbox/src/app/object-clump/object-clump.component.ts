import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
    selector: 'sandbox-object-clump',
    standalone: true,
    template: `
        <ngt-canvas [scene]="Scene" [shadows]="true" [camera]="{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }" />
    `,
    imports: [NgtCanvas],
})
export default class SandboxObjectClump {
    readonly Scene = Scene;
}

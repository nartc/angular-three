import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
    selector: 'sandbox-monday-morning',
    standalone: true,
    template: `
        <ngt-canvas
            [scene]="Scene"
            [camera]="{ far: 100, near: 1, position: [-25, 20, 25], zoom: 25 }"
            [orthographic]="true"
            [shadows]="true"
            [compoundPrefixes]="['sandbox-box']"
        />
    `,
    imports: [NgtCanvas],
    styles: [
        `
            :host {
                cursor: none;
            }
        `,
    ],
})
export default class SandboxMondayMorning {
    readonly Scene = Scene;
}

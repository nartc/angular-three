import { NgtCanvas } from '@angular-three/core';
import { NgtsStats } from '@angular-three/soba/performance';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
    selector: 'sandbox-color-grading',
    standalone: true,
    template: ` <ngt-canvas [scene]="Scene" frameloop="demand" [camera]="{ position: [0, 0, 5], fov: 45 }" /> 
    <ngts-stats />
    `,
    imports: [NgtCanvas, NgtsStats],
    styles: [
        `
            :host {
                display: block;
                height: 100%;
                width: 100%;
                background-image: linear-gradient(-225deg, #cbbacc 0%, #2580b3 100%);
            }
        `,
    ],
})
export default class SandboxColorGrading {
    readonly Scene = Scene;
}

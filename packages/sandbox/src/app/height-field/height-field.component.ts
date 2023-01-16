import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
    selector: 'sandbox-height-field',
    standalone: true,
    template: ` <ngt-canvas [scene]="Scene" [shadows]="true" [camera]="{ position: [0, -10, 10] }" /> `,
    imports: [NgtCanvas],
})
export default class SandboxHeightField {
    readonly Scene = Scene;
}

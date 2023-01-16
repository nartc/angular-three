import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
    selector: 'sandbox-view-cube',
    standalone: true,
    template: ` <ngt-canvas [scene]="Scene" />`,
    imports: [NgtCanvas],
})
export default class SandboxViewCube {
    readonly Scene = Scene;
}

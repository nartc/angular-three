import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
    selector: 'sandbox-raycast-vehicle',
    standalone: true,
    template: `
        <ngt-canvas [scene]="Scene" [shadows]="true" [camera]="{ position: [0, 5, 15], fov: 50 }" />
        <div style="color: white;fontSize:1.2em;left:50px;top:20px;position:absolute;">
            <pre>
* WASD to drive, space to brake
                <br />r to reset
                <br />? to debug
            </pre>
        </div>
    `,
    imports: [NgtCanvas],
})
export default class SandboxRaycastVehicle {
    readonly Scene = Scene;
}

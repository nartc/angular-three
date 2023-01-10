import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
  selector: 'sandbox-kinematic-cube',
  standalone: true,
  template: `
    <ngt-canvas
      [shadows]="true"
      [gl]="{ alpha: false }"
      [camera]="{ position: [0, -12, 16] }"
      [scene]="Scene"
    />
  `,
  imports: [NgtCanvas],
})
export default class SandboxKinematicCube {
  readonly Scene = Scene;
}

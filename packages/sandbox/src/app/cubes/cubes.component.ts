import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
  selector: 'sandbox-cubes',
  standalone: true,
  template: ` <ngt-canvas [scene]="Scene" [camera]="{ position: [0, 0, 5] }"> </ngt-canvas> `,
  imports: [NgtCanvas],
})
export default class SandboxCubes {
  readonly Scene = Scene;
}

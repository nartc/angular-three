import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
  selector: 'sandbox-physic-cubes',
  standalone: true,
  template: `
    <ngt-canvas
      [shadows]="true"
      [dpr]="[1, 2]"
      [gl]="{ alpha: false }"
      [camera]="{ position: [-1, 5, 5], fov: 45 }"
      [scene]="Scene"
    >
    </ngt-canvas>
  `,
  imports: [NgtCanvas],
})
export default class SandboxPhysicCubes {
  readonly Scene = Scene;
}

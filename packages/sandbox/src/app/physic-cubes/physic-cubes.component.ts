import { NgtCanvas, NgtCanvasContent } from '@angular-three/core-two';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sandbox-physic-cubes',
  standalone: true,
  template: `
    <ngt-canvas
      [shadows]="true"
      [dpr]="[1, 2]"
      [gl]="{ alpha: false }"
      [camera]="{ position: [-1, 5, 5], fov: 45 }"
    >
      <router-outlet *ngtCanvasContent name="gl"></router-outlet>
    </ngt-canvas>
  `,
  imports: [NgtCanvas, NgtCanvasContent, RouterOutlet],
})
export default class SandboxPhysicCubes {}

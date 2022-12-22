import { NgtCanvas, NgtCanvasContent } from '@angular-three/core-two';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sandbox-cubes',
  standalone: true,
  template: `
    <ngt-canvas [camera]="{ position: [0, 0, 5] }">
      <router-outlet *ngtCanvasContent name="gl"></router-outlet>
    </ngt-canvas>
  `,
  imports: [NgtCanvas, RouterOutlet, NgtCanvasContent],
})
export default class SandboxCubes {}

import { NgtCanvas, NgtCanvasContent } from '@angular-three/core';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sandbox-cubes',
  standalone: true,
  template: `
    <ngt-canvas>
      <router-outlet *ngtCanvasContent name="gl"></router-outlet>
    </ngt-canvas>
  `,
  imports: [NgtCanvas, RouterOutlet, NgtCanvasContent],
})
export default class SandboxCubes {}
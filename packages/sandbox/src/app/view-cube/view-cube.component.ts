import { NgtCanvas, NgtCanvasContent } from '@angular-three/core-two';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sandbox-view-cube',
  standalone: true,
  template: `
    <ngt-canvas>
      <router-outlet *ngtCanvasContent name="gl"></router-outlet>
    </ngt-canvas>
  `,
  imports: [NgtCanvas, NgtCanvasContent, RouterOutlet],
})
export default class SandboxViewCube {}

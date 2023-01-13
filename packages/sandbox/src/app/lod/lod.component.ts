import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
  selector: 'sandbox-lod',
  standalone: true,
  template: `
    <ngt-canvas
      [scene]="Scene"
      [shadows]="true"
      frameloop="demand"
      [camera]="{ position: [0, 0, 40] }"
    ></ngt-canvas>
  `,
  imports: [NgtCanvas],
})
export default class SandboxLOD {
  readonly Scene = Scene;
}

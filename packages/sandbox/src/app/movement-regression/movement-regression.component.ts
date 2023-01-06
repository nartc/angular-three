import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
  selector: 'sandbox-movement-regression',
  standalone: true,
  template: `
    <ngt-canvas
      [scene]="Scene"
      [shadows]="true"
      [performance]="{ min: 0.1 }"
      [gl]="{ antialias: false }"
      [camera]="{ position: [0, 0, 0.8], fov: 75, near: 0.5, far: 1 }"
      [compoundPrefixes]="['sandbox-y-bot']"
    ></ngt-canvas>
  `,
  imports: [NgtCanvas],
})
export default class SandboxMovementRegression {
  readonly Scene = Scene;
}

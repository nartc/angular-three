import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
  selector: 'sandbox-keen-bloom',
  standalone: true,
  template: `
    <ngt-canvas [scene]="Scene" [camera]="{ position: [0, 0, 15], near: 5, far: 20 }"></ngt-canvas>
  `,
  imports: [NgtCanvas],
})
export default class SandboxKeenBloom {
  readonly Scene = Scene;
}
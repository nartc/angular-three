import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
  selector: 'sandbox-test',
  standalone: true,
  template: `<ngt-canvas [scene]="Scene"></ngt-canvas>`,
  imports: [NgtCanvas],
})
export default class SandboxTest {
  readonly Scene = Scene;
}

import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { Scene } from './scene.component';

@Component({
  selector: 'sandbox-vertex-colors-instances',
  standalone: true,
  template: ` <ngt-canvas [scene]="Scene" [camera]="{ position: [0, 0, 1] }" />`,
  imports: [NgtCanvas],
})
export default class SandboxVertexColorsInstances {
  readonly Scene = Scene;
}

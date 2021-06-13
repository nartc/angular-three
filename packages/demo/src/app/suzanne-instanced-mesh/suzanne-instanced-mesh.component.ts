import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-suzanne-instanced-mesh',
  template: `
    <ngt-canvas [camera]="{ position: [0, 0, 20] }">
      <demo-orbit-controls></demo-orbit-controls>
      <ngt-stats></ngt-stats>
      <demo-suzanne></demo-suzanne>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuzanneInstancedMeshComponent {}

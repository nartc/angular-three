import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-shaders-boxes',
  template: `
    <ngt-canvas
      [linear]="true"
      [camera]="{ position: [0, 0, 15], near: 5, far: 20 }"
      (created)="$event.gl.setClearColor('lightpink')"
    >
      <demo-orbit-controls></demo-orbit-controls>
      <ngt-stats></ngt-stats>
      <ngt-ambient-light o3d></ngt-ambient-light>
      <ngt-point-light
        o3d
        [position]="[150, 150, 150]"
        [args]="[undefined, 0.55]"
      ></ngt-point-light>
      <demo-boxes></demo-boxes>
      <demo-boxes-effects></demo-boxes-effects>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShadersBoxesComponent {}

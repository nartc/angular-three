import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-level-of-details',
  template: `
    <ngt-canvas
      [linear]="true"
      [camera]="{ fov: 45, near: 1, far: 15000, position: [0, 0, 1000] }"
      [scene]="{ fog: ['000000', 1, 15000] | fog }"
      (created)="$event.camera.updateProjectionMatrix()"
    >
      <demo-fly-controls></demo-fly-controls>
      <ngt-stats></ngt-stats>
      <ngt-point-light
        o3d
        [position]="[0, 0, 0]"
        [args]="['#ff2200']"
      ></ngt-point-light>
      <ngt-directional-light
        o3d
        [position]="[0, 0, 1]"
        [args]="['#ffffff']"
      ></ngt-directional-light>
      <demo-lods></demo-lods>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelOfDetailsComponent {}

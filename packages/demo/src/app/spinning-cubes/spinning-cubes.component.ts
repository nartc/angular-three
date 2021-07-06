import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-spinning-cubes',
  template: `
    <ngt-canvas
      [camera]="{ position: [0, 0, 5] }"
      (created)="$event.gl.setClearColor('white')"
    >
      <demo-orbit-controls></demo-orbit-controls>
      <ngt-stats></ngt-stats>
      <ngt-grid-helper o3d></ngt-grid-helper>
      <ngt-ambient-light o3d [args]="[undefined, 0.5]"></ngt-ambient-light>
      <ngt-spot-light
        o3d
        [position]="[10, 10, 10]"
        [args]="[undefined, undefined, undefined, 0.5, 1]"
      ></ngt-spot-light>
      <ngt-point-light o3d [position]="[-10, -10, -10]"></ngt-point-light>
      <demo-box [position]="[1.2, 0, 0]"></demo-box>
      <demo-box [position]="[-1.2, 0, 0]"></demo-box>

      <ngt-html o3d>
        <button (click)="count = count + 1">Click {{ count }}</button>
      </ngt-html>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinningCubesComponent {
  count = 1;
}

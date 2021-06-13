import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-docs-homepage',
  template: `
    <ngt-canvas
      [shadows]="true"
      [camera]="{ fov: 75, position: [0, 0, 50], near: 10, far: 150 }"
      [scene]="{
        fog: ['black', 60, 100] | fog,
        background: ['#f0f0f0'] | color
      }"
    >
      <ngt-ambient-light o3d [intensity]="1.5"></ngt-ambient-light>
      <ngt-point-light
        o3d
        [position]="[100, 10, -50]"
        [intensity]="20"
        [castShadow]="true"
      ></ngt-point-light>
      <ngt-point-light
        o3d
        [position]="[-100, -100, -100]"
        [intensity]="10"
        color="black"
      ></ngt-point-light>
      <demo-swarm [count]="150" [position]="[0, 10, 0]"></demo-swarm>
      <ngt-contact-shadows
        o3d
        [rotation]="[0.5 | mathConst: 'PI', 0, 0]"
        [position]="[0, -30, 0]"
        [opacity]="0.6"
        [width]="130"
        [height]="130"
        [blur]="1"
        [far]="40"
      ></ngt-contact-shadows>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsHomepageComponent {}

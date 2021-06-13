import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'demo-jumbo-birds',
  template: `
    <ngt-canvas [camera]="{ position: [0, 0, 35] }">
      <ngt-stats></ngt-stats>
      <ngt-orbit-controls></ngt-orbit-controls>
      <ngt-ambient-light o3d [intensity]="2"></ngt-ambient-light>
      <ngt-point-light o3d [position]="[40, 40, 40]"></ngt-point-light>
      <demo-jumbo></demo-jumbo>
      <demo-birds></demo-birds>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JumboBirdsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

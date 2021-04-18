import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-birds',
  template: `
    <demo-bird
      *ngFor="let bird of birds"
      [position]="[bird.x, bird.y, bird.z]"
      [rotation]="[0, bird.x > 0 ? 3.14 : 0, 0]"
      [speed]="bird.speed"
      [factor]="bird.factor"
      [url]="bird.bird"
    ></demo-bird>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirdsComponent {
  birds = new Array(100).fill(undefined).map((_, i) => {
    const x = (15 + Math.random() * 30) * (Math.round(Math.random()) ? -1 : 1);
    const y = -10 + Math.random() * 20;
    const z = -5 + Math.random() * 10;
    const bird = ['Stork', 'Parrot', 'Flamingo'][Math.round(Math.random() * 2)];
    const speed = bird === 'Stork' ? 0.5 : bird === 'Flamingo' ? 2 : 5;
    const factor =
      bird === 'Stork'
        ? 0.5 + Math.random()
        : bird === 'Flamingo'
        ? 0.25 + Math.random()
        : 1 + Math.random() - 0.5;
    return {
      x,
      y,
      z,
      bird: `/assets/${bird}.glb`,
      speed,
      factor,
    };
  });
}

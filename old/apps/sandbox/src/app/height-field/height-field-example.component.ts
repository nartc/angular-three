import { NgtPhysics } from '@angular-three/cannon';
import { NgtCanvas, NgtRadianPipe } from '@angular-three/core';
import { NgtColorAttribute } from '@angular-three/core/attributes';
import { NgtAmbientLight, NgtDirectionalLight } from '@angular-three/core/lights';
import { NgtStats } from '@angular-three/core/stats';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HeightFieldComponent } from './height-field.component';
import { SpheresComponent } from './spheres.component';

type GenerateHeightmapArgs = {
  height: number;
  number: number;
  scale: number;
  width: number;
};

/* Generates a 2D array using Worley noise. */
function generateHeightmap({ width, height, number, scale }: GenerateHeightmapArgs) {
  const data = [];

  const seedPoints = [];
  for (let i = 0; i < number; i++) {
    seedPoints.push([Math.random(), Math.random()]);
  }

  let max = 0;
  for (let i = 0; i < width; i++) {
    const row = [];
    for (let j = 0; j < height; j++) {
      let min = Infinity;
      seedPoints.forEach((p) => {
        const distance2 = (p[0] - i / width) ** 2 + (p[1] - j / height) ** 2;
        if (distance2 < min) {
          min = distance2;
        }
      });
      const d = Math.sqrt(min);
      if (d > max) {
        max = d;
      }
      row.push(d);
    }
    data.push(row);
  }

  /* Normalize and scale. */
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      data[i][j] *= scale / max;
    }
  }
  return data;
}

@Component({
  selector: 'sandbox-height-field-example',
  standalone: true,
  templateUrl: 'height-field-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtCanvas,
    NgtColorAttribute,
    NgtSobaOrbitControls,
    NgtPhysics,
    NgtAmbientLight,
    NgtDirectionalLight,
    NgtStats,
    HeightFieldComponent,
    NgtRadianPipe,
    SpheresComponent,
  ],
})
export class HeightFieldExampleComponent {
  @Input() scale = 10;

  readonly heights = generateHeightmap({
    height: 128,
    number: 10,
    scale: 1,
    width: 128,
  });
}

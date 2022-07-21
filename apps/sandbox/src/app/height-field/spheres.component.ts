import { NgtPhysicBody } from '@angular-three/cannon';
import { coerceNumberProperty, NgtComponentStore, NumberInput } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'sandbox-spheres[columns][rows][spread]',
  templateUrl: 'spheres.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
})
export class SpheresComponent extends NgtComponentStore {
  @Input() set columns(columns: NumberInput) {
    this.set({ columns: coerceNumberProperty(columns) });
  }

  @Input() set rows(rows: NumberInput) {
    this.set({ rows: coerceNumberProperty(rows) });
  }

  @Input() spread = 0;

  readonly sphereRef = this.physicBody.useSphere<THREE.InstancedMesh>((index) => ({
    args: [0.2],
    mass: 1,
    position: [
      ((index % this.get((s) => s['columns'])) - (this.get((s) => s['columns']) - 1) / 2) * this.spread,
      2.0,
      (Math.floor(index / this.get((s) => s['columns'])) - (this.get((s) => s['rows']) - 1) / 2) * this.spread,
    ],
  }));

  readonly viewModel$ = this.select(
    this.select((s) => s['columns']),
    this.select((s) => s['rows']),
    (columns, rows) => {
      const number = columns * rows;
      const array = new Float32Array(number * 3);
      const color = new THREE.Color();
      for (let i = 0; i < number; i++) {
        color
          .set(niceColors[17][Math.floor(Math.random() * 5)])
          .convertSRGBToLinear()
          .toArray(array, i * 3);
      }
      return { colors: array, number };
    }
  );

  constructor(private physicBody: NgtPhysicBody) {
    super();
  }
}

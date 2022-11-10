import {
  coerceNumberProperty,
  is,
  NgtObjectPassThrough,
  NgtTriple,
  NumberInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
  startWithUndefined,
} from '@angular-three/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { filter, Observable, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaLine } from '../line/line';
import { NgtSobaLinePassThrough } from '../line/line-pass-through';

@Component({
  selector: 'ngt-soba-quadratic-bezier-line[start][end]',
  standalone: true,
  template: `
    <ngt-soba-line
      *ngIf="quadraticBezierPoints$ | async as points"
      [ngtObjectPassThrough]="this"
      [ngtSobaLinePassThrough]="this"
      [points]="points"
    >
      <ng-content></ng-content>
    </ngt-soba-line>
  `,

  imports: [
    NgtSobaLine,
    NgtObjectPassThrough,
    NgtSobaLinePassThrough,
    NgIf,
    AsyncPipe,
  ],
  providers: [
    provideNgtObject(NgtSobaQuadraticBezierLine),
    provideObjectRef(NgtSobaQuadraticBezierLine),
    provideObjectHostRef(NgtSobaQuadraticBezierLine),
  ],
})
export class NgtSobaQuadraticBezierLine extends NgtSobaLine {
  override isWrapper = true;
  override shouldPassThroughRef = true;

  @Input() set start(start: THREE.Vector3 | NgtTriple) {
    this.set({ start });
  }

  @Input() set end(end: THREE.Vector3 | NgtTriple) {
    this.set({ end });
  }

  @Input() set mid(mid: THREE.Vector3 | NgtTriple) {
    this.set({ mid });
  }

  @Input() set segments(segments: NumberInput) {
    this.set({ segments: coerceNumberProperty(segments) });
  }

  readonly quadraticBezierPoints$: Observable<THREE.Vector3[]> = this.select(
    this.select((s) => s['start']),
    this.select((s) => s['end']),
    this.select((s) => s['mid']).pipe(startWithUndefined()),
    this.select((s) => s['segments']),
    (start, end, mid, segments) => this.#getPoints(start, end, mid, segments),
    { debounce: true }
  );

  readonly #curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  );
  readonly #v = new THREE.Vector3();

  readonly #setPoints = this.effect(
    tap(() => {
      (
        this.instanceValue as unknown as {
          setPoints: (
            start: THREE.Vector3 | NgtTriple,
            end: THREE.Vector3 | NgtTriple,
            mid: THREE.Vector3 | NgtTriple
          ) => void;
        }
      ).setPoints = (start, end, mid) => {
        const points = this.#getPoints(start, end, mid);
        if (this.instanceValue.geometry) {
          this.instanceValue.geometry.setPositions(
            points.map((p) => p.toArray()).flat()
          );
        }
      };
    })
  );

  override preInit() {
    super.preInit();
    this.set((s) => ({
      start: s['start'] ?? [0, 0, 0],
      end: s['end'] ?? [0, 0, 0],
      segments: s['segments'] ?? 20,
    }));
  }

  override postInit() {
    super.postInit();
    this.#setPoints(this.instance.pipe(filter((value) => !!value)));
  }

  #getPoints(
    start: THREE.Vector3 | NgtTriple,
    end: THREE.Vector3 | NgtTriple,
    mid?: THREE.Vector3 | NgtTriple,
    segments = 20
  ) {
    if (is.vector3(start)) this.#curve.v0.copy(start);
    else this.#curve.v0.set(...start);
    if (is.vector3(end)) this.#curve.v2.copy(end);
    else this.#curve.v2.set(...end);
    if (is.vector3(mid)) {
      this.#curve.v1.copy(mid);
    } else {
      this.#curve.v1.copy(
        this.#curve.v0
          .clone()
          .add(this.#curve.v2.clone().sub(this.#curve.v0))
          .add(this.#v.set(0, this.#curve.v0.y - this.#curve.v2.y, 0))
      );
    }
    return this.#curve.getPoints(segments);
  }
}

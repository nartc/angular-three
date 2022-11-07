import {
  coerceNumberProperty,
  is,
  make,
  NgtObjectPassThrough,
  NgtTriple,
  NumberInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaLine } from '../line/line';
import { NgtSobaLinePassThrough } from '../line/line-pass-through';

@Component({
  selector: 'ngt-soba-cubic-bezier-line[start][end][midA][midB]',
  standalone: true,
  template: `
    <ngt-soba-line
      *ngIf="cubicBezierPoints$ | async as points"
      [ngtObjectPassThrough]="this"
      [ngtSobaLinePassThrough]="this"
      [points]="points"
    >
      <ng-content></ng-content>
    </ngt-soba-line>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtSobaLine,
    NgtObjectPassThrough,
    NgtSobaLinePassThrough,
    AsyncPipe,
    NgIf,
  ],
  providers: [
    provideNgtObject(NgtSobaCubicBezierLine),
    provideObjectRef(NgtSobaCubicBezierLine),
    provideObjectHostRef(NgtSobaCubicBezierLine),
  ],
})
export class NgtSobaCubicBezierLine extends NgtSobaLine {
  override isWrapper = true;
  override shouldPassThroughRef = true;

  @Input() set start(start: THREE.Vector3 | NgtTriple) {
    this.set({ start });
  }

  @Input() set end(end: THREE.Vector3 | NgtTriple) {
    this.set({ end });
  }

  @Input() set midA(midA: THREE.Vector3 | NgtTriple) {
    this.set({ midA });
  }

  @Input() set midB(midB: THREE.Vector3 | NgtTriple) {
    this.set({ midB });
  }

  @Input() set segments(segments: NumberInput) {
    this.set({ segments: coerceNumberProperty(segments) });
  }

  readonly cubicBezierPoints$: Observable<
    ReturnType<THREE.CubicBezierCurve3['getPoints']>
  > = this.select(
    this.select((s) => s['start']),
    this.select((s) => s['end']),
    this.select((s) => s['midA']),
    this.select((s) => s['midB']),
    this.select((s) => s['segments']),
    (start, end, midA, midB, segments) => {
      const startV = is.vector3(start) ? start : make(THREE.Vector3, start);
      const endV = is.vector3(end) ? end : make(THREE.Vector3, end);
      const midAV = is.vector3(midA) ? midA : make(THREE.Vector3, midA);
      const midBV = is.vector3(midB) ? midB : make(THREE.Vector3, midB);

      return new THREE.CubicBezierCurve3(startV, midAV, midBV, endV).getPoints(
        segments
      );
    },
    { debounce: true }
  );

  override preInit() {
    super.preInit();
    this.set((s) => ({
      segments: s['segments'] ?? 20,
    }));
  }
}

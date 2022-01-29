import {
  EnhancedRxState,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtVector3,
} from '@angular-three/core';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import * as THREE from 'three';
import { Line2 } from 'three-stdlib';
import {
  NGT_SOBA_LINE_INPUTS_CONTROLLER_PROVIDER,
  NGT_SOBA_LINE_INPUTS_WATCHED_CONTROLLER,
  NgtSobaLineInputsController,
  NgtSobaLineModule,
} from '../line/line.component';

export interface NgtSobaQuadraticBezierLineState {
  start: NgtVector3;
  end: NgtVector3;
  segments: number;
  points: NgtVector3[];
  curve: THREE.QuadraticBezierCurve3;
  mid: NgtVector3 | null;
}

@Component({
  selector: 'ngt-soba-quadratic-bezier-line[start][end]',
  template: `
    <ngt-soba-line
      *ngIf="points"
      (ready)="onLineReady($any($event))"
      [points]="points"
      [sobaLineInputsController]="sobaLineInputsController"
      [object3dInputsController]="objectInputsController"
    ></ngt-soba-line>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_SOBA_LINE_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  ],
})
export class NgtSobaQuadraticBezierLine extends EnhancedRxState<NgtSobaQuadraticBezierLineState> {
  @Input() set start(start: NgtVector3) {
    this.set({ start });
  }

  @Input() set end(end: NgtVector3) {
    this.set({ end });
  }

  @Input() set mid(mid: NgtVector3) {
    this.set({ mid });
  }

  @Input() set segments(segments: number) {
    this.set({ segments });
  }

  v = new THREE.Vector3();

  get points() {
    return this.get('points');
  }

  constructor(
    @Inject(NGT_SOBA_LINE_INPUTS_WATCHED_CONTROLLER)
    public sobaLineInputsController: NgtSobaLineInputsController,
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController
  ) {
    super();
    this.set({
      start: [0, 0, 0],
      end: [0, 0, 0],
      segments: 20,
      mid: null,
      curve: new THREE.QuadraticBezierCurve3(
        undefined as any,
        undefined as any,
        undefined as any
      ),
    });

    this.connect(
      'points',
      this.select(selectSlice(['start', 'end', 'mid', 'segments'])),
      (_, { segments, mid, end, start }) =>
        this.#getPoints(start, end, mid, segments)
    );
  }

  #getPoints(
    start: NgtVector3,
    end: NgtVector3,
    mid: NgtVector3 | null,
    segments = 20
  ) {
    const curve = this.get('curve');
    if (start instanceof THREE.Vector3) curve.v0.copy(start);
    else curve.v0.set(...(start as [number, number, number]));
    if (end instanceof THREE.Vector3) curve.v2.copy(end);
    else curve.v2.set(...(end as [number, number, number]));
    if (mid instanceof THREE.Vector3) {
      curve.v1.copy(mid);
    } else {
      curve.v1.copy(
        curve.v0
          .clone()
          .add(curve.v2.clone().sub(curve.v0))
          .add(this.v.set(0, curve.v0.y - curve.v2.y, 0))
      );
    }
    return curve.getPoints(segments);
  }

  onLineReady(
    line: Line2 & {
      setPoints: (start: NgtVector3, end: NgtVector3, mid: NgtVector3) => void;
    }
  ) {
    line.setPoints = (start, end, mid) => {
      const points = this.#getPoints(start, end, mid);
      if (line.geometry) {
        // @ts-ignore
        line.geometry.setPositions(points.map((p) => p.toArray()).flat());
      }
    };
  }
}

@NgModule({
  declarations: [NgtSobaQuadraticBezierLine],
  exports: [
    NgtSobaQuadraticBezierLine,
    NgtSobaLineModule,
    NgtObject3dInputsControllerModule,
  ],
  imports: [NgtSobaLineModule, CommonModule],
})
export class NgtSobaQuadraticBezierLineModule {}

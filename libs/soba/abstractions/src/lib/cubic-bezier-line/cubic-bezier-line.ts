import {
  coerceNumberProperty,
  is,
  makeVector3,
  NgtObjectPassThrough,
  NgtTriple,
  NumberInput,
  provideObjectHostRef,
} from '@angular-three/core';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';
import { NgtSobaLine, NgtSobaLineContent } from '../line/line';

@Component({
  selector: 'ngt-soba-cubic-bezier-line[start][end][midA][midB]',
  standalone: true,
  template: `
    <ngt-soba-line
      *ngIf="cubicLineViewModel$ | async as cubicLineViewModel"
      (beforeRender)="beforeRender.emit($event)"
      [points]="cubicLineViewModel.points"
      [vertexColors]="cubicLineViewModel.vertexColors"
      [resolution]="cubicLineViewModel.resolution"
      [dashed]="cubicLineViewModel.dashed"
      [color]="cubicLineViewModel.color"
      [lineWidth]="cubicLineViewModel.lineWidth"
      [ngtObjectOutputs]="this"
      [ngtObjectInputs]="this"
    >
      <ng-container *ngIf="content">
        <ng-template ngt-soba-line-content let-line="line">
          <ng-container [ngTemplateOutlet]="content.templateRef" [ngTemplateOutletContext]="{line}"></ng-container>
        </ng-template>
      </ng-container>
    </ngt-soba-line>
  `,
  imports: [NgtSobaLine, NgtObjectPassThrough, NgtSobaLineContent, NgTemplateOutlet, NgIf, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(NgtSobaCubicBezierLine)],
})
export class NgtSobaCubicBezierLine extends NgtSobaLine {
  static ngAcceptInputType_points: never;

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

  override shouldPassThroughRef = false;

  readonly cubicBezierPoints$ = this.select(
    this.select((s) => s['start']),
    this.select((s) => s['end']),
    this.select((s) => s['midA']),
    this.select((s) => s['midB']),
    this.select((s) => s['segments']),
    (start, end, midA, midB, segments) => {
      const startV = is.vector3(start) ? start : makeVector3(start);
      const endV = is.vector3(end) ? end : makeVector3(end);
      const midAV = is.vector3(midA) ? midA : makeVector3(midA);
      const midBV = is.vector3(midB) ? midB : makeVector3(midB);

      return new THREE.CubicBezierCurve3(startV, midAV, midBV, endV).getPoints(segments);
    }
  );

  readonly cubicLineViewModel$ = this.select(
    this.cubicBezierPoints$,
    this.select((s) => s.vertexColors),
    this.select((s) => s.resolution),
    this.select((s) => s.dashed),
    this.select((s) => s.color),
    this.select((s) => s.lineWidth),
    (points, vertexColors, resolution, dashed, color, lineWidth) => ({
      points,
      vertexColors,
      resolution,
      dashed,
      color,
      lineWidth,
    })
  );

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      segments: state['segments'] ?? 20,
    }));
  }
}

@NgModule({
  imports: [NgtSobaCubicBezierLine],
  exports: [NgtSobaCubicBezierLine],
})
export class NgtSobaCubicBezierLineModule {}

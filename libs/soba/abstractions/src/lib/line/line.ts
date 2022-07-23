import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  make,
  NgtObjectPassThrough,
  NgtObjectProps,
  NgtObjectPropsState,
  NgtRenderState,
  NgtTriple,
  NgtVector2,
  NumberInput,
  provideObjectHostRef,
  Ref,
  tapEffect,
} from '@angular-three/core';
import { NgtPrimitive } from '@angular-three/core/primitive';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  NgModule,
  Output,
  TemplateRef,
} from '@angular/core';
import { animationFrameScheduler, observeOn, pipe, tap } from 'rxjs';
import * as THREE from 'three';
import { Line2 } from 'three-stdlib';
import { NgtSobaLineGeometry } from './line-geometry';
import { NgtSobaLineMaterial } from './line-material';

export interface NgtSobaCommonLineState extends NgtObjectPropsState<Line2> {
  points: Array<THREE.Vector3 | NgtTriple>;
  vertexColors: Array<THREE.Color | NgtTriple>;
  dashed: boolean;
  resolution: NgtVector2;
  lineWidth?: number;
}

@Directive()
export abstract class NgtSobaCommonLine extends NgtObjectProps<Line2, NgtSobaCommonLineState> {
  @Input() set points(points: Array<THREE.Vector3 | NgtTriple>) {
    this.set({ points });
  }

  @Input() set vertexColors(vertexColors: Array<THREE.Color | NgtTriple>) {
    this.set({ vertexColors });
  }

  @Input() set dashed(dashed: BooleanInput) {
    this.set({ dashed: coerceBooleanProperty(dashed) });
  }

  @Input() set lineWidth(lineWidth: NumberInput) {
    this.set({ lineWidth: coerceNumberProperty(lineWidth) });
  }

  @Input() set resolution(resolution: NgtVector2) {
    this.set({ resolution });
  }

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      points: state.points ?? [],
      vertexColors: state.vertexColors ?? [],
      dashed: state.dashed ?? false,
      color: state.color ?? make(THREE.Color, 'black'),
      resolution: state.resolution ?? make(THREE.Vector2, [512, 512]),
    }));
  }
}

@Directive({
  selector: 'ng-template[ngt-soba-line-content]',
  standalone: true,
})
export class NgtSobaLineContent {
  constructor(public templateRef: TemplateRef<{ line: Ref<Line2> }>) {}

  static ngTemplateContextGuard(dir: NgtSobaLineContent, ctx: any): ctx is { line: Ref<Line2> } {
    return true;
  }
}

@Component({
  selector: 'ngt-soba-line',
  standalone: true,
  template: `
    <ngt-primitive
      *ngIf="lineViewModel$ | async as lineViewModel"
      (beforeRender)="beforeRender.emit($any($event))"
      [object]="lineViewModel.line"
      [ngtObjectPassThrough]="this"
    >
      <ngt-soba-line-geometry
        [points]="lineViewModel.points"
        [vertexColors]="lineViewModel.vertexColors"
      ></ngt-soba-line-geometry>
      <ngt-soba-line-material
        [color]="lineViewModel.color"
        [resolution]="lineViewModel.resolution"
        [vertexColors]="lineViewModel.hasVertexColors"
        [linewidth]="lineViewModel.lineWidth"
        [dashed]="lineViewModel.dashed"
      ></ngt-soba-line-material>
      <ng-container
        *ngIf="content"
        [ngTemplateOutlet]="content.templateRef"
        [ngTemplateOutletContext]="{ line: instance }"
      ></ng-container>
    </ngt-primitive>
  `,
  imports: [
    NgtPrimitive,
    NgtObjectPassThrough,
    NgtSobaLineGeometry,
    NgtSobaLineMaterial,
    NgIf,
    AsyncPipe,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(NgtSobaLine)],
})
export class NgtSobaLine extends NgtSobaCommonLine {
  @Output() beforeRender = new EventEmitter<{
    state: NgtRenderState;
    object: Line2;
  }>();

  @ContentChild(NgtSobaLineContent) content?: NgtSobaLineContent;

  readonly lineViewModel$ = this.select(
    this.instance,
    this.select((s) => s.points),
    this.select((s) => s.vertexColors),
    this.select((s) => s.resolution),
    this.select((s) => s.dashed),
    this.select((s) => s.color),
    this.select((s) => s.lineWidth),
    (line, points, vertexColors, resolution, dashed, color, lineWidth) => ({
      line,
      points,
      vertexColors,
      hasVertexColors: vertexColors.length > 0,
      resolution,
      dashed,
      color,
      lineWidth,
    })
  );

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        if (this.shouldPassThroughRef) {
          this.init();
          this.computeLineDistances(this.computeLineDistancesParams$);
        }
      });
    });
  }

  private readonly init = this.effect<void>(
    tapEffect(() => {
      const line = this.prepareInstance(new Line2());
      return () => {
        line.clear();
      };
    })
  );

  private readonly computeLineDistancesParams$ = this.select(
    this.instance,
    this.select((s) => s.points)
  );
  private readonly computeLineDistances = this.effect(
    pipe(
      observeOn(animationFrameScheduler),
      tap(() => {
        const line = this.get((s) => s.instance);
        line.value.computeLineDistances();
      })
    )
  );
}

@NgModule({
  imports: [NgtSobaLine, NgtSobaLineContent],
  exports: [NgtSobaLine, NgtSobaLineContent],
})
export class NgtSobaLineModule {}

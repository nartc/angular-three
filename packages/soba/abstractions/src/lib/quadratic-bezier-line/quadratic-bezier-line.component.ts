import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtAnimationReady,
  NgtColor,
  NgtCoreModule,
  NgtObject3dController,
  NgtVector3,
} from '@angular-three/core';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterialParameters } from 'three/examples/jsm/lines/LineMaterial';
import { NgtSobaLineModule } from '../line/line.component';

@Component({
  selector: 'ngt-soba-quadratic-bezier-line[start][end]',
  template: `
    <ngt-soba-line
      [points]="points"
      [controller]="object3dController"
      [vertexColors]="vertexColors"
      [color]="color"
      [lineWidth]="lineWidth"
      [dashed]="dashed"
      [materialParameters]="materialParameters"
      (ready)="ready.emit($event)"
      (animateReady)="animateReady.emit($event)"
    ></ngt-soba-line>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_3D_CONTROLLER_PROVIDER],
})
export class NgtSobaQuadraticBezierLine implements OnChanges, OnInit {
  @Input() start!: NgtVector3;
  @Input() end!: NgtVector3;
  @Input() mid?: NgtVector3;
  @Input() segments?: number = 20;

  @Input() vertexColors?: Array<NgtColor>;

  @Input() color: NgtColor = 'black';
  @Input() lineWidth?: LineMaterialParameters['linewidth'];
  @Input() dashed?: LineMaterialParameters['dashed'];

  @Input() materialParameters?: Omit<
    LineMaterialParameters,
    'vertexColors' | 'color' | 'linewidth' | 'dashed' | 'resolution'
  > = {};

  @Output() ready = new EventEmitter<Line2>();
  @Output() animateReady = new EventEmitter<NgtAnimationReady<Line2>>();

  parameters!: LineMaterialParameters;
  points!: Array<NgtVector3>;

  constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController,
    private ngZone: NgZone
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.ngZone.runOutsideAngular(() => {
      this.parameters = {
        color: this.color as number,
        linewidth: this.lineWidth,
        dashed: this.dashed,
        vertexColors: Boolean(this.vertexColors),
        ...this.materialParameters,
      };

      if (changes.start || changes.end || changes.mid || changes.segments) {
        this.buildPoints();
      }
    });
  }

  ngOnInit() {
    if (!this.points) {
      this.buildPoints();
    }
  }

  private buildPoints() {
    const startV =
      this.start instanceof THREE.Vector3
        ? this.start
        : new THREE.Vector3(...(this.start as number[]));
    const endV =
      this.end instanceof THREE.Vector3
        ? this.end
        : new THREE.Vector3(...(this.end as number[]));
    const mid2 =
      this.mid ||
      startV
        .clone()
        .add(endV.clone().sub(startV))
        .add(new THREE.Vector3(0, startV.y - endV.y, 0));
    const midV =
      mid2 instanceof THREE.Vector3
        ? mid2
        : new THREE.Vector3(...(mid2 as number[]));
    this.points = new THREE.QuadraticBezierCurve3(startV, midV, endV).getPoints(
      this.segments
    );
  }
}

@NgModule({
  declarations: [NgtSobaQuadraticBezierLine],
  exports: [NgtSobaQuadraticBezierLine],
  imports: [NgtCoreModule, NgtSobaLineModule],
})
export class NgtSobaQuadraticBezierLineModule {}

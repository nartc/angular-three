import {
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtCoreModule,
  NgtObject3dController,
  NgtVector3,
} from '@angular-three/core';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as THREE from 'three';
import { NGT_SOBA_LINE_CONTROLLER_PROVIDER } from '../line/line-watched-controller.di';
import { NgtSobaLineModule } from '../line/line.component';
import { NgtSobaLineController } from '../line/line.controller';

@Component({
  selector: 'ngt-soba-quadratic-bezier-line[start][end]',
  exportAs: 'ngtSobaQuadraticBezierLine',
  template: `
    <ngt-soba-line
      [points]="points"
      [controller]="object3dController"
      [sobaLineController]="sobaLineController"
    ></ngt-soba-line>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_SOBA_LINE_CONTROLLER_PROVIDER],
})
export class NgtSobaQuadraticBezierLine implements OnChanges, OnInit {
  @Input() start!: NgtVector3;
  @Input() end!: NgtVector3;
  @Input() mid?: NgtVector3;
  @Input() segments?: number = 20;

  points!: Array<NgtVector3>;

  constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController,
    @Inject(NGT_SOBA_LINE_CONTROLLER_PROVIDER)
    public sobaLineController: NgtSobaLineController,
    private ngZone: NgZone
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.ngZone.runOutsideAngular(() => {
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

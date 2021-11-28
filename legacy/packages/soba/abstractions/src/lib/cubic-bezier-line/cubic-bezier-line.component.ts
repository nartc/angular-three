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
import {
  NGT_SOBA_LINE_CONTROLLER_PROVIDER,
  NGT_SOBA_LINE_WATCHED_CONTROLLER,
} from '../line/line-watched-controller.di';
import { NgtSobaLineModule } from '../line/line.component';
import { NgtSobaLineController } from '../line/line.controller';

@Component({
  selector: 'ngt-soba-cubic-bezier-line[start][end][midA][midB]',
  exportAs: 'ngtSobaCubicBezierLine',
  template: `
    <ngt-soba-line
      [points]="points"
      [object3dController]="object3dController"
      [sobaLineController]="sobaLineController"
    ></ngt-soba-line>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_SOBA_LINE_CONTROLLER_PROVIDER],
})
export class NgtSobaCubicBezierLine implements OnInit, OnChanges {
  @Input() start!: NgtVector3;
  @Input() end!: NgtVector3;
  @Input() midA!: NgtVector3;
  @Input() midB!: NgtVector3;
  @Input() segments?: number = 20;

  points!: Array<NgtVector3>;

  constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController,
    @Inject(NGT_SOBA_LINE_WATCHED_CONTROLLER)
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
    const midAV =
      this.midA instanceof THREE.Vector3
        ? this.midA
        : new THREE.Vector3(...(this.midA as number[]));
    const midBV =
      this.midB instanceof THREE.Vector3
        ? this.midB
        : new THREE.Vector3(...(this.midB as number[]));
    this.points = new THREE.CubicBezierCurve3(
      startV,
      midAV,
      midBV,
      endV
    ).getPoints(this.segments);
  }
}

@NgModule({
  declarations: [NgtSobaCubicBezierLine],
  exports: [NgtSobaCubicBezierLine],
  imports: [NgtCoreModule, NgtSobaLineModule],
})
export class NgtSobaCubicBezierLineModule {}

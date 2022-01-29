import {
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
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
  NGT_SOBA_LINE_INPUTS_CONTROLLER_PROVIDER,
  NGT_SOBA_LINE_INPUTS_WATCHED_CONTROLLER,
  NgtSobaLineInputsController,
  NgtSobaLineModule,
} from '../line/line.component';

@Component({
  selector: 'ngt-soba-cubic-bezier-line',
  template: `
    <ngt-soba-line
      [points]="points"
      [object3dInputsController]="objectInputsController"
      [sobaLineInputsController]="sobaLineInputsController"
    ></ngt-soba-line>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_SOBA_LINE_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  ],
})
export class NgtSobaCubicBezierLine implements OnInit, OnChanges {
  @Input() start!: NgtVector3;
  @Input() end!: NgtVector3;
  @Input() midA!: NgtVector3;
  @Input() midB!: NgtVector3;
  @Input() segments?: number = 20;

  points!: Array<NgtVector3>;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    @Inject(NGT_SOBA_LINE_INPUTS_WATCHED_CONTROLLER)
    public sobaLineInputsController: NgtSobaLineInputsController,
    private ngZone: NgZone
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.start || changes.end || changes.mid || changes.segments) {
      this.buildPoints();
    }
  }

  ngOnInit() {
    if (!this.points) {
      this.buildPoints();
    }
  }

  private buildPoints() {
    this.ngZone.runOutsideAngular(() => {
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
      this.ngZone.run(() => {
        this.points = new THREE.CubicBezierCurve3(
          startV,
          midAV,
          midBV,
          endV
        ).getPoints(this.segments);
      });
    });
  }
}

@NgModule({
  declarations: [NgtSobaCubicBezierLine],
  exports: [
    NgtSobaCubicBezierLine,
    NgtSobaLineModule,
    NgtObject3dInputsControllerModule,
  ],
  imports: [NgtSobaLineModule],
})
export class NgtSobaCubicBezierLineModule {}

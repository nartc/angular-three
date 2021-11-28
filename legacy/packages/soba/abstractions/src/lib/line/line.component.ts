import {
  DestroyedService,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtCoreModule,
  NgtObject3dController,
  NgtVector3,
} from '@angular-three/core';
import { NgtLineGeometryModule } from '@angular-three/core/geometries';
import { NgtLineMaterialModule } from '@angular-three/core/materials';
import { NgtLine2Module } from '@angular-three/core/meshes';
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
import { merge, ReplaySubject, takeUntil } from 'rxjs';
import * as THREE from 'three';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import {
  NGT_SOBA_LINE_CONTROLLER_PROVIDER,
  NGT_SOBA_LINE_WATCHED_CONTROLLER,
} from './line-watched-controller.di';
import { NgtSobaLineController } from './line.controller';

@Component({
  selector: 'ngt-soba-line[points]',
  exportAs: 'ngtSobaLine',
  template: `
    <ngt-line2
      (ready)="sobaLineController.onLineReady($event)"
      (animateReady)="sobaLineController.animateReady.emit($event)"
      [object3dController]="object3dController"
    >
      <ngt-line-geometry (ready)="onGeometryReady($event)"></ngt-line-geometry>
      <ngt-line-material
        (ready)="sobaLineController.onMaterialReady($event)"
        [parameters]="sobaLineController.parameters"
      ></ngt-line-material>
    </ngt-line2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_SOBA_LINE_CONTROLLER_PROVIDER],
})
export class NgtSobaLine implements OnChanges, OnInit {
  @Input() points!: Array<NgtVector3>;

  resolution = new THREE.Vector2(512, 512);

  private pointsChange$ = new ReplaySubject<SimpleChanges>(1);

  constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController,
    @Inject(NGT_SOBA_LINE_WATCHED_CONTROLLER)
    public sobaLineController: NgtSobaLineController,
    private ngZone: NgZone,
    private destroyed: DestroyedService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.ngZone.runOutsideAngular(() => {
      this.sobaLineController.mergeParameters({ resolution: this.resolution });

      if (changes.points) {
        this.pointsChange$.next(changes);
      }
    });
  }

  ngOnInit() {
    merge(this.pointsChange$, this.sobaLineController.change$)
      .pipe(takeUntil(this.destroyed))
      .subscribe((changes) => {
        if (changes.point || changes.vertexColors) {
          if (this.sobaLineController.geometry) {
            this.setupGeometry();
          }
        }
      });
  }

  onGeometryReady(geometry: LineGeometry) {
    this.ngZone.runOutsideAngular(() => {
      this.sobaLineController.geometry = geometry;
      this.setupGeometry();
    });
  }

  private setupGeometry() {
    const pointValues = this.points.map((p) =>
      p instanceof THREE.Vector3 ? p.toArray() : p
    );
    this.sobaLineController.geometry.setPositions((pointValues as any).flat());

    if (this.sobaLineController.vertexColors) {
      const colorValues = this.sobaLineController.vertexColors.map((c) =>
        c instanceof THREE.Color ? c.toArray() : c
      );
      this.sobaLineController.geometry.setColors((colorValues as any).flat());
    }
  }
}

@NgModule({
  declarations: [NgtSobaLine, NgtSobaLineController],
  exports: [NgtSobaLine, NgtSobaLineController],
  imports: [
    NgtCoreModule,
    NgtLine2Module,
    NgtLineGeometryModule,
    NgtLineMaterialModule,
  ],
})
export class NgtSobaLineModule {}

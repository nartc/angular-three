import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtAnimationReady,
  NgtColor,
  NgtCoreModule,
  NgtObject3dController,
} from '@angular-three/core';
import { NgtLineGeometryModule } from '@angular-three/core/geometries';
import { NgtLineMaterialModule } from '@angular-three/core/materials';
import { NgtLine2Module } from '@angular-three/core/meshes';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import {
  LineMaterial,
  LineMaterialParameters,
} from 'three/examples/jsm/lines/LineMaterial';

@Component({
  selector: 'ngt-soba-line[points]',
  exportAs: 'ngtSobaLine',
  template: `
    <ngt-line2
      (ready)="onLineReady($event)"
      (animateReady)="animateReady.emit($event)"
      [controller]="object3dController"
    >
      <ngt-line-geometry (ready)="onGeometryReady($event)"></ngt-line-geometry>
      <ngt-line-material
        (ready)="onMaterialReady($event)"
        [parameters]="parameters"
      ></ngt-line-material>
    </ngt-line2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_3D_CONTROLLER_PROVIDER],
})
export class NgtSobaLine implements OnChanges {
  @Input() points!: Array<THREE.Vector3 | [number, number, number]>;
  @Input() vertexColors?: Array<THREE.Color | [number, number, number]>;

  @Input() color: NgtColor = 'black';
  @Input() lineWidth?: LineMaterialParameters['linewidth'];
  @Input() dashed?: LineMaterialParameters['dashed'];

  @Input() materialParameters?: Omit<
    LineMaterialParameters,
    'vertexColors' | 'color' | 'linewidth' | 'dashed' | 'resolution'
  > = {};

  @Output() ready = new EventEmitter<Line2>();
  @Output() animateReady = new EventEmitter<NgtAnimationReady<Line2>>();

  resolution = new THREE.Vector2(512, 512);
  parameters!: LineMaterialParameters;
  line!: Line2;
  geometry!: LineGeometry;
  material!: LineMaterial;

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
        resolution: this.resolution,
        ...this.materialParameters,
      };

      if (changes.points || changes.vertexColors) {
        if (this.geometry) {
          this.setupGeometry();
        }

        if (this.line) {
          this.line.computeLineDistances();
        }
      }

      if (changes.dashed) {
        if (this.material) {
          this.dasherize();
        }
      }
    });
  }

  onGeometryReady(geometry: LineGeometry) {
    this.ngZone.runOutsideAngular(() => {
      this.geometry = geometry;
      this.setupGeometry();
    });
  }

  onLineReady(line: Line2) {
    this.ngZone.runOutsideAngular(() => {
      this.line = line;
      this.line.computeLineDistances();
      this.ngZone.run(() => {
        this.ready.emit(line);
      });
    });
  }

  onMaterialReady(material: LineMaterial) {
    this.ngZone.runOutsideAngular(() => {
      this.material = material;
      this.dasherize();
    });
  }

  private dasherize() {
    if (this.dashed) {
      this.material.defines.USE_DASH = '';
    } else {
      delete this.material.defines.USE_DASH;
    }
  }

  private setupGeometry() {
    const pointValues = this.points.map((p) =>
      p instanceof THREE.Vector3 ? p.toArray() : p
    );
    this.geometry.setPositions((pointValues as any).flat());

    if (this.vertexColors) {
      const colorValues = this.vertexColors.map((c) =>
        c instanceof THREE.Color ? c.toArray() : c
      );
      this.geometry.setColors((colorValues as any).flat());
    }
  }
}

@NgModule({
  declarations: [NgtSobaLine],
  exports: [NgtSobaLine],
  imports: [
    NgtCoreModule,
    NgtLine2Module,
    NgtLineGeometryModule,
    NgtLineMaterialModule,
  ],
})
export class NgtSobaLineModule {}

import { Controller, NgtAnimationReady, NgtColor } from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import {
  LineMaterial,
  LineMaterialParameters,
} from 'three/examples/jsm/lines/LineMaterial';

@Directive({
  selector:
    'ngt-soba-line,ngt-soba-quadratic-bezier-line,ngt-soba-cubic-bezier-line',
  exportAs: 'ngtSobaLineController',
})
export class NgtSobaLineController extends Controller implements OnInit {
  @Input() vertexColors?: Array<NgtColor>;

  @Input() color: NgtColor = 'black';
  @Input() lineWidth?: LineMaterialParameters['linewidth'];
  @Input() dashed?: LineMaterialParameters['dashed'];

  @Input() materialParameters?: Omit<
    LineMaterialParameters,
    'vertexColors' | 'color' | 'linewidth' | 'dashed' | 'resolution'
  > = {};

  @Input() sobaLineController?: NgtSobaLineController;

  @Output() ready = new EventEmitter<Line2>();
  @Output() animateReady = new EventEmitter<NgtAnimationReady<Line2>>();

  parameters!: LineMaterialParameters;
  line!: Line2;
  geometry!: LineGeometry;
  material!: LineMaterial;

  constructor(private ngZone: NgZone) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.sobaLineController) {
      this.sobaLineController.ngOnChanges(changes);
    } else {
      super.ngOnChanges(changes);
    }
    this.ngZone.runOutsideAngular(() => {
      this.parameters = {
        color: this.color as number,
        linewidth: this.lineWidth,
        dashed: this.dashed,
        vertexColors: Boolean(this.vertexColors),
        ...this.materialParameters,
      };

      if (changes.vertexColors) {
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

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.sobaLineController) {
        this.vertexColors = this.sobaLineController.vertexColors;
        this.color = this.sobaLineController.color;
        this.lineWidth = this.sobaLineController.lineWidth;
        this.dashed = this.sobaLineController.dashed;
        this.materialParameters = this.sobaLineController.materialParameters;
        this.parameters = this.sobaLineController.parameters;
        this.line = this.sobaLineController.line;
        this.material = this.sobaLineController.material;
        this.geometry = this.sobaLineController.geometry;

        this.ready = this.sobaLineController.ready;
        this.animateReady = this.sobaLineController.animateReady;
      }
    });
  }

  mergeParameters(extra: Record<string, unknown> = {}) {
    this.parameters = Object.assign(this.parameters || {}, extra);
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
}

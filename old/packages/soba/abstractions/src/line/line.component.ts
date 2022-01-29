import {
  Controller,
  createControllerProviderFactory,
  EnhancedRxState,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtColor,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtVector3,
} from '@angular-three/core';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Inject,
  Input,
  NgModule,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, distinctUntilChanged, map, startWith } from 'rxjs';
import * as THREE from 'three';
import {
  Line2,
  LineGeometry,
  LineMaterial,
  LineMaterialParameters,
} from 'three-stdlib';

@Directive({
  selector:
    'ngt-soba-line,ngt-soba-quadratic-bezier-line,ngt-soba-cubic-bezier-line',
  exportAs: 'ngtSobaLineInputsController',
})
export class NgtSobaLineInputsController extends Controller {
  @Input() color: NgtColor = 'black';
  @Input() vertexColors?: Array<NgtColor>;
  @Input() lineWidth?: LineMaterialParameters['linewidth'];
  @Input() dashed?: LineMaterialParameters['dashed'];
  @Input() parameters?: Omit<
    LineMaterialParameters,
    'vertexColors' | 'color' | 'linewidth' | 'dashed' | 'resolution'
  > = {};

  @Input() sobaLineInputsController?: NgtSobaLineInputsController;

  get controller(): Controller | undefined {
    return this.sobaLineInputsController;
  }

  get props(): string[] {
    return ['color', 'vertexColors', 'lineWidth', 'dashed', 'parameters'];
  }
}

export const [
  NGT_SOBA_LINE_INPUTS_WATCHED_CONTROLLER,
  NGT_SOBA_LINE_INPUTS_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
  watchedControllerTokenName: 'Watched SobaLine Inputs Controller',
  controller: NgtSobaLineInputsController,
});

export interface NgtSobaLineState {
  points: NgtVector3[];
  line: Line2;
  lineMaterial: LineMaterial;
  lineGeometry: LineGeometry;
}

@Component({
  selector: 'ngt-soba-line[points]',
  template: `
    <ngt-primitive
      [object]="line"
      [object3dInputsController]="objectInputsController"
    ></ngt-primitive>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_SOBA_LINE_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  ],
})
export class NgtSobaLine
  extends EnhancedRxState<NgtSobaLineState>
  implements OnInit
{
  @Input() set points(points: NgtVector3[]) {
    this.set({ points });
  }

  #resolution = new THREE.Vector2(512, 512);
  #sobaLineInputsController!: NgtSobaLineInputsController;

  @Output() ready = this.select('line');

  constructor(
    @Inject(NGT_SOBA_LINE_INPUTS_WATCHED_CONTROLLER)
    private sobaLineInputsController: NgtSobaLineInputsController,
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    private ngZone: NgZone
  ) {
    super();
  }

  ngOnInit() {
    this.#sobaLineInputsController =
      this.sobaLineInputsController.sobaLineInputsController ||
      this.sobaLineInputsController;

    this.set({
      lineMaterial: new LineMaterial(),
    });

    const geometryChanges$ = combineLatest([
      this.select('points'),
      this.#sobaLineInputsController.change$.pipe(
        map(() => this.#sobaLineInputsController.vertexColors),
        distinctUntilChanged(),
        startWith(undefined)
      ),
    ]);

    const materialChanges$ = combineLatest([
      this.select('lineMaterial'),
      this.#sobaLineInputsController.change$.pipe(
        map((changes) => {
          return {
            color: (changes.sobaLineInputsController
              ? changes.sobaLineInputsController.currentValue
              : this.#sobaLineInputsController
            ).color,
            vertexColors: Boolean(
              (changes.sobaLineInputsController
                ? changes.sobaLineInputsController.currentValue
                : this.#sobaLineInputsController
              ).vertexColors
            ),
            linewidth: (changes.sobaLineInputsController
              ? changes.sobaLineInputsController.currentValue
              : this.#sobaLineInputsController
            ).lineWidth,
            dashed: (changes.sobaLineInputsController
              ? changes.sobaLineInputsController.currentValue
              : this.#sobaLineInputsController
            ).dashed,
            parameters: (changes.sobaLineInputsController
              ? changes.sobaLineInputsController.currentValue
              : this.#sobaLineInputsController
            ).parameters,
          };
        }),
        startWith({
          color: this.#sobaLineInputsController.color,
          vertexColors: Boolean(this.#sobaLineInputsController.vertexColors),
          linewidth: this.#sobaLineInputsController.lineWidth,
          dashed: this.#sobaLineInputsController.dashed,
          parameters: this.#sobaLineInputsController.parameters,
        })
      ),
    ]);

    this.hold(this.select(selectSlice(['line', 'points'])), ({ line }) => {
      line.computeLineDistances();
    });

    this.hold(
      materialChanges$,
      ([
        lineMaterial,
        { dashed, parameters, vertexColors, color, linewidth },
      ]) => {
        const lineParameters = {
          vertexColors,
          color,
          resolution: this.#resolution,
          ...parameters,
        } as LineMaterialParameters;

        if (dashed !== undefined) {
          lineParameters.dashed = dashed;
        }

        if (linewidth !== undefined) {
          lineParameters.linewidth = linewidth;
        }

        lineMaterial.setValues(lineParameters);

        if (dashed) {
          lineMaterial.defines.USE_DASH = '';
        } else {
          // Setting lineMaterial.defines.USE_DASH to undefined is apparently not sufficient.
          delete lineMaterial.defines.USE_DASH;
        }

        lineMaterial.needsUpdate = true;
      }
    );

    this.connect(
      'lineGeometry',
      geometryChanges$,
      (_, [points, vertexColors]) => {
        return this.ngZone.runOutsideAngular(() => {
          const lineGeometry = new LineGeometry();
          const pValues = points.map((p) =>
            p instanceof THREE.Vector3 ? p.toArray() : p
          );
          lineGeometry.setPositions((pValues as any).flat());

          if (vertexColors) {
            const cValues = (vertexColors as NgtColor[]).map((c) =>
              c instanceof THREE.Color ? c.toArray() : c
            );
            lineGeometry.setColors((cValues as any).flat());
          }

          return lineGeometry;
        });
      }
    );

    this.holdEffect(this.select('lineGeometry'), (lineGeometry) => {
      return () => {
        lineGeometry.dispose();
      };
    });

    this.holdEffect(this.select('lineMaterial'), (lineMaterial) => {
      return () => {
        lineMaterial.dispose();
      };
    });

    this.hold(
      this.select(selectSlice(['lineGeometry', 'lineMaterial'])),
      ({ lineMaterial, lineGeometry }) => {
        const line = this.get('line');
        if (!line) {
          this.set({ line: new Line2(lineGeometry, lineMaterial) });
        } else {
          line.geometry = lineGeometry;
          line.computeLineDistances();
        }
      }
    );
  }

  get line() {
    return this.get('line');
  }
}

@NgModule({
  declarations: [NgtSobaLine, NgtSobaLineInputsController],
  exports: [
    NgtSobaLine,
    NgtSobaLineInputsController,
    NgtObject3dInputsControllerModule,
  ],
  imports: [NgtPrimitiveModule],
})
export class NgtSobaLineModule {}

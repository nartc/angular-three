import {
    AnyFunction,
    Controller,
    createControllerProviderFactory,
    createHostParentObjectProvider,
    createParentObjectProvider,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NGT_PARENT_OBJECT,
    NgtCanvasStore,
    NgtColor,
    NgtObjectInputsController,
    NgtObjectInputsControllerModule,
    NgtRender,
    NgtStore,
    NgtVector3,
    startWithUndefined,
    tapEffect,
} from '@angular-three/core';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    EventEmitter,
    Inject,
    Input,
    NgModule,
    NgZone,
    OnInit,
    Optional,
    Output,
    SkipSelf,
} from '@angular/core';
import { distinctUntilChanged, map, startWith, tap } from 'rxjs';
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
            (animateReady)="
                animateReady.emit({ object: line, state: $event.state })
            "
            [name]="objectInputsController.name"
            [position]="objectInputsController.position"
            [rotation]="objectInputsController.rotation"
            [quaternion]="objectInputsController.quaternion"
            [scale]="objectInputsController.scale"
            [color]="objectInputsController.color"
            [userData]="objectInputsController.userData"
            [castShadow]="objectInputsController.castShadow"
            [receiveShadow]="objectInputsController.receiveShadow"
            [visible]="objectInputsController.visible"
            [matrixAutoUpdate]="objectInputsController.matrixAutoUpdate"
            [dispose]="objectInputsController.dispose"
            [raycast]="objectInputsController.raycast"
            [appendMode]="objectInputsController.appendMode"
            [appendTo]="objectInputsController.appendTo"
            (click)="objectInputsController.click.emit($event)"
            (contextmenu)="objectInputsController.contextmenu.emit($event)"
            (dblclick)="objectInputsController.dblclick.emit($event)"
            (pointerup)="objectInputsController.pointerup.emit($event)"
            (pointerdown)="objectInputsController.pointerdown.emit($event)"
            (pointerover)="objectInputsController.pointerover.emit($event)"
            (pointerout)="objectInputsController.pointerout.emit($event)"
            (pointerenter)="objectInputsController.pointerenter.emit($event)"
            (pointerleave)="objectInputsController.pointerleave.emit($event)"
            (pointermove)="objectInputsController.pointermove.emit($event)"
            (pointermissed)="objectInputsController.pointermissed.emit($event)"
            (pointercancel)="objectInputsController.pointercancel.emit($event)"
            (wheel)="objectInputsController.wheel.emit($event)"
        ></ngt-primitive>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_SOBA_LINE_INPUTS_CONTROLLER_PROVIDER,
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        createParentObjectProvider(NgtSobaLine, (line) => line.line),
        createHostParentObjectProvider(NgtSobaLine),
    ],
})
export class NgtSobaLine extends NgtStore<NgtSobaLineState> implements OnInit {
    @Input() set points(points: NgtVector3[]) {
        this.set({ points });
    }

    private resolution = new THREE.Vector2(512, 512);

    @Output() ready = this.select((s) => s.line);
    @Output() animateReady = new EventEmitter<{
        object: Line2;
        state: NgtRender;
    }>();

    private geometryParams$ = this.select(
        this.select((s) => s.points),
        this.sobaLineInputsController.changes$.pipe(
            map(() => this.sobaLineInputsController.vertexColors),
            distinctUntilChanged(),
            startWithUndefined()
        ),
        (points, vertexColors) => ({ points, vertexColors })
    );

    private materialParams$ = this.select(
        this.select((s) => s.lineMaterial),
        this.sobaLineInputsController.changes$.pipe(
            map(() => ({
                color: this.sobaLineInputsController.color,
                vertexColors: Boolean(
                    this.sobaLineInputsController.vertexColors
                ),
                lineWidth: this.sobaLineInputsController.lineWidth,
                dashed: this.sobaLineInputsController.dashed,
                parameters: this.sobaLineInputsController.parameters,
            })),
            startWith({
                color: this.sobaLineInputsController.color,
                vertexColors: Boolean(
                    this.sobaLineInputsController.vertexColors
                ),
                lineWidth: this.sobaLineInputsController.lineWidth,
                dashed: this.sobaLineInputsController.dashed,
                parameters: this.sobaLineInputsController.parameters,
            })
        ),
        (lineMaterial, params) => ({ lineMaterial, params })
    );

    private lineDistancesParams$ = this.select(
        this.select((s) => s.line),
        this.select((s) => s.points),
        (line) => line
    );

    constructor(
        @Inject(NGT_SOBA_LINE_INPUTS_WATCHED_CONTROLLER)
        private sobaLineInputsController: NgtSobaLineInputsController,
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController,
        private zone: NgZone,
        private canvasStore: NgtCanvasStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_PARENT_OBJECT)
        public parentObjectFn: AnyFunction
    ) {
        super();
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.set({ lineMaterial: new LineMaterial() });
                this.set(
                    this.geometryParams$.pipe(
                        map(({ vertexColors, points }) => {
                            const lineGeometry = new LineGeometry();
                            const pValues = points.map((p) =>
                                p instanceof THREE.Vector3 ? p.toArray() : p
                            );
                            lineGeometry.setPositions((pValues as any).flat());

                            if (vertexColors) {
                                const cValues = (
                                    vertexColors as NgtColor[]
                                ).map((c) =>
                                    c instanceof THREE.Color ? c.toArray() : c
                                );
                                lineGeometry.setColors((cValues as any).flat());
                            }

                            return { lineGeometry };
                        })
                    )
                );
                this.computeLineDistances(this.lineDistancesParams$);
                this.updateLineMaterial(this.materialParams$);
                this.disposeGeometry(this.select((s) => s.lineGeometry));
                this.disposeMaterial(this.select((s) => s.lineMaterial));
                this.initLine(
                    this.select(
                        this.select((s) => s.lineGeometry),
                        this.select((s) => s.lineMaterial),
                        (geometry, material) => ({ geometry, material })
                    )
                );
            });
        });
    }

    get line() {
        return this.get((s) => s.line);
    }

    private readonly computeLineDistances = this.effect<Line2>(
        tap((line) => {
            line.computeLineDistances();
        })
    );

    private readonly updateLineMaterial = this.effect<{
        lineMaterial: LineMaterial;
        params: Pick<
            NgtSobaLineInputsController,
            'color' | 'dashed' | 'parameters' | 'lineWidth'
        > & { vertexColors: boolean | undefined };
    }>(
        tap(
            ({
                lineMaterial,
                params: { lineWidth, dashed, parameters, vertexColors, color },
            }) => {
                const lineParameters = {
                    vertexColors,
                    color,
                    resolution: this.resolution,
                    ...parameters,
                } as LineMaterialParameters;

                if (dashed !== undefined) {
                    lineParameters.dashed = dashed;
                }

                if (lineWidth !== undefined) {
                    lineParameters.linewidth = lineWidth;
                }

                lineMaterial.setValues(lineParameters);

                if (dashed) {
                    lineMaterial.defines['USE_DASH'] = '';
                } else {
                    // Setting lineMaterial.defines.USE_DASH to undefined is apparently not sufficient.
                    delete lineMaterial.defines['USE_DASH'];
                }

                lineMaterial.needsUpdate = true;
            }
        )
    );

    private readonly disposeGeometry = this.effect<LineGeometry>(
        tapEffect((lineGeometry) => {
            return () => {
                lineGeometry.dispose();
            };
        })
    );

    private readonly disposeMaterial = this.effect<LineMaterial>(
        tapEffect((lineMaterial) => {
            return () => {
                lineMaterial.dispose();
            };
        })
    );

    private readonly initLine = this.effect<{
        geometry: LineGeometry;
        material: LineMaterial;
    }>(
        tap(({ material, geometry }) => {
            const line = this.line;
            if (!line) {
                this.set({ line: new Line2(geometry, material) });
            } else {
                line.geometry = geometry;
                line.computeLineDistances();
            }
        })
    );
}

@NgModule({
    declarations: [NgtSobaLine, NgtSobaLineInputsController],
    exports: [
        NgtSobaLine,
        NgtSobaLineInputsController,
        NgtObjectInputsControllerModule,
    ],
    imports: [NgtPrimitiveModule],
})
export class NgtSobaLineModule {}

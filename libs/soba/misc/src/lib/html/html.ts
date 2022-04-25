import {
    BooleanInput,
    coerceBooleanProperty,
    coerceNumberProperty,
    is,
    NgtObjectInputs,
    NgtObjectInputsState,
    NgtObjectPassThroughModule,
    NumberInput,
    provideObjectHosRef,
    Ref,
    startWithUndefined,
    tapEffect,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    NgModule,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import type { Properties } from 'csstype';
import { Observable, tap } from 'rxjs';
import * as THREE from 'three';

const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const v3 = new THREE.Vector3();

function defaultCalculatePosition(
    el: THREE.Object3D,
    camera: THREE.Camera,
    size: { width: number; height: number }
) {
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    objectPos.project(camera);
    const widthHalf = size.width / 2;
    const heightHalf = size.height / 2;
    return [
        objectPos.x * widthHalf + widthHalf,
        -(objectPos.y * heightHalf) + heightHalf,
    ];
}

export type CalculatePosition = typeof defaultCalculatePosition;

function isObjectBehindCamera(el: THREE.Object3D, camera: THREE.Camera) {
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
    const deltaCamObj = objectPos.sub(cameraPos);
    const camDir = camera.getWorldDirection(v3);
    return deltaCamObj.angleTo(camDir) > Math.PI / 2;
}

function isObjectVisible(
    el: THREE.Object3D,
    camera: THREE.Camera,
    raycaster: THREE.Raycaster,
    occlude: THREE.Object3D[]
) {
    const elPos = v1.setFromMatrixPosition(el.matrixWorld);
    const screenPos = elPos.clone();
    screenPos.project(camera);
    raycaster.setFromCamera(screenPos, camera);
    const intersects = raycaster.intersectObjects(occlude, true);
    if (intersects.length) {
        const intersectionDistance = intersects[0].distance;
        const pointDistance = elPos.distanceTo(raycaster.ray.origin);
        return pointDistance < intersectionDistance;
    }
    return true;
}

function objectScale(el: THREE.Object3D, camera: THREE.Camera) {
    if (is.orthographic(camera)) {
        return camera.zoom;
    }

    if (is.perspective(camera)) {
        const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
        const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
        const vFOV = (camera.fov * Math.PI) / 180;
        const dist = objectPos.distanceTo(cameraPos);
        const scaleFOV = 2 * Math.tan(vFOV / 2) * dist;
        return 1 / scaleFOV;
    }

    return 1;
}

function objectZIndex(
    el: THREE.Object3D,
    camera: THREE.Camera,
    zIndexRange: Array<number>
) {
    if (is.orthographic(camera) || is.perspective(camera)) {
        const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
        const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
        const dist = objectPos.distanceTo(cameraPos);
        const A =
            (zIndexRange[1] - zIndexRange[0]) / (camera.far - camera.near);
        const B = zIndexRange[1] - A * camera.far;
        return Math.round(A * dist + B);
    }
    return undefined;
}

const epsilon = (value: number) => (Math.abs(value) < 1e-10 ? 0 : value);

function getCSSMatrix(
    matrix: THREE.Matrix4,
    multipliers: number[],
    prepend = ''
) {
    let matrix3d = 'matrix3d(';
    for (let i = 0; i !== 16; i++) {
        matrix3d +=
            epsilon(multipliers[i] * matrix.elements[i]) +
            (i !== 15 ? ',' : ')');
    }
    return prepend + matrix3d;
}

const getCameraCSSMatrix = ((multipliers: number[]) => {
    return (matrix: THREE.Matrix4) => getCSSMatrix(matrix, multipliers);
})([1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1]);

const getObjectCSSMatrix = ((scaleMultipliers: (n: number) => number[]) => {
    return (matrix: THREE.Matrix4, factor: number) =>
        getCSSMatrix(matrix, scaleMultipliers(factor), 'translate(-50%,-50%)');
})((f: number) => [
    1 / f,
    1 / f,
    1 / f,
    1,
    -1 / f,
    -1 / f,
    -1 / f,
    -1,
    1 / f,
    1 / f,
    1 / f,
    1,
    1,
    1,
    1,
    1,
]);
type PointerEventsProperties =
    | 'auto'
    | 'none'
    | 'visiblePainted'
    | 'visibleFill'
    | 'visibleStroke'
    | 'visible'
    | 'painted'
    | 'fill'
    | 'stroke'
    | 'all'
    | 'inherit';

export interface NgtSobaHtmlState extends NgtObjectInputsState<THREE.Group> {
    prepend?: boolean;
    center?: boolean;
    fullscreen?: boolean;
    eps: number;
    portal?: HTMLElement;
    distanceFactor?: number;
    sprite: boolean;
    transform: boolean;
    zIndexRange: Array<number>;
    occlude?: Ref<THREE.Object3D>[] | boolean;
    calculatePosition: CalculatePosition;
    wrapperClass?: string;
    pointerEvents: PointerEventsProperties;
    style?: Properties;
    htmlClass: string;
}

@Directive({
    selector: '[ngtSobaHtmlElement]',
})
export class NgtSobaHtmlElement {
    constructor(
        public elementRef: ElementRef<HTMLElement>,
        public viewContainerRef: ViewContainerRef
    ) {}
}

@Directive({
    selector: 'ng-template[ngt-soba-html-content]',
})
export class NgtSobaHtmlContent {
    constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
    selector: 'ngt-soba-html',
    template: `
        <ngt-group
            [ngtObjectOutputs]="this"
            [ngtObjectInputs]="this"
        ></ngt-group>

        <ng-template #transformTemplate>
            <div #transformedOuterDiv [style]="styles$ | async">
                <div
                    #transformedInnerDiv
                    [style]="transformInnerStyles$ | async"
                >
                    <ng-container
                        [ngTemplateOutlet]="renderTemplate"
                        [ngTemplateOutletContext]="{ style$ }"
                    ></ng-container>
                </div>
            </div>
        </ng-template>

        <ng-template #renderTemplate let-style$="style$">
            <div #renderedDiv [class]="htmlClass" [style]="style$ | async">
                <ng-container
                    *ngIf="content"
                    [ngTemplateOutlet]="content.templateRef"
                ></ng-container>
            </div>
        </ng-template>

        <div ngtSobaHtmlElement></div>

        <ng-content></ng-content>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideObjectHosRef(
            NgtSobaHtml,
            (html) => html.instance,
            (html) => html.parentRef
        ),
    ],
})
export class NgtSobaHtml extends NgtObjectInputs<
    THREE.Group,
    NgtSobaHtmlState
> {
    @Input() set prepend(prepend: BooleanInput) {
        this.set({ prepend: coerceBooleanProperty(prepend) });
    }

    @Input() set center(center: BooleanInput) {
        this.set({ center: coerceBooleanProperty(center) });
    }

    @Input() set fullscreen(fullscreen: BooleanInput) {
        this.set({ fullscreen: coerceBooleanProperty(fullscreen) });
    }

    @Input() set eps(eps: NumberInput) {
        this.set({ eps: coerceNumberProperty(eps) });
    }

    @Input() set portal(portal: HTMLElement) {
        this.set({ portal });
    }

    @Input() set distanceFactor(distanceFactor: NumberInput) {
        this.set({ distanceFactor: coerceNumberProperty(distanceFactor) });
    }

    @Input() set sprite(sprite: BooleanInput) {
        this.set({ sprite: coerceBooleanProperty(sprite) });
    }

    @Input() set transform(transform: BooleanInput) {
        this.set({ transform: coerceBooleanProperty(transform) });
    }

    @Input() set zIndexRange(zIndexRange: Array<number>) {
        this.set({ zIndexRange });
    }

    @Input() set occlude(occlude: Ref<THREE.Object3D>[] | BooleanInput) {
        this.set({
            occlude: is.arr(occlude) ? occlude : coerceBooleanProperty(occlude),
        });
    }

    @Output() occludeChange = new EventEmitter<boolean>();

    @Input() set calculatePosition(calculatePosition: CalculatePosition) {
        this.set({ calculatePosition });
    }

    @Input() set as(as: keyof HTMLElementTagNameMap) {
        this.set({ as });
    }

    @Input() set wrapperClass(wrapperClass: string) {
        this.set({ wrapperClass });
    }

    @Input() set pointerEvents(pointerEvents: PointerEventsProperties) {
        this.set({ pointerEvents });
    }

    @Input() set style(style: Properties) {
        this.set({ style });
    }
    get style$() {
        return this.select((s) => s.style);
    }

    @Input() set htmlClass(htmlClass: string) {
        this.set({ htmlClass });
    }
    get htmlClass() {
        return this.get((s) => s.htmlClass);
    }

    @ViewChild('renderTemplate', { static: true })
    renderTemplate!: TemplateRef<unknown>;

    @ViewChild('transformTemplate', { static: true })
    transformTemplate!: TemplateRef<unknown>;

    @ViewChild(NgtSobaHtmlElement, { static: true })
    defaultElement!: NgtSobaHtmlElement;

    @ContentChild(NgtSobaHtmlElement)
    customElement?: NgtSobaHtmlElement;

    @ContentChild(NgtSobaHtmlContent) content?: NgtSobaHtmlContent;

    @ViewChild('transformedOuterDiv')
    transformedOuterDiv?: ElementRef<HTMLDivElement>;
    @ViewChild('transformedInnerDiv')
    transformedInnerDiv?: ElementRef<HTMLDivElement>;

    private oldZoom = 0;
    private oldPosition = [0, 0];
    private isVisible = true;

    readonly styles$ = this.select(
        this.select((s) => s.style).pipe(startWithUndefined()),
        this.select((s) => s.center).pipe(startWithUndefined()),
        this.select((s) => s.fullscreen).pipe(startWithUndefined()),
        this.store.select((s) => s.size),
        this.select((s) => s.transform),
        () => {
            const { style, center, fullscreen, transform } = this.get();
            const size = this.store.get((s) => s.size);

            if (transform) {
                return {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: size.width,
                    height: size.height,
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none',
                };
            }

            return {
                position: 'absolute',
                transform: center ? 'translate3d(-50%,-50%,0)' : 'none',
                ...(fullscreen && {
                    top: -size.height / 2,
                    left: -size.width / 2,
                    width: size.width,
                    height: size.height,
                }),
                ...(style || {}),
            };
        }
    ) as Observable<Properties>;

    readonly transformInnerStyles$ = this.select(
        this.select((s) => s.pointerEvents),
        () => {
            const pointerEvents = this.get((s) => s.pointerEvents);
            return { position: 'absolute', pointerEvents };
        }
    ) as Observable<Properties>;

    get element(): NgtSobaHtmlElement {
        return this.customElement ?? this.defaultElement;
    }

    get htmlElement() {
        return this.element.elementRef.nativeElement;
    }

    get htmlViewContainerRef() {
        return this.element.viewContainerRef;
    }

    protected override preInit() {
        super.preInit();
        this.set((state) => {
            return {
                htmlClass: state.htmlClass ?? '',
                eps: state.eps ?? 0.001,
                sprite: state.sprite ?? false,
                transform: state.transform ?? false,
                zIndexRange: state.zIndexRange ?? [16777271, 0],
                calculatePosition:
                    state.calculatePosition ?? defaultCalculatePosition,
                pointerEvents: state.pointerEvents ?? 'auto',
            };
        });
    }

    override ngOnInit() {
        super.ngOnInit();
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.setTarget(
                    this.select(
                        this.select((s) => s.portal).pipe(startWithUndefined()),
                        this.store.select((s) => s.gl)
                    )
                );

                this.appendElement(
                    this.select(
                        this.select((s) => s['target']),
                        this.select((s) => s.transform),
                        this.instance$
                    )
                );

                this.setWrapperClass(
                    this.select((s) => s.wrapperClass).pipe(
                        startWithUndefined()
                    )
                );

                this.render(this.select());
                this.setBeforeRender(this.instance$);
            });
        });
    }

    private readonly setTarget = this.effect<{}>(
        tap(() => {
            const portal = this.get((s) => s.portal);
            const gl = this.store.get((s) => s.gl);
            this.set({ target: portal ?? gl.domElement.parentNode });
        })
    );

    private readonly appendElement = this.effect<{}>(
        tapEffect(() => {
            const { scene, camera, size } = this.store.get();
            const { transform, target, calculatePosition, prepend } =
                this.get();

            if (this.instance.value) {
                scene.updateMatrixWorld();
                if (transform) {
                    this.htmlElement.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;`;
                } else {
                    const vec = calculatePosition(
                        this.instance.value,
                        camera,
                        size
                    );
                    this.htmlElement.style.cssText = `position:absolute;top:0;left:0;transform:translate3d(${vec[0]}px,${vec[1]}px,0);transform-origin:0 0;`;
                }
                if (target) {
                    if (prepend) target.prepend(this.htmlElement);
                    else target.appendChild(this.htmlElement);
                }

                return () => {
                    if (target) target.removeChild(this.htmlElement);
                    this.htmlViewContainerRef.clear();
                };
            }
            return;
        })
    );

    private readonly setWrapperClass = this.effect<{}>(
        tap(() => {
            const wrapperClass = this.get((s) => s.wrapperClass);
            if (wrapperClass) {
                this.htmlElement.className = wrapperClass;
            }
        })
    );

    private readonly render = this.effect<{}>(
        tap(() => {
            const { transform, target } = this.get();

            const params: Parameters<ViewContainerRef['createEmbeddedView']> =
                transform
                    ? [this.transformTemplate, {}]
                    : [this.renderTemplate, { style$: this.styles$ }];

            if (target) {
                this.htmlViewContainerRef.clear();
                const viewRef = this.htmlViewContainerRef.createEmbeddedView(
                    ...params
                );
                if (viewRef.rootNodes[0]) {
                    this.htmlElement.append(...viewRef.rootNodes);
                }
            }
        })
    );

    private readonly setBeforeRender = this.effect<{}>(
        tapEffect(() => {
            const unregister = this.store.registerBeforeRender({
                callback: () => {
                    if (this.instance.value) {
                        const {
                            transform,
                            calculatePosition,
                            eps,
                            occlude,
                            zIndexRange,
                            sprite,
                            distanceFactor,
                        } = this.get();
                        const { camera, size, scene, raycaster } =
                            this.store.get();

                        camera.updateMatrixWorld();
                        this.instance.value.updateWorldMatrix(true, false);
                        const vec = transform
                            ? this.oldPosition
                            : calculatePosition(
                                  this.instance.value,
                                  camera,
                                  size
                              );

                        if (
                            transform ||
                            Math.abs(this.oldZoom - camera.zoom) > eps ||
                            Math.abs(this.oldPosition[0] - vec[0]) > eps ||
                            Math.abs(this.oldPosition[1] - vec[1]) > eps
                        ) {
                            const isBehindCamera = isObjectBehindCamera(
                                this.instance.value,
                                camera
                            );
                            let raytraceTarget:
                                | null
                                | undefined
                                | boolean
                                | THREE.Object3D[] = false;
                            if (typeof occlude === 'boolean') {
                                if (occlude) {
                                    raytraceTarget = [scene];
                                }
                            } else if (Array.isArray(occlude)) {
                                raytraceTarget = occlude.map(
                                    (item) => item.value
                                ) as THREE.Object3D[];
                            }

                            const previouslyVisible = this.isVisible;
                            if (raytraceTarget) {
                                this.isVisible =
                                    isObjectVisible(
                                        this.instance.value,
                                        camera,
                                        raycaster,
                                        raytraceTarget
                                    ) && !isBehindCamera;
                            } else {
                                this.isVisible = !isBehindCamera;
                            }

                            if (previouslyVisible !== this.isVisible) {
                                if (this.occludeChange.observed) {
                                    this.occludeChange.emit(!this.isVisible);
                                } else {
                                    this.htmlElement.style.display = this
                                        .isVisible
                                        ? 'block'
                                        : 'none';
                                }
                            }

                            this.htmlElement.style.zIndex = `${objectZIndex(
                                this.instance.value,
                                camera,
                                zIndexRange
                            )}`;

                            if (transform) {
                                const [widthHalf, heightHalf] = [
                                    size.width / 2,
                                    size.height / 2,
                                ];
                                const fov =
                                    camera.projectionMatrix.elements[5] *
                                    heightHalf;
                                const {
                                    isOrthographicCamera,
                                    top,
                                    left,
                                    bottom,
                                    right,
                                } = camera as THREE.OrthographicCamera;
                                const cameraMatrix = getCameraCSSMatrix(
                                    camera.matrixWorldInverse
                                );
                                const cameraTransform = isOrthographicCamera
                                    ? `scale(${fov})translate(${epsilon(
                                          -(right + left) / 2
                                      )}px,${epsilon((top + bottom) / 2)}px)`
                                    : `translateZ(${fov}px)`;
                                let matrix = this.instance.value.matrixWorld;
                                if (sprite) {
                                    matrix = camera.matrixWorldInverse
                                        .clone()
                                        .transpose()
                                        .copyPosition(matrix)
                                        .scale(this.instance.value.scale);
                                    matrix.elements[3] =
                                        matrix.elements[7] =
                                        matrix.elements[11] =
                                            0;
                                    matrix.elements[15] = 1;
                                }
                                this.htmlElement.style.width =
                                    size.width + 'px';
                                this.htmlElement.style.height =
                                    size.height + 'px';
                                this.htmlElement.style.perspective =
                                    isOrthographicCamera ? '' : `${fov}px`;
                                if (
                                    this.transformedOuterDiv?.nativeElement &&
                                    this.transformedInnerDiv?.nativeElement
                                ) {
                                    this.transformedOuterDiv.nativeElement.style.width =
                                        size.width + 'px';
                                    this.transformedOuterDiv.nativeElement.style.height =
                                        size.height + 'px';
                                    this.transformedOuterDiv!.nativeElement.style.transform = `${cameraTransform}${cameraMatrix}translate(${widthHalf}px,${heightHalf}px)`;
                                    this.transformedInnerDiv!.nativeElement.style.transform =
                                        getObjectCSSMatrix(
                                            matrix,
                                            1 / ((distanceFactor || 10) / 400)
                                        );
                                }
                            } else {
                                const scale =
                                    distanceFactor === undefined
                                        ? 1
                                        : objectScale(
                                              this.instance.value,
                                              camera
                                          ) * distanceFactor;
                                this.htmlElement.style.transform = `translate3d(${vec[0]}px,${vec[1]}px,0) scale(${scale})`;
                            }

                            this.oldPosition = vec;
                            this.oldZoom = camera.zoom;
                        }
                    }
                },
            });

            return () => {
                unregister();
            };
        })
    );
}

@NgModule({
    declarations: [NgtSobaHtml, NgtSobaHtmlElement, NgtSobaHtmlContent],
    exports: [NgtSobaHtml, NgtSobaHtmlElement, NgtSobaHtmlContent],
    imports: [CommonModule, NgtGroupModule, NgtObjectPassThroughModule],
})
export class NgtSobaHtmlModule {}

// interface NgtSobaHtmlState {
//     element: HTMLElement;
//     viewContainerRef: ViewContainerRef;
//     sprite: boolean;
//     transform: boolean;
//     zIndexRange: Array<number>;
//     calculatePosition: CalculatePosition;
//     pointerEvents: PointerEventsProperties;
//     eps: number;
//     target: HTMLElement;
//     group: THREE.Group;
//     template: TemplateRef<unknown>;
//     center: boolean;
//     prepend: boolean;
//     fullscreen: boolean;
//     parentClass?: string;
//     parentStyle?: Partial<CSSStyleDeclaration>;
//     portal?: HTMLElement;
//     distanceFactor?: number;
//     occlude?: THREE.Object3D[] | boolean;
//     wrapperClass?: string;
// }
//
// @Directive({
//     selector: '[ngtSobaHtmlElement]',
//     exportAs: 'ngtSobaHtmlElement',
// })
// export class NgtSobaHtmlElement {
//     constructor(
//         public elementRef: ElementRef<HTMLElement>,
//         public viewContainerRef: ViewContainerRef
//     ) {}
// }
//
// @Component({
//     selector: 'ngt-soba-html',
//     template: `
//         <ngt-group
//             (ready)="set({ group: $event })"
//             (animateReady)="onGroupAnimate($event.object)"
//             [name]="objectInputsController.name"
//             [position]="objectInputsController.position"
//             [rotation]="objectInputsController.rotation"
//             [quaternion]="objectInputsController.quaternion"
//             [scale]="objectInputsController.scale"
//             [color]="objectInputsController.color"
//             [userData]="objectInputsController.userData"
//             [castShadow]="objectInputsController.castShadow"
//             [receiveShadow]="objectInputsController.receiveShadow"
//             [visible]="objectInputsController.visible"
//             [matrixAutoUpdate]="objectInputsController.matrixAutoUpdate"
//             [dispose]="objectInputsController.dispose"
//             [raycast]="objectInputsController.raycast"
//             [appendMode]="objectInputsController.appendMode"
//             [appendTo]="objectInputsController.appendTo"
//             (click)="objectInputsController.click.emit($event)"
//             (contextmenu)="objectInputsController.contextmenu.emit($event)"
//             (dblclick)="objectInputsController.dblclick.emit($event)"
//             (pointerup)="objectInputsController.pointerup.emit($event)"
//             (pointerdown)="objectInputsController.pointerdown.emit($event)"
//             (pointerover)="objectInputsController.pointerover.emit($event)"
//             (pointerout)="objectInputsController.pointerout.emit($event)"
//             (pointerenter)="objectInputsController.pointerenter.emit($event)"
//             (pointerleave)="objectInputsController.pointerleave.emit($event)"
//             (pointermove)="objectInputsController.pointermove.emit($event)"
//             (pointermissed)="objectInputsController.pointermissed.emit($event)"
//             (pointercancel)="objectInputsController.pointercancel.emit($event)"
//             (wheel)="objectInputsController.wheel.emit($event)"
//         ></ngt-group>
//
//         <ng-template #transformTemplate>
//             <div #transformedOuterDiv [style]="styles$ | async">
//                 <div
//                     #transformedInnerDiv
//                     [style]="transformInnerStyle$ | async"
//                 >
//                     <ng-container
//                         *ngTemplateOutlet="renderTemplate"
//                     ></ng-container>
//                 </div>
//             </div>
//         </ng-template>
//
//         <ng-template #renderTemplate let-style>
//             <div
//                 #renderedDiv
//                 [class]="$any(parentClass$ | async)"
//                 [style]="
//                     (transform$ | async)
//                         ? (parentStyle$ | async)
//                         : (styles$ | async)
//                 "
//             >
//                 <ng-content></ng-content>
//             </div>
//         </ng-template>
//
//         <div ngtSobaHtmlElement></div>
//     `,
//     changeDetection: ChangeDetectionStrategy.OnPush,
//     providers: [NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER],
// })
// export class NgtSobaHtml extends NgtStore<NgtSobaHtmlState> implements OnInit {
//     @Input() set prepend(prepend: boolean) {
//         this.set({ prepend });
//     }
//
//     @Input() set center(center: boolean) {
//         this.set({ center });
//     }
//
//     @Input() set fullscreen(fullscreen: boolean) {
//         this.set({ fullscreen });
//     }
//
//     @Input() set eps(eps: number) {
//         this.set({ eps });
//     }
//
//     @Input() set portal(portal: HTMLElement) {
//         this.set({ portal });
//     }
//
//     @Input() set distanceFactor(distanceFactor: number) {
//         this.set({ distanceFactor });
//     }
//
//     @Input() set sprite(sprite: boolean) {
//         this.set({ sprite });
//     }
//
//     @Input() set transform(transform: boolean) {
//         this.set({ transform });
//     }
//
//     @Input() set zIndexRange(zIndexRange: Array<number>) {
//         this.set({ zIndexRange });
//     }
//
//     @Input() set occlude(occlude: THREE.Object3D[] | boolean) {
//         this.set({ occlude });
//     }
//
//     @Output() occludeChange = new EventEmitter<boolean>();
//
//     @Input() set calculatePosition(calculatePosition: CalculatePosition) {
//         this.set({ calculatePosition });
//     }
//
//     @Input() set wrapperClass(wrapperClass: string) {
//         this.set({ wrapperClass });
//     }
//
//     @Input() set parentClass(parentClass: string) {
//         this.set({ parentClass });
//     }
//
//     @Input() set parentStyle(parentStyle: Partial<CSSStyleDeclaration>) {
//         this.set({ parentStyle });
//     }
//
//     @Input() set pointerEvents(pointerEvents: PointerEventsProperties) {
//         this.set({ pointerEvents });
//     }
//
//     @Input() set htmlElement(htmlElement: NgtSobaHtmlElement) {
//         this.set({
//             element: htmlElement.elementRef.nativeElement,
//             viewContainerRef: htmlElement.viewContainerRef,
//         });
//     }
//
//     @ViewChild(NgtSobaHtmlElement, { static: true })
//     defaultSobaHtmlElement!: NgtSobaHtmlElement;
//     @ViewChild('transformTemplate', { static: true })
//     transformedTemplate!: TemplateRef<unknown>;
//     @ViewChild('renderTemplate', { static: true })
//     renderTemplate!: TemplateRef<{ $implicit: Partial<CSSStyleDeclaration> }>;
//
//     @ViewChild('transformedOuterDiv')
//     transformedOuterDiv?: ElementRef<HTMLDivElement>;
//     @ViewChild('transformedInnerDiv')
//     transformedInnerDiv?: ElementRef<HTMLDivElement>;
//
//     readonly parentClass$ = this.select((s) => s.parentClass);
//     readonly parentStyle$ = this.select((s) => s.parentStyle);
//     readonly transform$ = this.select((s) => s.transform);
//
//     readonly styles$ = this.select(
//         this.select((s) => s.parentStyle),
//         this.select((s) => s.center),
//         this.select((s) => s.fullscreen),
//         this.canvasStore.select((s) => s.size),
//         this.select((s) => s.transform),
//         (style, center, fullscreen, size, transform) => {
//             if (transform) {
//                 return {
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: size.width,
//                     height: size.height,
//                     transformStyle: 'preserve-3d',
//                     pointerEvents: 'none',
//                 };
//             }
//
//             return {
//                 position: 'absolute',
//                 transform: center ? 'translate3d(-50%,-50%,0)' : 'none',
//                 ...(fullscreen && {
//                     top: -size.height / 2,
//                     left: -size.width / 2,
//                     width: size.width,
//                     height: size.height,
//                 }),
//                 ...style,
//             };
//         }
//     ).pipe(debounceSync());
//
//     readonly transformInnerStyle$ = this.select(
//         this.select((s) => s.pointerEvents),
//         (pointerEvents) => ({ position: 'absolute', pointerEvents })
//     ).pipe(debounceSync());
//
//     constructor(
//         @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
//         public objectInputsController: NgtObjectInputsController,
//         private canvasStore: NgtCanvasStore,
//         private zone: NgZone,
//         @Inject(DOCUMENT) private document: Document
//     ) {
//         super();
//         this.set({
//             occlude: [],
//             sprite: false,
//             transform: false,
//             zIndexRange: [16777271, 0],
//             calculatePosition: defaultCalculatePosition,
//             pointerEvents: 'auto',
//             eps: 0.001,
//             parentStyle: {},
//             parentClass: '',
//             center: false,
//             fullscreen: false,
//         });
//     }
//
//     private oldZoom = 0;
//     private oldPosition = [0, 0];
//     private visible = true;
//
//     private transformParams$ = this.select(
//         this.select((s) => s.target),
//         this.select((s) => s.transform),
//         this.select((s) => s.group),
//         (target, transform, group) => ({ target, transform, group })
//     );
//
//     private wrapperClassParams$ = this.select(
//         this.select((s) => s.element),
//         this.select((s) => s.wrapperClass),
//         (element, wrapperClass) => ({ element, wrapperClass })
//     );
//
//     private readonly transformTarget = this.effect<
//         Pick<NgtSobaHtmlState, 'target' | 'transform' | 'group'>
//     >(
//         tapEffect(({ target, transform, group }) => {
//             const { scene, camera, size } = this.canvasStore.get();
//             const { element, calculatePosition, prepend } = this.get();
//
//             scene.updateMatrixWorld();
//
//             if (transform) {
//                 element.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;`;
//             } else {
//                 const vec = calculatePosition(group, camera, size);
//                 element.style.cssText = `position:absolute;top:0;left:0;transform:translate3d(${vec[0]}px,${vec[1]}px,0);transform-origin:0 0;`;
//             }
//             if (target) {
//                 if (prepend) target.prepend(element);
//                 else target.appendChild(element);
//             }
//             return () => {
//                 if (target) target.removeChild(element);
//             };
//         })
//     );
//
//     private readonly updateWrapperClass = this.effect<
//         Pick<NgtSobaHtmlState, 'wrapperClass' | 'element'>
//     >(
//         tap(({ wrapperClass, element }) => {
//             if (wrapperClass) element.className = wrapperClass;
//         })
//     );
//
//     private readonly render = this.effect<NgtSobaHtmlState>(
//         tap(({ element, viewContainerRef, template, target }) => {
//             if (target) {
//                 viewContainerRef.clear();
//                 const viewRef = viewContainerRef.createEmbeddedView(template);
//                 if (viewRef.rootNodes[0]) {
//                     while (element.lastChild) {
//                         element.lastChild.remove();
//                     }
//                     element.appendChild(viewRef.rootNodes[0]);
//                 }
//             }
//         })
//     );
//
//     ngOnInit() {
//         this.zone.runOutsideAngular(() => {
//             this.set(
//                 this.select((s) => s.transform).pipe(
//                     map((transform) => ({
//                         template: transform
//                             ? this.transformedTemplate
//                             : this.renderTemplate,
//                     }))
//                 )
//             );
//
//             if (!this.get((s) => s.element)) {
//                 this.set({
//                     element:
//                         this.defaultSobaHtmlElement.elementRef.nativeElement,
//                     viewContainerRef:
//                         this.defaultSobaHtmlElement.viewContainerRef,
//                 });
//             }
//
//             this.onCanvasReady(this.canvasStore.ready$, () => {
//                 this.set(
//                     this.select(
//                         this.select((s) => s.portal).pipe(startWithUndefined()),
//                         this.canvasStore.renderer$,
//                         (portal, renderer) => ({
//                             target:
//                                 portal ?? renderer.domElement.parentElement!,
//                         })
//                     )
//                 );
//
//                 this.transformTarget(this.transformParams$);
//                 this.updateWrapperClass(this.wrapperClassParams$);
//                 this.render(this.select());
//             });
//         });
//     }
//
//     onGroupAnimate(object: THREE.Object3D) {
//         const group = object as THREE.Group;
//
//         const { camera, size, scene, raycaster } = this.canvasStore.get();
//         const {
//             transform,
//             calculatePosition,
//             eps,
//             element,
//             zIndexRange,
//             sprite,
//             distanceFactor,
//             occlude,
//         } = this.get();
//
//         camera.updateMatrixWorld();
//         group.updateWorldMatrix(true, false);
//         const vec = transform
//             ? this.oldPosition
//             : calculatePosition(group, camera, size);
//
//         if (
//             transform ||
//             Math.abs(this.oldZoom - camera.zoom) > eps ||
//             Math.abs(this.oldPosition[0] - vec[0]) > eps ||
//             Math.abs(this.oldPosition[1] - vec[1]) > eps
//         ) {
//             const isBehindCamera = isObjectBehindCamera(group, camera);
//             let raytraceTarget: null | undefined | boolean | THREE.Object3D[] =
//                 false;
//             if (typeof occlude === 'boolean' && occlude) {
//                 raytraceTarget = [scene];
//             } else if (Array.isArray(this.occlude)) {
//                 raytraceTarget = this.occlude.map(
//                     (item) => item
//                 ) as THREE.Object3D[];
//             }
//
//             const previouslyVisible = this.visible;
//             if (raytraceTarget) {
//                 this.visible =
//                     isObjectVisible(group, camera, raycaster, raytraceTarget) &&
//                     !isBehindCamera;
//             } else {
//                 this.visible = !isBehindCamera;
//             }
//
//             if (previouslyVisible !== this.visible) {
//                 if (this.occludeChange.observed) {
//                     this.occludeChange.emit(!this.visible);
//                 } else {
//                     element.style.display = this.visible ? 'block' : 'none';
//                 }
//             }
//
//             element.style.zIndex = `${objectZIndex(
//                 group,
//                 camera,
//                 zIndexRange
//             )}`;
//             if (transform) {
//                 const [widthHalf, heightHalf] = [
//                     size.width / 2,
//                     size.height / 2,
//                 ];
//                 const fov = camera.projectionMatrix.elements[5] * heightHalf;
//                 const { isOrthographicCamera, top, left, bottom, right } =
//                     camera as THREE.OrthographicCamera;
//                 const cameraMatrix = getCameraCSSMatrix(
//                     camera.matrixWorldInverse
//                 );
//                 const cameraTransform = isOrthographicCamera
//                     ? `scale(${fov})translate(${epsilon(
//                           -(right + left) / 2
//                       )}px,${epsilon((top + bottom) / 2)}px)`
//                     : `translateZ(${fov}px)`;
//                 let matrix = group.matrixWorld;
//                 if (sprite) {
//                     matrix = camera.matrixWorldInverse
//                         .clone()
//                         .transpose()
//                         .copyPosition(matrix)
//                         .scale(group.scale);
//                     matrix.elements[3] =
//                         matrix.elements[7] =
//                         matrix.elements[11] =
//                             0;
//                     matrix.elements[15] = 1;
//                 }
//                 element.style.width = size.width + 'px';
//                 element.style.height = size.height + 'px';
//                 element.style.perspective = isOrthographicCamera
//                     ? ''
//                     : `${fov}px`;
//                 if (
//                     this.transformedOuterDiv?.nativeElement &&
//                     this.transformedInnerDiv?.nativeElement
//                 ) {
//                     this.transformedOuterDiv.nativeElement.style.width =
//                         size.width + 'px';
//                     this.transformedOuterDiv.nativeElement.style.height =
//                         size.height + 'px';
//                     this.transformedOuterDiv.nativeElement.style.transform = `${cameraTransform}${cameraMatrix}translate(${widthHalf}px,${heightHalf}px)`;
//                     this.transformedInnerDiv.nativeElement.style.transform =
//                         getObjectCSSMatrix(
//                             matrix,
//                             1 / ((distanceFactor || 10) / 400)
//                         );
//                 }
//             } else {
//                 const scale =
//                     distanceFactor === undefined
//                         ? 1
//                         : objectScale(group, camera) * distanceFactor;
//                 element.style.transform = `translate3d(${vec[0]}px,${vec[1]}px,0) scale(${scale})`;
//             }
//             this.oldPosition = vec;
//             this.oldZoom = camera.zoom;
//         }
//     }
// }
//
// @NgModule({
//     imports: [NgtGroupModule, CommonModule],
//     declarations: [NgtSobaHtml, NgtSobaHtmlElement],
//     exports: [NgtSobaHtml, NgtSobaHtmlElement, NgtObjectInputsControllerModule],
// })
// export class NgtSobaHtmlModule {}

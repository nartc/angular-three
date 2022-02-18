import {
    debounceSync,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NgtCanvasStore,
    NgtObjectInputsController,
    NgtObjectInputsControllerModule,
    NgtSize,
    NgtStore,
    startWithUndefined,
    tapEffect,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    NgModule,
    NgZone,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { map, tap } from 'rxjs';
import * as THREE from 'three';

const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const v3 = new THREE.Vector3();

function defaultCalculatePosition(
    el: THREE.Object3D,
    camera: THREE.Camera,
    size: NgtSize
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
    if (camera instanceof THREE.OrthographicCamera) {
        return camera.zoom;
    } else if (camera instanceof THREE.PerspectiveCamera) {
        const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
        const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
        const vFOV = (camera.fov * Math.PI) / 180;
        const dist = objectPos.distanceTo(cameraPos);
        const scaleFOV = 2 * Math.tan(vFOV / 2) * dist;
        return 1 / scaleFOV;
    } else {
        return 1;
    }
}

function objectZIndex(
    el: THREE.Object3D,
    camera: THREE.Camera,
    zIndexRange: Array<number>
) {
    if (
        camera instanceof THREE.PerspectiveCamera ||
        camera instanceof THREE.OrthographicCamera
    ) {
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

interface NgtSobaHtmlState {
    element: HTMLElement;
    viewContainerRef: ViewContainerRef;
    sprite: boolean;
    transform: boolean;
    zIndexRange: Array<number>;
    calculatePosition: CalculatePosition;
    pointerEvents: PointerEventsProperties;
    eps: number;
    target: HTMLElement;
    group: THREE.Group;
    template: TemplateRef<unknown>;
    center: boolean;
    prepend: boolean;
    fullscreen: boolean;
    parentClass?: string;
    parentStyle?: Partial<CSSStyleDeclaration>;
    portal?: HTMLElement;
    distanceFactor?: number;
    occlude?: THREE.Object3D[] | boolean;
    wrapperClass?: string;
}

@Directive({
    selector: '[ngtSobaHtmlElement]',
    exportAs: 'ngtSobaHtmlElement',
})
export class NgtSobaHtmlElement {
    constructor(
        public elementRef: ElementRef<HTMLElement>,
        public viewContainerRef: ViewContainerRef
    ) {}
}

@Component({
    selector: 'ngt-soba-html',
    template: `
        <ngt-group
            (ready)="set({ group: $event })"
            (animateReady)="onGroupAnimate($event.object)"
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
        ></ngt-group>

        <ng-template #transformTemplate>
            <div #transformedOuterDiv [style]="styles$ | async">
                <div
                    #transformedInnerDiv
                    [style]="transformInnerStyle$ | async"
                >
                    <ng-container
                        *ngTemplateOutlet="renderTemplate"
                    ></ng-container>
                </div>
            </div>
        </ng-template>

        <ng-template #renderTemplate let-style>
            <div
                #renderedDiv
                [class]="$any(parentClass$ | async)"
                [style]="
                    (transform$ | async)
                        ? (parentStyle$ | async)
                        : (styles$ | async)
                "
            >
                <ng-content></ng-content>
            </div>
        </ng-template>

        <div ngtSobaHtmlElement></div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER],
})
export class NgtSobaHtml extends NgtStore<NgtSobaHtmlState> implements OnInit {
    @Input() set prepend(prepend: boolean) {
        this.set({ prepend });
    }

    @Input() set center(center: boolean) {
        this.set({ center });
    }

    @Input() set fullscreen(fullscreen: boolean) {
        this.set({ fullscreen });
    }

    @Input() set eps(eps: number) {
        this.set({ eps });
    }

    @Input() set portal(portal: HTMLElement) {
        this.set({ portal });
    }

    @Input() set distanceFactor(distanceFactor: number) {
        this.set({ distanceFactor });
    }

    @Input() set sprite(sprite: boolean) {
        this.set({ sprite });
    }

    @Input() set transform(transform: boolean) {
        this.set({ transform });
    }

    @Input() set zIndexRange(zIndexRange: Array<number>) {
        this.set({ zIndexRange });
    }

    @Input() set occlude(occlude: THREE.Object3D[] | boolean) {
        this.set({ occlude });
    }

    @Output() occludeChange = new EventEmitter<boolean>();

    @Input() set calculatePosition(calculatePosition: CalculatePosition) {
        this.set({ calculatePosition });
    }

    @Input() set wrapperClass(wrapperClass: string) {
        this.set({ wrapperClass });
    }

    @Input() set parentClass(parentClass: string) {
        this.set({ parentClass });
    }

    @Input() set parentStyle(parentStyle: Partial<CSSStyleDeclaration>) {
        this.set({ parentStyle });
    }

    @Input() set pointerEvents(pointerEvents: PointerEventsProperties) {
        this.set({ pointerEvents });
    }

    @Input() set htmlElement(htmlElement: NgtSobaHtmlElement) {
        this.set({
            element: htmlElement.elementRef.nativeElement,
            viewContainerRef: htmlElement.viewContainerRef,
        });
    }

    @ViewChild(NgtSobaHtmlElement, { static: true })
    defaultSobaHtmlElement!: NgtSobaHtmlElement;
    @ViewChild('transformTemplate', { static: true })
    transformedTemplate!: TemplateRef<unknown>;
    @ViewChild('renderTemplate', { static: true })
    renderTemplate!: TemplateRef<{ $implicit: Partial<CSSStyleDeclaration> }>;

    @ViewChild('transformedOuterDiv')
    transformedOuterDiv?: ElementRef<HTMLDivElement>;
    @ViewChild('transformedInnerDiv')
    transformedInnerDiv?: ElementRef<HTMLDivElement>;

    readonly parentClass$ = this.select((s) => s.parentClass);
    readonly parentStyle$ = this.select((s) => s.parentStyle);
    readonly transform$ = this.select((s) => s.transform);

    readonly styles$ = this.select(
        this.select((s) => s.parentStyle),
        this.select((s) => s.center),
        this.select((s) => s.fullscreen),
        this.canvasStore.select((s) => s.size),
        this.select((s) => s.transform),
        (style, center, fullscreen, size, transform) => {
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
                ...style,
            };
        }
    ).pipe(debounceSync());

    readonly transformInnerStyle$ = this.select(
        this.select((s) => s.pointerEvents),
        (pointerEvents) => ({ position: 'absolute', pointerEvents })
    ).pipe(debounceSync());

    constructor(
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController,
        private canvasStore: NgtCanvasStore,
        private zone: NgZone,
        @Inject(DOCUMENT) private document: Document
    ) {
        super();
        this.set({
            occlude: [],
            sprite: false,
            transform: false,
            zIndexRange: [16777271, 0],
            calculatePosition: defaultCalculatePosition,
            pointerEvents: 'auto',
            eps: 0.001,
            parentStyle: {},
            parentClass: '',
            center: false,
            fullscreen: false,
        });
    }

    private oldZoom = 0;
    private oldPosition = [0, 0];
    private visible = true;

    private transformParams$ = this.select(
        this.select((s) => s.target),
        this.select((s) => s.transform),
        this.select((s) => s.group),
        (target, transform, group) => ({ target, transform, group })
    );

    private wrapperClassParams$ = this.select(
        this.select((s) => s.element),
        this.select((s) => s.wrapperClass),
        (element, wrapperClass) => ({ element, wrapperClass })
    );

    private readonly transformTarget = this.effect<
        Pick<NgtSobaHtmlState, 'target' | 'transform' | 'group'>
    >(
        tapEffect(({ target, transform, group }) => {
            const { scene, camera, size } = this.canvasStore.get();
            const { element, calculatePosition, prepend } = this.get();

            scene.updateMatrixWorld();

            if (transform) {
                element.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;`;
            } else {
                const vec = calculatePosition(group, camera, size);
                element.style.cssText = `position:absolute;top:0;left:0;transform:translate3d(${vec[0]}px,${vec[1]}px,0);transform-origin:0 0;`;
            }
            if (target) {
                if (prepend) target.prepend(element);
                else target.appendChild(element);
            }
            return () => {
                if (target) target.removeChild(element);
            };
        })
    );

    private readonly updateWrapperClass = this.effect<
        Pick<NgtSobaHtmlState, 'wrapperClass' | 'element'>
    >(
        tap(({ wrapperClass, element }) => {
            if (wrapperClass) element.className = wrapperClass;
        })
    );

    private readonly render = this.effect<NgtSobaHtmlState>(
        tap(({ element, viewContainerRef, template, target }) => {
            if (target) {
                viewContainerRef.clear();
                const viewRef = viewContainerRef.createEmbeddedView(template);
                if (viewRef.rootNodes[0]) {
                    while (element.lastChild) {
                        element.lastChild.remove();
                    }
                    element.appendChild(viewRef.rootNodes[0]);
                }
            }
        })
    );

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.set(
                this.select((s) => s.transform).pipe(
                    map((transform) => ({
                        template: transform
                            ? this.transformedTemplate
                            : this.renderTemplate,
                    }))
                )
            );

            if (!this.get((s) => s.element)) {
                this.set({
                    element:
                        this.defaultSobaHtmlElement.elementRef.nativeElement,
                    viewContainerRef:
                        this.defaultSobaHtmlElement.viewContainerRef,
                });
            }

            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.set(
                    this.select(
                        this.select((s) => s.portal).pipe(startWithUndefined()),
                        this.canvasStore.renderer$,
                        (portal, renderer) => ({
                            target:
                                portal ?? renderer.domElement.parentElement!,
                        })
                    )
                );

                this.transformTarget(this.transformParams$);
                this.updateWrapperClass(this.wrapperClassParams$);
                this.render(this.select());
            });
        });
    }

    onGroupAnimate(object: THREE.Object3D) {
        const group = object as THREE.Group;

        const { camera, size, scene, raycaster } = this.canvasStore.get();
        const {
            transform,
            calculatePosition,
            eps,
            element,
            zIndexRange,
            sprite,
            distanceFactor,
            occlude,
        } = this.get();

        camera.updateMatrixWorld();
        group.updateWorldMatrix(true, false);
        const vec = transform
            ? this.oldPosition
            : calculatePosition(group, camera, size);

        if (
            transform ||
            Math.abs(this.oldZoom - camera.zoom) > eps ||
            Math.abs(this.oldPosition[0] - vec[0]) > eps ||
            Math.abs(this.oldPosition[1] - vec[1]) > eps
        ) {
            const isBehindCamera = isObjectBehindCamera(group, camera);
            let raytraceTarget: null | undefined | boolean | THREE.Object3D[] =
                false;
            if (typeof occlude === 'boolean' && occlude) {
                raytraceTarget = [scene];
            } else if (Array.isArray(this.occlude)) {
                raytraceTarget = this.occlude.map(
                    (item) => item
                ) as THREE.Object3D[];
            }

            const previouslyVisible = this.visible;
            if (raytraceTarget) {
                this.visible =
                    isObjectVisible(group, camera, raycaster, raytraceTarget) &&
                    !isBehindCamera;
            } else {
                this.visible = !isBehindCamera;
            }

            if (previouslyVisible !== this.visible) {
                if (this.occludeChange.observed) {
                    this.occludeChange.emit(!this.visible);
                } else {
                    element.style.display = this.visible ? 'block' : 'none';
                }
            }

            element.style.zIndex = `${objectZIndex(
                group,
                camera,
                zIndexRange
            )}`;
            if (transform) {
                const [widthHalf, heightHalf] = [
                    size.width / 2,
                    size.height / 2,
                ];
                const fov = camera.projectionMatrix.elements[5] * heightHalf;
                const { isOrthographicCamera, top, left, bottom, right } =
                    camera as THREE.OrthographicCamera;
                const cameraMatrix = getCameraCSSMatrix(
                    camera.matrixWorldInverse
                );
                const cameraTransform = isOrthographicCamera
                    ? `scale(${fov})translate(${epsilon(
                          -(right + left) / 2
                      )}px,${epsilon((top + bottom) / 2)}px)`
                    : `translateZ(${fov}px)`;
                let matrix = group.matrixWorld;
                if (sprite) {
                    matrix = camera.matrixWorldInverse
                        .clone()
                        .transpose()
                        .copyPosition(matrix)
                        .scale(group.scale);
                    matrix.elements[3] =
                        matrix.elements[7] =
                        matrix.elements[11] =
                            0;
                    matrix.elements[15] = 1;
                }
                element.style.width = size.width + 'px';
                element.style.height = size.height + 'px';
                element.style.perspective = isOrthographicCamera
                    ? ''
                    : `${fov}px`;
                if (
                    this.transformedOuterDiv?.nativeElement &&
                    this.transformedInnerDiv?.nativeElement
                ) {
                    this.transformedOuterDiv.nativeElement.style.width =
                        size.width + 'px';
                    this.transformedOuterDiv.nativeElement.style.height =
                        size.height + 'px';
                    this.transformedOuterDiv.nativeElement.style.transform = `${cameraTransform}${cameraMatrix}translate(${widthHalf}px,${heightHalf}px)`;
                    this.transformedInnerDiv.nativeElement.style.transform =
                        getObjectCSSMatrix(
                            matrix,
                            1 / ((distanceFactor || 10) / 400)
                        );
                }
            } else {
                const scale =
                    distanceFactor === undefined
                        ? 1
                        : objectScale(group, camera) * distanceFactor;
                element.style.transform = `translate3d(${vec[0]}px,${vec[1]}px,0) scale(${scale})`;
            }
            this.oldPosition = vec;
            this.oldZoom = camera.zoom;
        }
    }
}

@NgModule({
    imports: [NgtGroupModule, CommonModule],
    declarations: [NgtSobaHtml, NgtSobaHtmlElement],
    exports: [NgtSobaHtml, NgtSobaHtmlElement, NgtObjectInputsControllerModule],
})
export class NgtSobaHtmlModule {}

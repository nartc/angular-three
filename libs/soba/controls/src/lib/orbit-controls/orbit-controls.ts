import {
    makeVector3,
    NgtAnimationFrameStore,
    NgtCanvasStore,
    NgtEventsStore,
    NgtLoop,
    NgtPerformance,
    NgtStore,
    NgtVector3,
    tapEffect,
} from '@angular-three/core';
import {
    Directive,
    EventEmitter,
    Input,
    NgModule,
    NgZone,
    OnInit,
    Output,
} from '@angular/core';
import { map, of, switchMap, tap } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

export interface NgtSobaOrbitControlsState {
    enableDamping: boolean;
    makeDefault: boolean;
    regress: boolean;
    controls: OrbitControls;
    camera?: THREE.Camera;
    domElement?: HTMLElement;
    target?: NgtVector3;
}

@Directive({
    selector: 'ngt-soba-orbit-controls',
    exportAs: 'ngtSobaOrbitControls',
})
export class NgtSobaOrbitControls
    extends NgtStore<NgtSobaOrbitControlsState>
    implements OnInit
{
    @Input() set target(v: NgtVector3) {
        this.set({ target: v });
    }

    @Input() set camera(v: THREE.Camera) {
        this.set({ camera: v });
    }

    @Input() set domElement(v: HTMLElement) {
        this.set({ domElement: v });
    }

    @Input() set regress(v: boolean) {
        this.set({ regress: v });
    }

    @Input() set enableDamping(v: boolean) {
        this.set({ enableDamping: v });
    }

    @Input() set makeDefault(v: boolean) {
        this.set({ makeDefault: v });
    }

    readonly controls$ = this.select((s) => s.controls);

    @Output() ready = this.controls$;
    @Output() change = new EventEmitter<THREE.Event>();
    @Output() start = new EventEmitter<THREE.Event>();
    @Output() end = new EventEmitter<THREE.Event>();

    private controlsEventsParams$ = this.select(
        this.controls$,
        this.select((s) => s.regress),
        this.select((s) => s.domElement),
        (controls, regress, domElement) => ({ controls, regress, domElement })
    );

    private makeDefaultParams$ = this.select(
        this.controls$,
        this.select((s) => s.makeDefault),
        (controls, makeDefault) => ({ controls, makeDefault })
    );
    private controlsTargetParams$ = this.select(
        this.controls$,
        this.select((s) => s.target),
        (controls, target) => ({ controls, target })
    );

    constructor(
        private zone: NgZone,
        private loop: NgtLoop,
        private canvasStore: NgtCanvasStore,
        private eventsStore: NgtEventsStore,
        private animationFrameStore: NgtAnimationFrameStore,
        private performance: NgtPerformance
    ) {
        super();
        this.set({
            target: undefined,
            regress: false,
            enableDamping: true,
            makeDefault: false,
            camera: undefined,
            domElement: undefined,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.set(
                this.canvasStore.camera$.pipe(map((camera) => ({ camera })))
            );
            this.set(
                this.eventsStore
                    .select((s) => s.connected)
                    .pipe(
                        switchMap((connected) => {
                            if (typeof connected !== 'boolean')
                                return of({ domElement: connected });
                            return this.canvasStore.renderer$.pipe(
                                map((renderer) => ({
                                    domElement: renderer.domElement,
                                }))
                            );
                        })
                    )
            );

            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.init(this.select((s) => s.camera));
                this.registerAnimation(this.controls$);
                this.setDefaultControls(this.makeDefaultParams$);
                this.setControlsTarget(this.controlsTargetParams$);
                this.setControlsEvents(this.controlsEventsParams$);
            });
        });
    }

    private readonly init = this.effect<NgtSobaOrbitControlsState['camera']>(
        tap((camera) => {
            const enableDamping = this.get((s) => s.enableDamping);
            if (camera) {
                const controls = new OrbitControls(camera);
                controls.enableDamping = enableDamping;
                this.set({ controls });
            }
        })
    );

    private readonly registerAnimation = this.effect<OrbitControls>(
        tapEffect((controls) => {
            let animationUuid: string;
            if (controls.enabled) {
                animationUuid = this.animationFrameStore.register({
                    callback: () => {
                        controls.update();
                    },
                });
            }
            return () => {
                this.animationFrameStore.unregister(animationUuid);
            };
        })
    );

    private readonly setDefaultControls = this.effect<
        Pick<NgtSobaOrbitControlsState, 'controls' | 'makeDefault'>
    >(
        tapEffect(({ controls, makeDefault }) => {
            const oldControls = this.canvasStore.get((s) => s.controls);
            if (makeDefault) {
                this.canvasStore.set({ controls });
            }

            return () => {
                this.canvasStore.set({ controls: oldControls });
            };
        })
    );

    private readonly setControlsTarget = this.effect<
        Pick<NgtSobaOrbitControlsState, 'controls' | 'target'>
    >(
        tap(({ controls, target }) => {
            if (controls) {
                const vector3Target = makeVector3(target);
                if (vector3Target) {
                    controls.target = vector3Target;
                }
            }
        })
    );

    private readonly setControlsEvents = this.effect<
        Pick<NgtSobaOrbitControlsState, 'controls' | 'regress' | 'domElement'>
    >(
        tapEffect(({ controls, regress, domElement }) => {
            const changeCallback: (e: THREE.Event) => void = (e) => {
                this.loop.invalidate();
                if (regress) {
                    this.performance.regress();
                }

                if (this.change.observed) {
                    this.change.emit(e);
                }
            };
            let startCallback: (e: THREE.Event) => void;
            let endCallback: (e: THREE.Event) => void;

            if (domElement) {
                controls.connect(domElement);
            }

            controls.addEventListener('change', changeCallback);

            if (this.start.observed) {
                startCallback = (event: THREE.Event) => {
                    this.start.emit(event);
                };
                controls.addEventListener('start', startCallback);
            }

            if (this.end.observed) {
                endCallback = (event: THREE.Event) => {
                    this.end.emit(event);
                };
                controls.addEventListener('end', endCallback);
            }

            return () => {
                controls.removeEventListener('change', changeCallback);
                if (endCallback)
                    controls.removeEventListener('end', endCallback);
                if (startCallback)
                    controls.removeEventListener('start', startCallback);
                controls.dispose();
            };
        })
    );

    get controls() {
        return (this.get((s) => s.controls) ||
            this.canvasStore.get((s) => s.controls)) as OrbitControls;
    }
}

@NgModule({
    declarations: [NgtSobaOrbitControls],
    exports: [NgtSobaOrbitControls],
})
export class NgtSobaOrbitControlsModule {}

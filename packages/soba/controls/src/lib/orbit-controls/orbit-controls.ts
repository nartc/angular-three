import {
    defaultProjector,
    injectArgs,
    injectInstance,
    NgtInstance,
    NgtObservableInput,
    NgtStore,
    NgtVector3,
    provideInstanceRef,
    proxify,
    tapEffect,
} from '@angular-three/core';
import { Component, inject, Input, NgZone, OnInit } from '@angular/core';
import { MOUSE, TOUCH } from 'three';
import { OrbitControls } from 'three-stdlib';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-orbit-controls',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(SobaOrbitControls)],
    inputs: [...getInputs()],
})
export class SobaOrbitControls extends OrbitControls implements OnInit {
    private readonly zone = inject(NgZone);
    private readonly store = inject(NgtStore);
    private readonly instance = injectInstance({ self: true });

    @Input() set makeDefault(makeDefault: NgtObservableInput<boolean>) {
        this.instance.write({ makeDefault });
    }

    @Input() set regress(regress: NgtObservableInput<boolean>) {
        this.instance.write({ regress });
    }

    constructor() {
        const [camera, domElement] = injectArgs<typeof OrbitControls>({ optional: true })?.() || [];
        const defaultCamera = inject(NgtStore).read((s) => s.camera);
        super(camera || defaultCamera, domElement);
        return proxify(this, {
            created: (instance) => (instance.enableDamping = true),
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.setBeforeRender();
            this.connectElement(
                this.instance.select(
                    this.instance.select((s) => s['domElement']),
                    this.instance.select((s) => s['regress']),
                    this.instance.instanceRef,
                    this.store.select((s) => s.invalidate),
                    defaultProjector,
                    { debounce: true }
                )
            );
            this.makeDefaultControls(
                this.instance.select(
                    this.instance.select((s) => s['makeDefault']),
                    this.instance.instanceRef,
                    defaultProjector,
                    { debounce: true }
                )
            );
        });
    }

    private readonly setBeforeRender = this.instance.effect<void>(
        tapEffect(() => {
            if (this.enabled) {
                return this.store
                    .read((s) => s.internal)
                    .subscribe(() => {
                        this.update();
                    }, -1);
            }
        })
    );

    private readonly connectElement = this.instance.effect(
        tapEffect(() => {
            const { gl, events } = this.store.read();
            const domElement = this.instance.read((s) => s['domElement']) || events.connected || gl.domElement;

            this.connect(domElement);
            return () => {
                this.dispose();
            };
        })
    );

    private readonly makeDefaultControls = this.instance.effect(
        tapEffect(() => {
            const makeDefault = this.instance.read((s) => s['makeDefault']);
            if (makeDefault) {
                const old = this.store.read((s) => s.controls);
                this.store.write({ controls: this });
                return () => {
                    this.store.write({ controls: old });
                };
            }
        })
    );

    static ngAcceptInputType_domElement: NgtObservableInput<HTMLElement> | undefined;
    static ngAcceptInputType_enabled: NgtObservableInput<boolean>;
    static ngAcceptInputType_target: NgtObservableInput<NgtVector3>;
    static ngAcceptInputType_minDistance: NgtObservableInput<number>;
    static ngAcceptInputType_maxDistance: NgtObservableInput<number>;
    static ngAcceptInputType_minZoom: NgtObservableInput<number>;
    static ngAcceptInputType_maxZoom: NgtObservableInput<number>;
    static ngAcceptInputType_minPolarAngle: NgtObservableInput<number>;
    static ngAcceptInputType_maxPolarAngle: NgtObservableInput<number>;
    static ngAcceptInputType_minAzimuthAngle: NgtObservableInput<number>;
    static ngAcceptInputType_maxAzimuthAngle: NgtObservableInput<number>;
    static ngAcceptInputType_enableDamping: NgtObservableInput<boolean>;
    static ngAcceptInputType_dampingFactor: NgtObservableInput<number>;
    static ngAcceptInputType_enableZoom: NgtObservableInput<boolean>;
    static ngAcceptInputType_zoomSpeed: NgtObservableInput<number>;
    static ngAcceptInputType_enableRotate: NgtObservableInput<boolean>;
    static ngAcceptInputType_rotateSpeed: NgtObservableInput<number>;
    static ngAcceptInputType_enablePan: NgtObservableInput<boolean>;
    static ngAcceptInputType_panSpeed: NgtObservableInput<number>;
    static ngAcceptInputType_screenSpacePanning: NgtObservableInput<boolean>;
    static ngAcceptInputType_keyPanSpeed: NgtObservableInput<number>;
    static ngAcceptInputType_autoRotate: NgtObservableInput<boolean>;
    static ngAcceptInputType_autoRotateSpeed: NgtObservableInput<number>;
    static ngAcceptInputType_reverseOrbit: NgtObservableInput<boolean>;
    static ngAcceptInputType_keys: NgtObservableInput<{
        LEFT: string;
        UP: string;
        RIGHT: string;
        BOTTOM: string;
    }>;
    static ngAcceptInputType_mouseButtons: NgtObservableInput<{
        LEFT: MOUSE;
        MIDDLE: MOUSE;
        RIGHT: MOUSE;
    }>;
    static ngAcceptInputType_touches: NgtObservableInput<{
        ONE: TOUCH;
        TWO: TOUCH;
    }>;
}

function getInputs() {
    return [
        'domElement',
        'enabled',
        'target',
        'minDistance',
        'maxDistance',
        'minZoom',
        'maxZoom',
        'minPolarAngle',
        'maxPolarAngle',
        'minAzimuthAngle',
        'maxAzimuthAngle',
        'enableDamping',
        'dampingFactor',
        'enableZoom',
        'zoomSpeed',
        'enableRotate',
        'rotateSpeed',
        'enablePan',
        'panSpeed',
        'screenSpacePanning',
        'keyPanSpeed',
        'autoRotate',
        'autoRotateSpeed',
        'reverseOrbit',
        'keys',
        'mouseButtons',
        'touches',
    ];
}

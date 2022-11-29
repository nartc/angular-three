import { inject, Injectable, NgZone } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { injectWindow } from '../di/window';
import { NgtRef } from '../ref';
import type {
    NgtBeforeRenderCallback,
    NgtCamera,
    NgtCanvasInputs,
    NgtDpr,
    NgtEquConfig,
    NgtEventManager,
    NgtSize,
    NgtState,
    NgtStateFactory,
    NgtViewport,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { createDefaultCamera, updateCamera } from '../utils/camera';
import { checkNeedsUpdate } from '../utils/check-update';
import { prepare } from '../utils/instance';
import { is } from '../utils/is';
import { createLoop } from '../utils/loop';
import { makeDpr } from '../utils/make';
import { createRenderer } from '../utils/renderer';
import { defaultProjector, filterFalsy, NgtComponentStore, tapEffect } from './component-store';

export const rootStateMap = new Map<Element, NgtStateFactory>();
const { invalidate, advance } = createLoop(rootStateMap);

const shallowLoose = { objects: 'shallow', strict: false } as NgtEquConfig;

@Injectable()
export class NgtStore extends NgtComponentStore<NgtState> {
    private readonly parentStore = inject(NgtStore, { optional: true, skipSelf: true });
    private readonly zone = inject(NgZone);
    private readonly window = injectWindow();

    private readonly position = new THREE.Vector3();
    private readonly defaultTarget = new THREE.Vector3();
    private readonly tempTarget = new THREE.Vector3();

    get rootStateFactory(): NgtStateFactory {
        let root = this.read((s) => s.previousStateFactory);
        while (root && root().previousStateFactory) {
            root = root().previousStateFactory;
        }

        return root || this.read;
    }

    private readonly resize = this.effect<any>(($) => {
        let oldSize = this.read((s) => s.size);
        let oldDpr = this.read((s) => s.viewport?.dpr);

        return $.pipe(
            tap(() => {
                const { camera, size, viewport, gl } = this.read();
                // Resize camera and renderer on changes to size and pixelratio
                if (size !== oldSize || viewport.dpr !== oldDpr) {
                    oldSize = size;
                    oldDpr = viewport.dpr;
                    // Update camera & renderer
                    updateCamera(camera, size);
                    gl.setPixelRatio(viewport.dpr);
                    gl.setSize(size.width, size.height, size.updateStyle);
                }
            })
        );
    });

    private readonly invalidate = this.effect(tap(() => void this.read((s) => s.invalidate)()));

    isInit = false;
    isConfigured = false;

    init() {
        if (!this.isInit) {
            const pointer = new THREE.Vector2();

            const scene = prepare(
                new THREE.Scene(),
                this.read,
                undefined,
                this.parentStore?.get((s) => s.sceneRef)
            );

            let performanceTimeout: ReturnType<typeof setTimeout>;

            this.write({
                ready: false,
                cameraRef: new NgtRef(),
                scene,
                sceneRef: new NgtRef(scene),
                events: { priority: 1, enabled: true, connected: false },
                invalidate: (frames = 1) => invalidate(this.read, frames),
                advance: (timestamp: number, runGlobalEffects?: boolean) =>
                    advance(timestamp, runGlobalEffects, this.read),

                legacy: false,
                linear: false,
                flat: false,
                controls: null,

                clock: new THREE.Clock(),
                pointer,

                frameloop: 'always',

                performance: {
                    current: 1,
                    min: 0.5,
                    max: 1,
                    debounce: 200,
                    regress: () => {
                        this.zone.runOutsideAngular(() => {
                            const state = this.read();
                            // Clear timeout
                            if (performanceTimeout) clearTimeout(performanceTimeout);
                            // Set lower bound performance
                            if (state.performance.current !== state.performance.min)
                                this.setPerformanceCurrent(state.performance.min);
                            // Go back to upper bound performance after a while unless something regresses meanwhile
                            performanceTimeout = setTimeout(
                                () => this.setPerformanceCurrent(this.read((s) => s.performance)?.max || 1),
                                state.performance.debounce
                            );
                        });
                    },
                },

                size: { width: 0, height: 0, top: 0, left: 0, updateStyle: false },
                viewport: {
                    initialDpr: 0,
                    dpr: 0,
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0,
                    aspect: 0,
                    distance: 0,
                    factor: 0,
                    getCurrentViewport: this.getCurrentViewport,
                },

                previousStateFactory: this.parentStore?.read.bind(this.parentStore),
                rootStateFactory: this.rootStateFactory.bind(this),
                internal: {
                    active: false,
                    priority: 0,
                    frames: 0,
                    lastEvent: null,
                    interaction: [],
                    hovered: new Map(),
                    capturedMap: new Map(),
                    animations: new Map(),
                    subscribers: [],
                    initialClick: [0, 0],
                    initialHits: [],
                    subscribe: (
                        callback: NgtBeforeRenderCallback,
                        priority: number = 0,
                        stateFactory: NgtStateFactory = this.read,
                        obj?: THREE.Object3D | NgtRef<THREE.Object3D>
                    ) => {
                        const internal = this.read((s) => s.internal);
                        // If this subscription was given a priority, it takes rendering into its own hands
                        // For that reason we switch off automatic rendering and increase the manual flag
                        // As long as this flag is positive there can be no internal rendering at all
                        // because there could be multiple render subscriptions
                        internal.priority = internal.priority + (priority > 0 ? 1 : 0);
                        internal.subscribers.push({ priority, stateFactory, callback, obj });

                        // Register subscriber and sort layers from lowest to highest, meaning,
                        // highest priority renders last (on top of the other frames)
                        internal.subscribers.sort((a, b) => (a.priority || 0) - (b.priority || 0));

                        return () => {
                            const internalOnCleanUp = this.read((s) => s.internal);
                            if (internalOnCleanUp.subscribers) {
                                // Decrease manual flag if this subscription had a priority
                                internalOnCleanUp.priority = internalOnCleanUp.priority - (priority > 0 ? 1 : 0);
                                // Remove subscriber from list
                                internalOnCleanUp.subscribers = internalOnCleanUp.subscribers.filter(
                                    (s) => s.callback !== callback
                                );
                            }
                        };
                    },
                },
                setPerformanceCurrent: this.setPerformanceCurrent,
                setEvents: this.setEvents,
                setFrameloop: this.setFrameloop,
                setSize: this.setSize,
                setDpr: this.setDpr,
                setCamera: this.setCamera,
                addInteraction: this.addInteraction,
                removeInteraction: this.removeInteraction,
            });
            this.isInit = true;
        }
    }

    private readonly addInteraction = (interaction: THREE.Object3D) => {
        this.write((state) => ({
            ...state,
            internal: {
                ...state.internal,
                interaction: [...state.internal.interaction, interaction],
            },
        }));
    };

    private readonly removeInteraction = (uuid: string) => {
        this.write((state) => ({
            ...state,
            internal: {
                ...state.internal,
                interaction: state.internal.interaction.filter((interaction) => interaction.uuid !== uuid),
            },
        }));
    };

    private readonly setPerformanceCurrent = (current: number) => {
        this.write((s) => ({ performance: { ...s.performance, current } }));
    };

    private readonly setEvents = (events: Partial<NgtEventManager<any>>) => {
        this.write((s) => ({ events: { ...s.events, ...events } }));
    };

    private readonly setSize = (width: number, height: number, top?: number, left?: number, updateStyle?: boolean) => {
        const camera = this.read((s) => s.camera);
        const size = { width, height, top: top || 0, left: left || 0, updateStyle };

        this.write((state) => ({
            size,
            viewport: {
                ...state.viewport,
                ...this.getCurrentViewport(camera, this.defaultTarget, size),
            },
        }));
    };

    private readonly setCamera = (camera: NgtCamera) => {
        this.write((s) => ({
            camera,
            viewport: {
                ...s.viewport,
                ...this.getCurrentViewport(camera),
            },
        }));
        this.read((s) => s.cameraRef).set(camera);
    };

    private readonly setDpr = (dpr: NgtDpr) => {
        const resolved = makeDpr(dpr, this.window);
        this.write((s) => ({
            viewport: {
                ...s.viewport,
                dpr: resolved,
                initialDpr: s.viewport.initialDpr || resolved,
            },
        }));
    };

    private readonly setFrameloop = (frameloop: 'always' | 'demand' | 'never' = 'always') => {
        const clock = this.read((s) => s.clock);

        // if frameloop === "never" clock.elapsedTime is updated using advance(timestamp)
        clock.stop();
        clock.elapsedTime = 0;

        if (frameloop !== 'never') {
            clock.start();
            clock.elapsedTime = 0;
        }

        this.write({ frameloop });
    };

    private readonly getCurrentViewport = (
        camera = this.read((s) => s.camera),
        target: THREE.Vector3 | Parameters<THREE.Vector3['set']> = this.defaultTarget,
        size = this.read((s) => s.size)
    ): Omit<NgtViewport, 'dpr' | 'initialDpr'> => {
        const { width, height, top, left } = size;
        const aspect = width / height;
        if (target instanceof THREE.Vector3) this.tempTarget.copy(target);
        else this.tempTarget.set(...target);

        const distance = camera.getWorldPosition(this.position).distanceTo(this.tempTarget);

        if (is.orthographic(camera)) {
            return {
                width: width / camera.zoom,
                height: height / camera.zoom,
                top,
                left,
                factor: 1,
                distance,
                aspect,
            };
        }

        const fov = (camera.fov * Math.PI) / 180; // convert vertical fov to radians
        const h = 2 * Math.tan(fov / 2) * distance; // visible height
        const w = h * (width / height);
        return {
            width: w,
            height: h,
            top,
            left,
            factor: width / w,
            distance,
            aspect,
        };
    };

    configure(inputs: NgtCanvasInputs, canvasElement: HTMLCanvasElement) {
        const {
            gl: glOptions,
            size: sizeOptions,
            camera: cameraOptions,
            raycaster: raycasterOptions,
            events,
            orthographic,
            lookAt,
            shadows,
            linear,
            flat,
            legacy,
            dpr,
            frameloop,
            performance,
        } = inputs;

        const state = this.read();

        // Set up renderer (one time only!)
        let gl = state.gl;
        if (!state.gl) {
            this.write({ gl: (gl = createRenderer(glOptions, canvasElement)) });
        }

        // Set up raycaster (one time only!)
        let raycaster = state.raycaster;
        if (!raycaster) {
            this.write({ raycaster: (raycaster = new THREE.Raycaster()) });
        }

        // Set raycaster options
        const { params, ...options } = raycasterOptions || {};
        if (!is.equ(options, raycaster, shallowLoose)) {
            applyProps(raycaster, { ...options });
        }
        if (!is.equ(params, raycaster.params, shallowLoose)) {
            applyProps(raycaster, {
                params: { ...raycaster.params, ...(params || {}) },
            });
        }

        // Create default camera (one time only!)
        if (!state.camera) {
            const isCamera = is.camera(cameraOptions);
            let camera = isCamera ? (cameraOptions as NgtCamera) : createDefaultCamera(orthographic!, state.size);
            if (!isCamera) {
                if (cameraOptions) {
                    applyProps(camera, cameraOptions);
                }

                // Set position.z if position not passed in
                if (!cameraOptions?.position) {
                    camera.position.z = 5;
                }

                // Always look at center or passed-in lookAt by default
                if (!cameraOptions?.rotation) {
                    if (Array.isArray(lookAt)) {
                        camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
                    } else if (lookAt instanceof THREE.Vector3) {
                        camera.lookAt(lookAt);
                    } else {
                        camera.lookAt(0, 0, 0);
                    }
                }

                // Update projection matrix after applying props
                camera.updateProjectionMatrix();
            }

            if (!is.instance(camera)) {
                camera = prepare(
                    camera,
                    this.read,
                    undefined,
                    this.parentStore?.get((s) => s.cameraRef)
                );
            }
            this.write({ camera });
            this.read((s) => s.cameraRef).set(camera);
        }

        // Set up XR (one time only!)
        if (!state.xr) {
            // Handle frame behavior in WebXR
            const handleXRFrame: XRFrameRequestCallback = (timestamp: number, frame?: XRFrame) => {
                const state = this.read();
                if (state.frameloop === 'never') return;
                advance(timestamp, true, this.read, frame);
            };

            // Toggle render switching on session
            const handleSessionChange = () => {
                const state = this.read();
                state.gl.xr.enabled = state.gl.xr.isPresenting;

                state.gl.xr.setAnimationLoop(state.gl.xr.isPresenting ? handleXRFrame : null);
                if (!state.gl.xr.isPresenting) invalidate(this.read);
            };

            // WebXR session manager
            const xr = {
                connect: () => {
                    const gl = this.read((s) => s.gl);
                    gl.xr.addEventListener('sessionstart', handleSessionChange);
                    gl.xr.addEventListener('sessionend', handleSessionChange);
                },
                disconnect: () => {
                    const gl = this.read((s) => s.gl);
                    gl.xr.removeEventListener('sessionstart', handleSessionChange);
                    gl.xr.removeEventListener('sessionend', handleSessionChange);
                },
            };

            // Subscribe to WebXR session events
            if (gl.xr) xr.connect();
            this.write({ xr });
        }

        // Set shadowmap
        if (gl.shadowMap) {
            const isBoolean = typeof shadows === 'boolean';
            if ((isBoolean && gl.shadowMap.enabled !== shadows) || !is.equ(shadows, gl.shadowMap, shallowLoose)) {
                const old = gl.shadowMap.enabled;
                gl.shadowMap.enabled = !!shadows;
                if (!isBoolean) Object.assign(gl.shadowMap, shadows);
                else gl.shadowMap.type = THREE.PCFSoftShadowMap;

                if (old !== gl.shadowMap.enabled) checkNeedsUpdate(gl.shadowMap);
            }
        }

        // Safely set color management if available.
        // Avoid accessing THREE.ColorManagement to play nice with older versions
        if (is.supportColorManagement()) {
            THREE.ColorManagement.legacyMode = state.legacy;
        }
        const outputEncoding = linear ? THREE.LinearEncoding : THREE.sRGBEncoding;
        const toneMapping = flat ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
        if (gl.outputEncoding !== outputEncoding) gl.outputEncoding = outputEncoding;
        if (gl.toneMapping !== toneMapping) gl.toneMapping = toneMapping;

        // Update color management state
        if (state.legacy !== legacy) this.write({ legacy });
        if (state.linear !== linear) this.write({ linear });
        if (state.flat !== flat) this.write({ flat });

        // Set gl props
        gl.setClearAlpha(0);
        gl.setPixelRatio(makeDpr(state.viewport.dpr));
        gl.setSize(state.size.width, state.size.height, state.size.updateStyle);

        if (
            is.obj(glOptions) &&
            !(typeof glOptions === 'function') &&
            !is.glRenderer(glOptions) &&
            !is.equ(glOptions, gl, shallowLoose)
        ) {
            applyProps(gl, glOptions);
        }

        // Store events internally
        if (events && !state.events.handlers) {
            this.write({ events: events(this.read) });
        }

        // Check pixelratio
        if (dpr && state.viewport.dpr !== makeDpr(dpr)) {
            state.setDpr(dpr);
        }
        // Check size, allow it to take on container bounds initially
        const size = computeInitialSize(canvasElement, sizeOptions);
        if (!is.equ(size, state.size, shallowLoose)) {
            state.setSize(size.width, size.height, size.top, size.left);
        }

        // Check frameloop
        if (state.frameloop !== frameloop) state.setFrameloop(frameloop!);

        // Check performance
        if (performance && !is.equ(performance, state.performance, shallowLoose)) {
            this.write((state) => ({
                performance: { ...state.performance, ...performance },
            }));
        }

        this.write({ ready: true });
        this.resize(
            this.select(
                this.select((s) => s.size),
                this.select((s) => s.viewport.dpr),
                defaultProjector,
                { debounce: true }
            )
        );
        this.invalidate(this.select((s) => s, { debounce: true }));
        this.zone.run(() => {
            this.isConfigured = true;
        });
    }

    onReady(cb: Parameters<typeof tapEffect>[0]): Subscription {
        return this.effect(tapEffect(cb))(this.select((s) => s.ready).pipe(filterFalsy()));
    }
}

function computeInitialSize(canvas: HTMLCanvasElement | THREE.OffscreenCanvas, defaultSize?: NgtSize): NgtSize {
    if (defaultSize) {
        return defaultSize;
    }

    if (is.canvas(canvas) && canvas.parentElement) {
        const { width, height, top, left } = canvas.parentElement.getBoundingClientRect();

        return { width, height, top, left };
    }

    return { width: 0, height: 0, top: 0, left: 0 };
}

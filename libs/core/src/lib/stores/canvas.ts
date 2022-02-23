import { DOCUMENT } from '@angular/common';
import { ElementRef, Inject, Injectable } from '@angular/core';
import { filter, map, Observable, tap } from 'rxjs';
import * as THREE from 'three';
import { NGT_PERFORMANCE_OPTIONS } from '../di/performance';
import { WINDOW } from '../di/window';
import { NgtResize, NgtResizeResult } from '../services/resize';
import type {
    NgtCanvasState,
    NgtInstance,
    NgtPerformanceOptions,
    NgtRaycaster,
    NgtSize,
    NgtVector3,
    NgtViewport,
    UnknownRecord,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { calculateDpr } from '../utils/calculate-dpr';
import { isOrthographicCamera } from '../utils/is-orthographic';
import { NgtStore, tapEffect } from './store';

const position = new THREE.Vector3();
const defaultTarget = new THREE.Vector3();
const tempTarget = new THREE.Vector3();

@Injectable()
export class NgtCanvasStore extends NgtStore<NgtCanvasState> {
    readonly ready$ = this.select((s) => s.ready).pipe(
        filter((ready) => ready)
    );

    readonly camera$ = this.select((s) => s.camera);
    readonly scene$ = this.select((s) => s.scene);
    readonly renderer$ = this.select((s) => s.renderer);
    readonly raycaster$ = this.select((s) => s.raycaster);

    private allConstructed$ = this.select(
        this.camera$,
        this.scene$,
        this.renderer$,
        this.raycaster$,
        (camera, scene, renderer, raycaster) =>
            !!camera && !!renderer && !!scene && !!raycaster
    ).pipe(map((ready) => ({ ready })));

    private dimensions$ = this.select(
        this.select((s) => s.size),
        this.select((s) => s.viewport),
        (size, viewport) => ({ size, viewport })
    );

    constructor(
        @Inject(NGT_PERFORMANCE_OPTIONS) performance: NgtPerformanceOptions,
        {
            nativeElement: { clientHeight, clientWidth },
        }: ElementRef<HTMLElement>,
        @Inject(NgtResize)
        private resizeResult$: Observable<NgtResizeResult>,
        @Inject(DOCUMENT) document: Document,
        @Inject(WINDOW) window: Window
    ) {
        super();
        this.set({
            ready: false,
            vr: false,
            orthographic: false,
            flat: false,
            linear: false,
            size: {
                width: clientWidth,
                height: clientHeight,
            },
            mouse: new THREE.Vector2(),
            clock: new THREE.Clock(),
            frameloop: 'always',
            performance,
            objects: {},
            dpr: window.devicePixelRatio || 1,
            shadows: false,
            cameraOptions: {},
            glOptions: {},
            raycasterOptions: {},
            sceneOptions: {},
            viewport: {
                initialDpr: window.devicePixelRatio || 1,
                dpr: window.devicePixelRatio || 1,
                width: clientWidth,
                height: clientHeight,
                aspect: clientWidth / clientHeight,
                distance: 0,
                factor: 0,
                getCurrentViewport: (
                    camera,
                    target: NgtVector3 = defaultTarget,
                    size
                ) => {
                    const { camera: defaultCamera, size: defaultSize } =
                        this.get();
                    if (!camera) {
                        camera = defaultCamera!;
                    }

                    if (!size) {
                        size = defaultSize;
                    }

                    const { width, height } = size;
                    const aspect = width / height;
                    if (target instanceof THREE.Vector3)
                        tempTarget.copy(target);
                    else
                        tempTarget.set(...(target as [number, number, number]));
                    const distance = camera
                        .getWorldPosition(position)
                        .distanceTo(tempTarget);
                    if (isOrthographicCamera(camera)) {
                        return {
                            width: width / camera.zoom,
                            height: height / camera.zoom,
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
                        factor: width / w,
                        distance,
                        aspect,
                    };
                },
            },
            controls: null,
        });
    }

    readonly init = this.effect<HTMLCanvasElement>(
        tap((canvasElement) => {
            this.set(this.allConstructed$);
            this.updateDimensions(this.dimensions$);
            this.resize(this.resizeResult$);
            this.initRenderer(canvasElement);
        })
    );

    get isLinear() {
        return this.get((s) => s.linear);
    }

    private readonly resize = this.effect<NgtResizeResult>(
        tap(({ width, height, dpr }) => {
            this.set(({ viewport, camera }) => {
                const size = { width, height };
                return {
                    size,
                    viewport: {
                        ...viewport,
                        ...viewport.getCurrentViewport(
                            camera,
                            defaultTarget,
                            size
                        ),
                        dpr: calculateDpr(dpr),
                    },
                };
            });
        })
    );

    private readonly updateDimensions = this.effect<{
        size: NgtSize;
        viewport: NgtViewport;
    }>(
        tap(({ size, viewport }) => {
            const { camera, renderer, ready, cameraOptions } = this.get();
            if (ready) {
                // update renderer
                renderer.setPixelRatio(viewport.dpr);
                renderer.setSize(size.width, size.height);

                // leave the userland camera alone
                if (cameraOptions instanceof THREE.Camera) return;

                if (isOrthographicCamera(camera)) {
                    camera.left = size.width / -2;
                    camera.right = size.width / 2;
                    camera.top = size.height / 2;
                    camera.bottom = size.height / -2;
                } else {
                    camera.aspect = size.width / size.height;
                }

                camera.updateProjectionMatrix();
                // https://github.com/pmndrs/react-three-fiber/issues/178
                // Update matrix world since the renderer is a frame late
                camera.updateMatrixWorld();
            }
        })
    );

    private readonly initRenderer = this.effect<HTMLCanvasElement>(
        tapEffect((canvasElement: HTMLCanvasElement) => {
            const {
                size,
                viewport,
                vr,
                linear,
                flat,
                orthographic,
                shadows,
                glOptions,
                sceneOptions,
                cameraOptions,
                raycasterOptions,
            } = this.get();

            // Scene
            const scene = new THREE.Scene();
            applyProps(scene, sceneOptions as UnknownRecord);

            // Camera
            const isCamera = cameraOptions instanceof THREE.Camera;
            const camera = isCamera
                ? cameraOptions
                : orthographic
                ? new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 1000)
                : new THREE.PerspectiveCamera(
                      75,
                      size.width / size.height,
                      0.1,
                      1000
                  );

            if (!isCamera) {
                camera.position.z = 5;
                if (cameraOptions) {
                    applyProps(camera, cameraOptions as UnknownRecord);
                    // Update projection matrix after applying props
                    camera.updateProjectionMatrix();
                }
                // look at center if initial rotation isn't set
                if (!cameraOptions?.rotation) camera.lookAt(0, 0, 0);
            }

            // Raycaster
            const raycaster = new THREE.Raycaster();
            const { params, ...options } = raycasterOptions || {};
            applyProps(raycaster as unknown as NgtInstance, {
                enabled: true,
                ...options,
                params: { ...raycaster.params, ...(params || {}) },
            });

            // Renderer
            const customRenderer = (
                typeof glOptions === 'function'
                    ? glOptions(canvasElement)
                    : glOptions
            ) as THREE.WebGLRenderer;

            // userland custom renderer, assign as-is
            if (customRenderer?.render != null) {
                this.set({
                    renderer: customRenderer,
                    scene,
                    camera,
                    raycaster: raycaster as NgtRaycaster,
                });
            } else {
                const renderer = new THREE.WebGLRenderer({
                    powerPreference: 'high-performance',
                    canvas: canvasElement,
                    antialias: true,
                    alpha: true,
                    ...(glOptions || {}),
                });

                if (glOptions) {
                    applyProps(
                        renderer as unknown as NgtInstance,
                        glOptions as UnknownRecord
                    );
                }

                if (shadows) {
                    renderer.shadowMap.enabled = true;
                    if (typeof shadows === 'object') {
                        Object.assign(renderer.shadowMap, shadows);
                    } else {
                        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                    }
                }

                if (!linear) {
                    // auto color management
                    renderer.toneMapping = THREE.ACESFilmicToneMapping;
                    renderer.outputEncoding = THREE.sRGBEncoding;
                } else {
                    renderer.outputEncoding = THREE.LinearEncoding;
                }

                if (flat) {
                    renderer.toneMapping = THREE.NoToneMapping;
                }

                renderer.setClearAlpha(0);
                renderer.setPixelRatio(calculateDpr(viewport.dpr));
                renderer.setSize(size.width, size.height);

                if (vr) {
                    renderer.xr.enabled = true;
                }

                this.set({
                    renderer,
                    scene,
                    camera,
                    raycaster: raycaster as NgtRaycaster,
                });
            }

            return () => {
                const { renderer, vr } = this.get();
                if (renderer) {
                    renderer.renderLists.dispose();
                    renderer.forceContextLoss();

                    if (vr) {
                        renderer.setAnimationLoop(null);
                    }
                }
            };
        })
    );
}

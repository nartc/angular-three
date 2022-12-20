import { applyProps, NgtCamera, NgtSize } from '@angular-three/core';
import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { debounceTime, skip } from 'rxjs';
import * as THREE from 'three';
import { injectWindow } from './di/window';
import { createLoop } from './loop';
import type {
  NgtBeforeRenderCallback,
  NgtCanvasInputs,
  NgtDomEvent,
  NgtDpr,
  NgtEquConfig,
  NgtEventManager,
  NgtState,
  NgtViewport,
} from './types';
import { createDefaultCamera, updateCamera } from './utils/camera';
import { checkNeedsUpdate } from './utils/check-update';
import { createInject } from './utils/di';
import { is } from './utils/is';
import { makeDpr } from './utils/make';
import { prepare } from './utils/prepare';
import { createRenderer } from './utils/renderer';

export const rootStateMap = new Map<Element, RxState<NgtState>>();
const { invalidate, advance } = createLoop(rootStateMap);
const shallowLoose = { objects: 'shallow', strict: false } as NgtEquConfig;

@Injectable()
export class NgtStore extends RxState<NgtState> {
  private readonly parentStore = injectNgtStore({ optional: true, skipSelf: true });
  private readonly window = injectWindow();

  isInit = false;

  init() {
    if (!this.isInit) {
      const position = new THREE.Vector3();
      const defaultTarget = new THREE.Vector3();
      const tempTarget = new THREE.Vector3();

      const getCurrentViewport = (
        camera = this.get('camera'),
        target: THREE.Vector3 | Parameters<THREE.Vector3['set']> = defaultTarget,
        size = this.get('size')
      ): Omit<NgtViewport, 'dpr' | 'initialDpr'> => {
        const { width, height, top, left } = size;
        const aspect = width / height;
        if (target instanceof THREE.Vector3) tempTarget.copy(target);
        else tempTarget.set(...target);

        const distance = camera.getWorldPosition(position).distanceTo(tempTarget);

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

      const pointer = new THREE.Vector2();

      let performanceTimeout: ReturnType<typeof setTimeout>;

      const setPerformanceCurrent = (current: number) => {
        this.set((state) => ({ performance: { ...state.performance, current } }));
      };

      this.set({
        get: this.get.bind(this),
        set: this.set.bind(this),
        ready: false,
        scene: prepare<THREE.Scene>(new THREE.Scene(), { store: this, isThree: true }),

        events: { priority: 1, enabled: true, connected: false },

        invalidate: (frames = 1) => invalidate(this.get(), frames),
        advance: (timestamp: number, runGlobalEffects?: boolean) =>
          advance(timestamp, runGlobalEffects, this.get()),

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
            const state = this.get();
            // Clear timeout
            if (performanceTimeout) clearTimeout(performanceTimeout);
            // Set lower bound performance
            if (state.performance.current !== state.performance.min)
              setPerformanceCurrent(state.performance.min);
            // Go back to upper bound performance after a while unless something regresses meanwhile
            performanceTimeout = setTimeout(
              () => setPerformanceCurrent(this.get('performance', 'max') || 1),
              state.performance.debounce
            );
          },
        },
        size: {
          width: 0,
          height: 0,
          top: 0,
          left: 0,
          updateStyle: false,
        },
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
          getCurrentViewport,
        },
        previousStore: this.parentStore as RxState<NgtState>,
        internal: {
          active: false,
          priority: 0,
          frames: 0,
          lastEvent: null as unknown as NgtDomEvent,
          interaction: [],
          hovered: new Map(),
          subscribers: [],
          initialClick: [0, 0],
          initialHits: [],
          capturedMap: new Map(),

          subscribe: (
            callback: NgtBeforeRenderCallback,
            priority: number = 0,
            store: RxState<NgtState> = this,
            obj?: THREE.Object3D
          ) => {
            const internal = this.get('internal');
            // If this subscription was given a priority, it takes rendering into its own hands
            // For that reason we switch off automatic rendering and increase the manual flag
            // As long as this flag is positive there can be no internal rendering at all
            // because there could be multiple render subscriptions
            internal.priority = internal.priority + (priority > 0 ? 1 : 0);
            internal.subscribers.push({
              priority,
              store,
              callback,
              obj,
            });
            // Register subscriber and sort layers from lowest to highest, meaning,
            // highest priority renders last (on top of the other frames)
            internal.subscribers.sort((a, b) => (a.priority || 0) - (b.priority || 0));
            return () => {
              const internal = this.get('internal');
              if (internal?.subscribers) {
                // Decrease manual flag if this subscription had a priority
                internal.priority = internal.priority - (priority > 0 ? 1 : 0);
                // Remove subscriber from list
                internal.subscribers = internal.subscribers.filter((s) => s.callback !== callback);
              }
            };
          },
        },
        setEvents: (events: Partial<NgtEventManager<any>>) => {
          this.set((state) => ({ events: { ...state.events, ...events } }));
        },
        setSize: (
          width: number,
          height: number,
          top?: number,
          left?: number,
          updateStyle?: boolean
        ) => {
          const camera = this.get('camera');
          const size = {
            width,
            height,
            top: top || 0,
            left: left || 0,
            updateStyle,
          };
          this.set((state) => ({
            size,
            viewport: { ...state.viewport, ...getCurrentViewport(camera, defaultTarget, size) },
          }));
        },
        setDpr: (dpr: NgtDpr) => {
          this.set((state) => {
            const resolved = makeDpr(dpr, this.window);
            return {
              viewport: {
                ...state.viewport,
                dpr: resolved,
                initialDpr: state.viewport.initialDpr || resolved,
              },
            };
          });
        },
        setFrameloop: (frameloop: 'always' | 'demand' | 'never' = 'always') => {
          const clock = this.get('clock');
          clock.stop();
          clock.elapsedTime = 0;

          if (frameloop !== 'never') {
            clock.start();
            clock.elapsedTime = 0;
          }

          this.set({ frameloop });
        },
        addInteraction: (interaction: THREE.Object3D) => {
          this.set((state) => ({
            internal: {
              ...state.internal,
              interaction: [...state.internal.interaction, interaction],
            },
          }));
        },
        removeInteraction: (uuid: string) => {
          this.set((state) => ({
            internal: {
              ...state.internal,
              interaction: state.internal.interaction.filter(
                (interaction) => interaction.uuid !== uuid
              ),
            },
          }));
        },
      });
      this.isInit = true;

      this.resize();
      this.invalidate();
    }
  }

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

    const state = this.get();

    // Set up renderer (one time only!)
    let gl = state.gl;
    if (!state.gl) {
      this.set({ gl: (gl = createRenderer(glOptions, canvasElement)) });
    }

    // Set up raycaster (one time only!)
    let raycaster = state.raycaster;
    if (!raycaster) {
      this.set({ raycaster: (raycaster = new THREE.Raycaster()) });
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
      let camera = isCamera
        ? (cameraOptions as NgtCamera)
        : createDefaultCamera(orthographic || false, state.size);
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
        camera = prepare(camera, { isThree: true, store: this });
      }
      this.set({ camera });
    }

    // Set up XR (one time only!)
    if (!state.xr) {
      // Handle frame behavior in WebXR
      const handleXRFrame: XRFrameRequestCallback = (timestamp: number, frame?: XRFrame) => {
        const state = this.get();
        if (state.frameloop === 'never') return;
        advance(timestamp, true, this.get(), frame);
      };

      // Toggle render switching on session
      const handleSessionChange = () => {
        const state = this.get();
        state.gl.xr.enabled = state.gl.xr.isPresenting;

        state.gl.xr.setAnimationLoop(state.gl.xr.isPresenting ? handleXRFrame : null);
        if (!state.gl.xr.isPresenting) invalidate(this.get());
      };

      // WebXR session manager
      const xr = {
        connect: () => {
          const gl = this.get('gl');
          gl.xr.addEventListener('sessionstart', handleSessionChange);
          gl.xr.addEventListener('sessionend', handleSessionChange);
        },
        disconnect: () => {
          const gl = this.get('gl');
          gl.xr.removeEventListener('sessionstart', handleSessionChange);
          gl.xr.removeEventListener('sessionend', handleSessionChange);
        },
      };

      // Subscribe to WebXR session events
      if (gl.xr) xr.connect();
      this.set({ xr });
    }

    // Set shadowmap
    if (gl.shadowMap) {
      const isBoolean = typeof shadows === 'boolean';
      if (
        (isBoolean && gl.shadowMap.enabled !== shadows) ||
        !is.equ(shadows, gl.shadowMap, shallowLoose)
      ) {
        const old = gl.shadowMap.enabled;
        gl.shadowMap.enabled = !!shadows;
        if (!isBoolean) Object.assign(gl.shadowMap, shadows);
        else gl.shadowMap.type = THREE.PCFSoftShadowMap;

        if (old !== gl.shadowMap.enabled) checkNeedsUpdate(gl.shadowMap);
      }
    }

    // Safely set color management if available.
    // Avoid accessing THREE.ColorManagement to play nice with older versions
    if ('ColorManagement' in THREE) {
      THREE.ColorManagement.legacyMode = state.legacy;
    }
    const outputEncoding = linear ? THREE.LinearEncoding : THREE.sRGBEncoding;
    const toneMapping = flat ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
    if (gl.outputEncoding !== outputEncoding) gl.outputEncoding = outputEncoding;
    if (gl.toneMapping !== toneMapping) gl.toneMapping = toneMapping;

    // Update color management state
    if (state.legacy !== legacy) this.set({ legacy });
    if (state.linear !== linear) this.set({ linear });
    if (state.flat !== flat) this.set({ flat });

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
      this.set({ events: events(this) });
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
    if (state.frameloop !== frameloop) state.setFrameloop(frameloop);

    // Check performance
    if (performance && !is.equ(performance, state.performance, shallowLoose)) {
      this.set((state) => ({ performance: { ...state.performance, ...performance } }));
    }

    if (!this.get('ready')) {
      this.set({ ready: true });
    }
  }

  private resize() {
    const state = this.get();
    let oldSize = state.size;
    let oldDpr = state.viewport.dpr;
    let oldCamera = state.camera;
    this.hold(this.select(selectSlice(['camera', 'size', 'viewport', 'gl', 'set'])), () => {
      const { camera, size, viewport, gl, set } = this.get();

      // Resize camera and renderer on changes to size and pixelratio
      if (size !== oldSize || viewport.dpr !== oldDpr) {
        oldSize = size;
        oldDpr = viewport.dpr;
        // Update camera & renderer
        updateCamera(camera, size);
        gl.setPixelRatio(viewport.dpr);
        gl.setSize(size.width, size.height, size.updateStyle);
      }

      // Update viewport once the camera changes
      if (camera !== oldCamera) {
        oldCamera = camera;
        // Update viewport
        set((state) => ({
          viewport: { ...state.viewport, ...state.viewport.getCurrentViewport(camera) },
        }));
      }
    });
  }

  private invalidate() {
    this.hold(this.select().pipe(debounceTime(0), skip(1)), invalidate);
  }
}

export const injectNgtStore = createInject(NgtStore);

function computeInitialSize(
  canvas: HTMLCanvasElement | THREE.OffscreenCanvas,
  defaultSize?: NgtSize
): NgtSize {
  if (defaultSize) {
    return defaultSize;
  }

  if (is.canvas(canvas) && canvas.parentElement) {
    const { width, height, top, left } = canvas.parentElement.getBoundingClientRect();
    return { width, height, top, left };
  }

  return { width: 0, height: 0, top: 0, left: 0 };
}

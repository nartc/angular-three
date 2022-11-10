import { inject, Injectable, NgZone } from '@angular/core';
import { filter, Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { injectWindow } from '../di/window';
import { NgtRef } from '../ref';
import type {
  NgtBeforeRenderRecord,
  NgtCamera,
  NgtCanvasInputs,
  NgtDpr,
  NgtEquConfig,
  NgtEventManager,
  NgtState,
  NgtStateGetter,
  NgtUnknownRecord,
  NgtViewport,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { calculateDpr } from '../utils/calculate-dpr';
import { createDefaultCamera } from '../utils/camera';
import { checkNeedsUpdate } from '../utils/check-update';
import { computeInitialSize } from '../utils/compute-initial-size';
import { prepare } from '../utils/instance';
import { is } from '../utils/is';
import { makeId } from '../utils/make';
import { createRenderer } from '../utils/renderer';
import { NgtComponentStore } from './component-store';
import { tapEffect } from './tap-effect';

type NgtAnimationRecordWithUuid = NgtBeforeRenderRecord & { uuid: string };

const shallowLoose = { objects: 'shallow', strict: false } as NgtEquConfig;

@Injectable()
export class NgtStore extends NgtComponentStore<NgtState> {
  private readonly parentStore = inject(NgtStore, {
    optional: true,
    skipSelf: true,
  });
  private readonly zone = inject(NgZone);
  // private readonly resizeResult = inject(NgtResize);
  private readonly window = injectWindow();

  private readonly position = new THREE.Vector3();
  private readonly defaultTarget = new THREE.Vector3();
  private readonly tempTarget = new THREE.Vector3();

  get rootStateGetter(): NgtStateGetter {
    let root = this.getState((s) => s.previousRoot);
    while (root && root().previousRoot) {
      root = root().previousRoot;
    }

    return root || this.getState;
  }

  private readonly updateSubscribers = this.effect(
    tap(() => {
      const internal = this.getState((s) => s.internal);
      if (!internal.animations.size) return;
      const subscribers = Array.from(internal.animations.values());
      subscribers.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      this.set((state) => ({
        internal: { ...state.internal, subscribers },
      }));
    })
  );

  private readonly registerBeforeRenderEffect = this.effect<NgtAnimationRecordWithUuid>(
    tapEffect(({ uuid, ...record }) => {
      if (uuid) {
        this.set((state) => ({
          internal: {
            ...state.internal,
            animations: new Map(state.internal.animations).set(uuid, record),
            priority: state.internal.priority + ((record.priority || 0) > 0 ? 1 : 0),
          },
        }));
      }

      return ({ prev: { uuid: prevUuid } = {}, complete }) => {
        if (prevUuid !== uuid || complete) {
          this.unregisterBeforeRender(uuid);
        }
      };
    })
  );

  init(
    invalidate: (stateGetter?: NgtStateGetter, frames?: number) => void,
    advance: (timestamp: number, runGlobalCallbacks?: boolean, stateGetter?: NgtStateGetter, frame?: XRFrame) => void
  ) {
    const pointer = new THREE.Vector2();

    const scene = prepare(
      new THREE.Scene(),
      this.getState,
      this.rootStateGetter,
      this.parentStore?.get((s) => s.sceneRef)
    );

    let performanceTimeout: ReturnType<typeof setTimeout>;

    this.set({
      ready: false,
      cameraRef: new NgtRef(),
      scene,
      sceneRef: new NgtRef(scene as THREE.Scene),
      events: { priority: 1, enabled: true, connected: false },
      invalidate: (frames = 1) => invalidate(this.getState, frames),
      advance: (timestamp: number, runGlobalEffects?: boolean) => advance(timestamp, runGlobalEffects, this.getState),
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
            const state = this.getState();
            // Clear timeout
            if (performanceTimeout) clearTimeout(performanceTimeout);
            // Set lower bound performance
            if (state.performance.current !== state.performance.min) this.setPerformanceCurrent(state.performance.min);
            // Go back to upper bound performance after a while unless something regresses meanwhile
            performanceTimeout = setTimeout(
              () => this.setPerformanceCurrent(this.getState((s) => s.performance)?.max || 1),
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

      previousRoot: this.parentStore?.get.bind(this.parentStore),

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

    this.updateSubscribers(
      this.select(
        this.select((s) => s.internal.animations),
        this.select((s) => s.internal.priority),
        this.defaultProjector
      )
    );
  }

  configure(
    inputs: NgtCanvasInputs,
    canvasElement: HTMLCanvasElement,
    invalidate: (stateGetter?: NgtStateGetter, frames?: number) => void,
    advance: (timestamp: number, runGlobalCallbacks?: boolean, stateGetter?: NgtStateGetter, frame?: XRFrame) => void
  ) {
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

    const state = this.getState();

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
      let camera = isCamera ? (cameraOptions as NgtCamera) : createDefaultCamera(orthographic!, state.size);
      if (!isCamera) {
        if (cameraOptions) {
          applyProps(camera, cameraOptions as NgtUnknownRecord);
        }

        // Set position.z if position not passed in
        if (!cameraOptions?.position) {
          camera.position.z = 5;
        }

        // Always look at center or passed-in lookAt by default
        if (!cameraOptions?.rotation) {
          camera.lookAt(lookAt ?? new THREE.Vector3());
        }

        // Update projection matrix after applying props
        camera.updateProjectionMatrix();
      }

      if (!is.instance(camera)) {
        camera = prepare(
          camera,
          this.getState,
          this.rootStateGetter,
          this.parentStore?.get((s) => s.cameraRef)
        );
      }
      this.set({ camera });
      this.getState((s) => s.cameraRef).set(camera);
    }

    // Set up XR (one time only!)
    if (!state.xr) {
      // Handle frame behavior in WebXR
      const handleXRFrame: XRFrameRequestCallback = (timestamp: number, frame?: XRFrame) => {
        const state = this.getState();
        if (state.frameloop === 'never') return;
        advance(timestamp, true, this.get.bind(this), frame);
      };

      // Toggle render switching on session
      const handleSessionChange = () => {
        const state = this.getState();
        state.gl.xr.enabled = state.gl.xr.isPresenting;

        state.gl.xr.setAnimationLoop(state.gl.xr.isPresenting ? handleXRFrame : null);
        if (!state.gl.xr.isPresenting) invalidate(this.get.bind(this));
      };

      // WebXR session manager
      const xr = {
        connect: () => {
          const gl = this.getState((s) => s.gl);
          gl.xr.addEventListener('sessionstart', handleSessionChange);
          gl.xr.addEventListener('sessionend', handleSessionChange);
        },
        disconnect: () => {
          const gl = this.getState((s) => s.gl);
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
      (THREE as any)['ColorManagement'].legacyMode = state.legacy;
    }
    const outputEncoding = linear ? THREE.LinearEncoding : THREE.sRGBEncoding;
    const toneMapping = flat ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
    if (gl.outputEncoding !== outputEncoding) gl.outputEncoding = outputEncoding;
    if (gl.toneMapping !== toneMapping) gl.toneMapping = toneMapping;

    // Update color management state
    if (state.legacy !== legacy) this.set(() => ({ legacy }));
    if (state.linear !== linear) this.set(() => ({ linear }));
    if (state.flat !== flat) this.set(() => ({ flat }));

    // Set gl props
    gl.setClearAlpha(0);
    gl.setPixelRatio(calculateDpr(state.viewport.dpr));
    gl.setSize(state.size.width, state.size.height, state.size.updateStyle);

    if (
      is.obj(glOptions) &&
      !(typeof glOptions === 'function') &&
      !is.glRenderer(glOptions) &&
      !is.equ(glOptions, gl, shallowLoose)
    ) {
      applyProps(gl, glOptions as NgtUnknownRecord);
    }

    // Store events internally
    if (events && !state.events.handlers) {
      this.set({ events: events(this.getState) });
    }

    // Check pixelratio
    if (dpr && state.viewport.dpr !== calculateDpr(dpr)) {
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
      this.set((state) => ({
        performance: { ...state.performance, ...performance },
      }));
    }

    this.set({ ready: true });
  }

  registerBeforeRender(record: NgtBeforeRenderRecord) {
    const uuid = is.object3d(record.obj) ? record.obj.uuid : is.ref(record.obj) ? record.obj.value.uuid : makeId();
    this.registerBeforeRenderEffect({ ...record, uuid });
    return () => {
      this.unregisterBeforeRender(uuid);
    };
  }

  unregisterBeforeRender(uuid: string) {
    if (!uuid) return;
    const currentAnimations = this.getState((s) => s.internal.animations);
    const record = currentAnimations.get(uuid);
    const deleted = currentAnimations.delete(uuid);
    if (deleted && record) {
      this.set((state) => ({
        internal: {
          ...state.internal,
          animations: currentAnimations,
          priority: state.internal.priority - ((record.priority || 0) > 0 ? 1 : 0),
        },
      }));
    }
  }

  onReady(cb: Parameters<typeof tapEffect>[0]): Subscription {
    return this.effect(tapEffect(cb))(this.select((s) => s.ready).pipe(filter((ready) => ready)));
  }

  startLoop() {
    // start render
    this.set((s) => ({ internal: { ...s.internal, active: true } }));
    this.effect<NgtState>(
      tap(({ invalidate }) => {
        invalidate();
      })
    )(this.select((s) => s, { debounce: true }));
  }

  destroy(rootStateMap: Map<Element, NgtStateGetter>, canvasElement: HTMLCanvasElement) {
    this.set((state) => ({
      internal: { ...state.internal, active: false },
    }));

    setTimeout(() => {
      const { gl, xr, cameraRef, sceneRef, events } = this.getState();
      if (gl) {
        if (events.disconnect) {
          events.disconnect();
        }

        gl.renderLists.dispose();
        gl.forceContextLoss();

        if (gl.xr && gl.xr.enabled) {
          gl.xr.setAnimationLoop(null);
          xr.disconnect();
        }

        cameraRef.complete();
        sceneRef.complete();

        dispose(this.getState());

        rootStateMap.delete(canvasElement);
      }
    }, 500);
  }

  private readonly addInteraction = (interaction: THREE.Object3D) => {
    this.set((state) => ({
      ...state,
      internal: {
        ...state.internal,
        interaction: [...state.internal.interaction, interaction],
      },
    }));
  };

  private readonly removeInteraction = (uuid: string) => {
    this.set((state) => ({
      ...state,
      internal: {
        ...state.internal,
        interaction: state.internal.interaction.filter((interaction) => interaction.uuid !== uuid),
      },
    }));
  };

  private readonly setPerformanceCurrent = (current: number) => {
    this.set((s) => ({ performance: { ...s.performance, current } }));
  };

  private readonly setEvents = (events: Partial<NgtEventManager<any>>) => {
    this.set((s) => ({ events: { ...s.events, ...events } }));
  };

  private readonly setSize = (width: number, height: number, top?: number, left?: number, updateStyle?: boolean) => {
    const camera = this.getState((s) => s.camera);
    const size = { width, height, top: top || 0, left: left || 0, updateStyle };

    this.set((state) => ({
      size,
      viewport: {
        ...state.viewport,
        ...this.getCurrentViewport(camera, this.defaultTarget, size),
      },
    }));
  };

  private readonly setCamera = (camera: NgtCamera) => {
    this.set((s) => ({
      camera,
      viewport: {
        ...s.viewport,
        ...this.getCurrentViewport(camera),
      },
    }));
    this.getState((s) => s.cameraRef).set(camera);
  };

  private readonly setDpr = (dpr: NgtDpr) => {
    const resolved = calculateDpr(dpr, this.window);
    this.set((s) => ({
      viewport: {
        ...s.viewport,
        dpr: resolved,
        initialDpr: s.viewport.initialDpr || resolved,
      },
    }));
  };

  private readonly setFrameloop = (frameloop: 'always' | 'demand' | 'never' = 'always') => {
    const clock = this.getState((s) => s.clock);

    // if frameloop === "never" clock.elapsedTime is updated using advance(timestamp)
    clock.stop();
    clock.elapsedTime = 0;

    if (frameloop !== 'never') {
      clock.start();
      clock.elapsedTime = 0;
    }

    this.set({ frameloop });
  };

  private readonly getCurrentViewport = (
    camera = this.getState((s) => s.camera),
    target: THREE.Vector3 | Parameters<THREE.Vector3['set']> = this.defaultTarget,
    size = this.getState((s) => s.size)
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
}

// Disposes an object and all its properties
function dispose<TObj extends { dispose?: () => void; type?: string; [key: string]: any }>(obj: TObj) {
  if (obj.dispose && !is.scene(obj)) obj.dispose();
  for (const p in obj) {
    (p as any).dispose?.();
    delete obj[p];
  }
}

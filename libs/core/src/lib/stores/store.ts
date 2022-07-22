import { ElementRef, Inject, Injectable, NgZone, Optional, SkipSelf } from '@angular/core';
import { filter, Observable, Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { NGT_PERFORMANCE_OPTIONS } from '../di/performance';
import { WINDOW } from '../di/window';
import { Ref } from '../ref';
import { NgtResize, NgtResizeResult } from '../services/resize';
import type {
  EquConfig,
  NgtBeforeRenderRecord,
  NgtCamera,
  NgtEvents,
  NgtGLOptions,
  NgtPerformanceOptions,
  NgtState,
  NgtUnknownInstance,
  UnknownRecord,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { createDefaultCamera, updateCamera } from '../utils/camera';
import { checkNeedsUpdate } from '../utils/check-needs-update';
import { createEvents } from '../utils/events';
import { prepare } from '../utils/instance';
import { is } from '../utils/is';
import { makeDpr, makeId, makeVector3 } from '../utils/make';
import { NgtComponentStore, tapEffect } from './component-store';

type NgtAnimationRecordWithUuid = NgtBeforeRenderRecord & { uuid: string };

const DOM_EVENTS = {
  click: false,
  contextmenu: false,
  dblclick: false,
  wheel: false, // passive wheel errors with OrbitControls
  pointerdown: true,
  pointerup: true,
  pointerleave: true,
  pointermove: true,
  pointercancel: true,
  lostpointercapture: true,
} as const;

const shallowLoose = { objects: 'shallow', strict: false } as EquConfig;

@Injectable()
export class NgtStore extends NgtComponentStore<NgtState> {
  readonly #pointer = new THREE.Vector2();
  readonly #position = new THREE.Vector3();
  readonly #defaultTarget = new THREE.Vector3();
  readonly #tempTarget = new THREE.Vector3();

  readonly ready$ = this.select((s) => s.ready).pipe(filter((ready) => ready));

  readonly #allConstructed$ = this.select(
    this.select((s) => s.camera),
    this.select((s) => s.scene),
    this.select((s) => s.gl),
    this.select((s) => s.raycaster),
    this.select((s) => s.internal.active),
    (camera, scene, gl, raycaster, active) => ({ ready: !!camera && !!gl && !!scene && !!raycaster && active === true })
  );

  #performanceTimeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

  readonly #dimensions$ = this.select(
    this.select((s) => s.size),
    this.select((s) => s.viewport)
  );

  constructor(
    { nativeElement: { clientWidth, clientHeight } }: ElementRef<HTMLElement>,
    @Inject(NGT_PERFORMANCE_OPTIONS)
    performanceOptions: NgtPerformanceOptions,
    @Inject(WINDOW) { devicePixelRatio }: Window,
    @Optional() @SkipSelf() private parentStore: NgtStore,
    @Inject(NgtResize) private resizeResult$: Observable<NgtResizeResult>,
    private zone: NgZone
  ) {
    super();
    this.set({
      ready: false,
      clock: new THREE.Clock(),
      frameloop: 'always',
      legacy: false,
      linear: false,
      flat: false,
      orthographic: false,
      shadows: false,
      controls: null,
      pointer: this.#pointer,
      mouse: this.#pointer,
      sceneRef: new Ref(),
      cameraRef: new Ref(),
      events: {
        priority: 1,
        enabled: true,
        connected: undefined,
        handlers: {} as NgtEvents,
        compute: (event, state) => {
          // https://github.com/pmndrs/react-three-fiber/pull/782
          // Events trigger outside of canvas when moved, use offsetX/Y by default and allow overrides
          state.pointer.set((event.offsetX / state.size.width) * 2 - 1, -(event.offsetY / state.size.height) * 2 + 1);
          state.raycaster.setFromCamera(state.pointer, state.camera);
        },
      },
      cameraOptions: {},
      glOptions: {},
      raycasterOptions: {},
      sceneOptions: {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      pointerMissed: () => {},
      internal: {
        active: false,
        lastEvent: null,
        priority: 0,
        frames: 0,
        interaction: [],
        hovered: new Map(),
        subscribers: [],
        initialClick: [0, 0],
        initialHits: [],
        capturedMap: new Map(),
        animations: new Map(),
      },
      dpr: [1, 2],
      size: {
        width: clientWidth,
        height: clientHeight,
      },
      viewport: {
        initialDpr: devicePixelRatio || 1,
        dpr: devicePixelRatio || 1,
        width: clientWidth,
        height: clientHeight,
        aspect: clientWidth / clientHeight,
        distance: 0,
        factor: 0,
        getCurrentViewport: (
          camera = this.get((s) => s.camera),
          target: THREE.Vector3 | Parameters<THREE.Vector3['set']> = this.#defaultTarget,
          size = this.get((s) => s.size)
        ) => {
          const { width, height } = size;
          const aspect = width / height;
          if (target instanceof THREE.Vector3) this.#tempTarget.copy(target);
          else this.#tempTarget.set(...target);
          const distance = camera.getWorldPosition(this.#position).distanceTo(this.#tempTarget);
          if (is.orthographic(camera)) {
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
      performance: {
        ...performanceOptions,
        regress: () => {
          this.zone.runOutsideAngular(() => {
            const performance = this.get((s) => s.performance);
            // Clear timeout
            if (this.#performanceTimeoutId) clearTimeout(this.#performanceTimeoutId);
            // Set lower bound performance
            if (performance.current !== performance.min) {
              this.set((state) => ({
                performance: {
                  ...state.performance,
                  current: performance.min,
                },
              }));
            }
            // Go back to upper bound performance after a while unless something regresses meanwhile
            this.#performanceTimeoutId = setTimeout(
              () =>
                this.set((state) => ({
                  performance: {
                    ...state.performance,
                    current: this.get((s) => s.performance.max),
                  },
                })),
              performance.debounce
            );
          });
        },
      },
      previousState: parentStore?.get(),
    });
  }

  init(
    canvasElement: HTMLCanvasElement,
    rootStateMap: Map<Element, () => NgtState>,
    invalidate: (state?: () => NgtState, frames?: number) => void,
    advance: (timestamp: number, runGlobalCallbacks?: boolean, state?: () => NgtState, frame?: XRFrame) => void
  ) {
    this.#initEvents(canvasElement);
    this.#resize(this.resizeResult$);
    this.#updateDimensions(this.#dimensions$);
    this.#initRenderer({ canvasElement, rootStateMap, advance, invalidate });
    this.#updateSubscribers(
      this.select(
        this.select((s) => s.internal.animations),
        this.select((s) => s.internal.priority)
      )
    );
    this.set((state) => ({
      invalidate: () => invalidate(this.get.bind(this)),
      advance: (timestamp, runGlobalCallbacks) => advance(timestamp, runGlobalCallbacks, this.get.bind(this)),
      internal: { ...state.internal, active: true },
    }));
    this.set(this.#allConstructed$);
  }

  onReady(cb: Parameters<typeof tapEffect>[0]): Subscription {
    return this.effect(tapEffect(cb))(this.ready$);
  }

  registerBeforeRender(record: NgtBeforeRenderRecord) {
    const uuid = is.object3d(record.obj) ? record.obj.uuid : is.ref(record.obj) ? record.obj.value.uuid : makeId();
    this.#registerBeforeRenderEffect({ ...record, uuid });
    return () => {
      this.unregisterBeforeRender(uuid);
    };
  }

  unregisterBeforeRender(uuid: string) {
    if (!uuid) return;
    const currentAnimations = this.get((s) => s.internal.animations);
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

  addInteraction(interaction: THREE.Object3D) {
    this.set((state) => ({
      ...state,
      internal: {
        ...state.internal,
        interaction: [...state.internal.interaction, interaction],
      },
    }));
  }

  removeInteraction(uuid: string) {
    this.set((state) => ({
      ...state,
      internal: {
        ...state.internal,
        interaction: state.internal.interaction.filter((interaction) => interaction.uuid !== uuid),
      },
    }));
  }

  setFrameloop(frameloop: NgtState['frameloop'] = 'always') {
    const clock = this.get((s) => s.clock);

    // if frameloop === "never" clock.elapsedTime is updated using advance(timestamp)
    clock.stop();
    clock.elapsedTime = 0;

    if (frameloop !== 'never') {
      clock.start();
      clock.elapsedTime = 0;
    }
    this.set({ frameloop });
  }

  setDpr(dpr: NgtState['dpr']) {
    const resolved = makeDpr(dpr);
    this.set(({ viewport }) => ({
      dpr: resolved,
      viewport: {
        ...viewport,
        dpr: resolved,
        initialDpr: viewport.initialDpr || resolved,
      },
    }));
  }

  readonly startLoop = this.effect<NgtState>(
    tap(({ invalidate }) => {
      invalidate();
    })
  );

  readonly #initRenderer = this.effect<{
    canvasElement: HTMLCanvasElement;
    rootStateMap: Map<Element, () => NgtState>;
    advance: (timestamp: number, runGlobalCallbacks?: boolean, state?: () => NgtState, frame?: XRFrame) => void;
    invalidate: (state?: () => NgtState, frames?: number) => void;
  }>(
    tapEffect(({ canvasElement, rootStateMap, advance, invalidate }) => {
      const state = this.get();

      // Scene
      const scene = prepare(
        new THREE.Scene(),
        () => this.get(),
        this.parentStore?.get((s) => s.sceneRef)
      );
      applyProps(scene, state.sceneOptions);
      this.get((s) => s.sceneRef).set(scene);

      // Set up renderer (one time only!)
      let gl = state.gl;
      if (!state.gl) {
        gl = createRenderer(state.glOptions, canvasElement);
      }
      this.set({ gl });

      // Set up raycaster (one time only!)
      let raycaster = state.raycaster;
      if (!state.raycaster) {
        raycaster = new THREE.Raycaster();
      }
      // Set raycaster options
      const { params, ...options } = state.raycasterOptions || {};
      if (!is.equ(options, raycaster, shallowLoose)) applyProps(raycaster, { ...options });
      if (!is.equ(params, raycaster.params, shallowLoose))
        applyProps(raycaster, {
          params: { ...raycaster.params, ...(params || {}) },
        });

      // Create default camera (one time only!)
      let camera = state.camera;
      if (!state.camera) {
        const isCamera = is.camera(state.cameraOptions);
        camera = isCamera ? (state.cameraOptions as NgtCamera) : createDefaultCamera(state);
        if (!isCamera) {
          if (state.cameraOptions) {
            applyProps(camera, state.cameraOptions as UnknownRecord);
          }

          // Set position.z if position not passed in
          if (!state.cameraOptions?.position) {
            camera.position.z = 5;
          }

          // Always look at center by default
          if (!state.cameraOptions?.rotation) {
            camera.lookAt(state.lookAt ?? makeVector3());
          }

          // Update projection matrix after applying props
          camera.updateProjectionMatrix();
        }

        if (!is.instance(camera)) {
          camera = prepare(
            camera,
            () => this.get(),
            this.parentStore?.get((s) => s.cameraRef)
          );
        }
        this.get((s) => s.cameraRef).set(camera as NgtUnknownInstance<NgtCamera>);
      }

      // Set up XR (one time only!)
      let xr = state.xr;
      if (!state.xr) {
        // Handle frame behavior in WebXR
        const handleXRFrame: XRFrameRequestCallback = (timestamp: number, frame?: XRFrame) => {
          const state = this.get();
          if (state.frameloop === 'never') return;
          advance(timestamp, true, this.get.bind(this), frame);
        };

        // Toggle render switching on session
        const handleSessionChange = () => {
          const gl = this.get((s) => s.gl);
          gl.xr.enabled = gl.xr.isPresenting;
          // WebXRManager's signature is incorrect.
          // See: https://github.com/pmndrs/react-three-fiber/pull/2017#discussion_r790134505
          gl.xr.setAnimationLoop(gl.xr.isPresenting ? handleXRFrame : null);
          if (!gl.xr.isPresenting) invalidate(this.get.bind(this));
        };

        // WebXR session manager
        xr = {
          connect: () => {
            const gl = this.get((s) => s.gl);
            gl.xr.addEventListener('sessionstart', handleSessionChange);
            gl.xr.addEventListener('sessionend', handleSessionChange);
          },
          disconnect: () => {
            const gl = this.get((s) => s.gl);
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
        const isBoolean = is.boo(state.shadows);
        if (
          (isBoolean && gl.shadowMap.enabled !== state.shadows) ||
          !is.equ(state.shadows, gl.shadowMap, shallowLoose)
        ) {
          const old = gl.shadowMap.enabled;
          gl.shadowMap.enabled = !!state.shadows;
          if (!isBoolean) Object.assign(gl.shadowMap, state.shadows);
          else gl.shadowMap.type = THREE.PCFSoftShadowMap;

          if (old !== gl.shadowMap.enabled) checkNeedsUpdate(gl.shadowMap);
        }
      }

      // Set color management
      // Safely set color management if available.
      // Avoid accessing THREE.ColorManagement to play nice with older versions
      if ('ColorManagement' in THREE) {
        (THREE as any)['ColorManagement'].legacyMode = state.legacy;
      }
      const outputEncoding = state.linear ? THREE.LinearEncoding : THREE.sRGBEncoding;
      const toneMapping = state.flat ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
      if (gl.outputEncoding !== outputEncoding) gl.outputEncoding = outputEncoding;
      if (gl.toneMapping !== toneMapping) gl.toneMapping = toneMapping;

      gl.setClearAlpha(0);
      gl.setPixelRatio(makeDpr(state.viewport.dpr));
      gl.setSize(state.size.width, state.size.height);

      if (is.obj(state.glOptions) && !is.fun(state.glOptions) && !is.glRenderer(state.glOptions)) {
        applyProps(gl, state.glOptions as UnknownRecord);
      }

      this.set({ gl, camera, scene, raycaster });

      return () => {
        const { gl, xr, cameraRef, sceneRef, events } = this.get();
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

          this.set((state) => ({
            ...state,
            internal: { ...state.internal, active: false },
          }));

          rootStateMap.delete(canvasElement);
        }
      };
    })
  );

  readonly #resize = this.effect<NgtResizeResult>(
    tap(({ width, height, dpr }) => {
      this.set(({ viewport, camera }) => {
        const size = { width, height };
        return {
          size,
          viewport: {
            ...viewport,
            ...viewport.getCurrentViewport(camera, this.#defaultTarget, size),
            dpr: makeDpr(dpr),
          },
        };
      });
    })
  );

  readonly #updateDimensions = this.effect(
    tap(() => {
      const { camera, gl, ready, cameraOptions, size, viewport } = this.get();
      if (ready) {
        updateCamera(cameraOptions, camera, size);

        // update renderer
        gl.setPixelRatio(viewport.dpr);
        gl.setSize(size.width, size.height);
      }
    })
  );

  readonly #registerBeforeRenderEffect = this.effect<NgtAnimationRecordWithUuid>(
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

  readonly #updateSubscribers = this.effect(
    tap(() => {
      const internal = this.get((s) => s.internal);
      if (!internal.animations.size) return;
      const subscribers = Array.from(internal.animations.values());
      subscribers.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      this.set((state) => ({
        internal: { ...state.internal, subscribers },
      }));
    })
  );

  #initEvents(canvasElement: HTMLCanvasElement) {
    const { handlePointer } = createEvents(() => this.get());

    this.set((state) => ({
      events: {
        ...state.events,
        handlers: Object.keys(DOM_EVENTS).reduce((handlers: UnknownRecord, supportedEventName) => {
          handlers[supportedEventName] = handlePointer(supportedEventName);
          return handlers;
        }, {}) as NgtEvents,
      },
    }));

    this.#connectElement(canvasElement);
  }

  #connectElement(canvasElement: HTMLCanvasElement) {
    this.set((state) => ({
      events: { ...state.events, connected: canvasElement },
    }));
    const handlers = this.get((s) => s.events.handlers);
    Object.entries(handlers ?? {}).forEach(([eventName, handler]) => {
      const passive = DOM_EVENTS[eventName as keyof typeof DOM_EVENTS];
      canvasElement.addEventListener(eventName, handler, { passive });
    });
  }

  #disconnectElement() {
    const { handlers, connected } = this.get((s) => s.events);
    if (connected) {
      Object.entries(handlers ?? {}).forEach(([eventName, handler]) => {
        if (connected instanceof HTMLElement) {
          connected.removeEventListener(eventName, handler);
        }
      });
    }
  }

  override ngOnDestroy() {
    this.#disconnectElement();
    super.ngOnDestroy();
  }
}

function createRenderer(glOptions: NgtGLOptions, canvasElement: HTMLCanvasElement): THREE.WebGLRenderer {
  const customRenderer = (
    typeof glOptions === 'function' ? glOptions(canvasElement) : glOptions
  ) as THREE.WebGLRenderer;

  if (customRenderer?.render != null) {
    return customRenderer;
  }

  return new THREE.WebGLRenderer({
    powerPreference: 'high-performance',
    canvas: canvasElement,
    antialias: true,
    alpha: true,
    ...glOptions,
  });
}

import { Inject, Injectable, NgZone } from '@angular/core';
import { Observable, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import {
  NgtCamera,
  NgtInstance,
  NgtRaycaster,
  NgtSize,
  NgtState,
  UnknownRecord,
} from '../models';
import { NgtResize, NgtResizeResult } from '../resize/resize.service';
import { applyProps } from '../utils/apply-props';
import { calculateDpr } from '../utils/calculate-dpr';
import { isOrthographicCamera } from '../utils/is-orthographic';
import { NgtCanvasInputsStore } from './canvas-inputs.store';
import { EnhancedComponentStore, tapEffect } from './enhanced-component-store';

const position = new THREE.Vector3();
const defaultTarget = new THREE.Vector3();

@Injectable()
export class NgtStore extends EnhancedComponentStore<NgtState> {
  readonly #sizeResult$ = this.select(
    this.resizeResult$,
    ({ width, height }) => ({
      width,
      height,
    }),
    { debounce: true }
  );

  readonly #dprResult$ = this.select(
    this.resizeResult$,
    this.selectors.viewport$,
    ({ dpr }, viewport) => ({ ...viewport, dpr }),
    { debounce: true }
  );

  readonly #allReady$ = this.select(
    this.selectors.scene$,
    this.selectors.camera$,
    this.selectors.renderer$,
    this.selectors.raycaster$,
    (scene, camera, renderer, raycaster) =>
      !!scene && !!camera && !!renderer && !!raycaster,
    { debounce: true }
  );

  readonly #dimensions$ = this.select(
    this.selectors.size$,
    this.selectors.viewport$,
    (size, viewport) => ({ size, viewport }),
    { debounce: true }
  );

  constructor(
    @Inject(NgtResize)
    private resizeResult$: Observable<NgtResizeResult>,
    private canvasInputsStore: NgtCanvasInputsStore,
    private ngZone: NgZone
  ) {
    super({
      ready: false,
      size: canvasInputsStore.getImperativeState().size,
      mouse: new THREE.Vector2(),
      clock: canvasInputsStore.getImperativeState().clock,
      frameloop: canvasInputsStore.getImperativeState().frameloop,
      vr: canvasInputsStore.getImperativeState().vr,
      linear: canvasInputsStore.getImperativeState().linear,
      viewport: {
        initialDpr: calculateDpr(canvasInputsStore.getImperativeState().dpr),
        dpr: calculateDpr(canvasInputsStore.getImperativeState().dpr),
        width: 0,
        height: 0,
        aspect: 0,
        distance: 0,
        factor: 0,
        getCurrentViewport: (
          camera = this.getImperativeState().camera,
          target = defaultTarget,
          size = this.getImperativeState().size
        ) => {
          const { width, height } = size;
          const aspect = width / height;
          const distance = camera!
            .getWorldPosition(position)
            .distanceTo(target);
          if (isOrthographicCamera(camera!)) {
            return {
              width: width / camera.zoom,
              height: height / camera.zoom,
              factor: 1,
              distance,
              aspect,
            };
          }

          const fov = (camera!.fov * Math.PI) / 180; // convert vertical fov to radians
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
      camera: undefined,
      raycaster: undefined,
      renderer: undefined,
      scene: undefined,
    });
  }

  readonly init = this.effect<HTMLCanvasElement>((canvas$) =>
    canvas$.pipe(
      tapEffect((canvasElement) => {
        this.ngZone.runOutsideAngular(() => {
          this.updaters.setReady(this.#allReady$);
          this.updaters.setSize(this.#sizeResult$);
          this.updaters.setViewport(this.#dprResult$);
          this.updaters.setFrameloop(
            this.canvasInputsStore.selectors.frameloop$
          );
          this.updaters.setVr(this.canvasInputsStore.selectors.vr$);
          this.updaters.setLinear(this.canvasInputsStore.selectors.linear$);

          this.initRenderer(canvasElement);
          this.initScene();
          this.initCamera();
          this.initRaycaster();

          this.updateDimensions(this.#dimensions$);
        });

        return () => {
          const renderer = this.getImperativeState().renderer;
          if (renderer) {
            renderer.renderLists.dispose();
            renderer.forceContextLoss();
          }
        };
      })
    )
  );

  readonly initRenderer = this.effect<HTMLCanvasElement>((canvas$) =>
    canvas$.pipe(
      withLatestFrom(
        this.selectors.size$,
        this.selectors.viewport$,
        this.canvasInputsStore.selectors.linear$,
        this.canvasInputsStore.selectors.flat$,
        this.canvasInputsStore.selectors.shadows$,
        this.canvasInputsStore.selectors.glOptions$
      ),
      tap(([canvas, size, { dpr }, linear, flat, shadows, glOptions]) => {
        this.ngZone.runOutsideAngular(() => {
          const customRenderer = (
            typeof glOptions === 'function' ? glOptions(canvas) : glOptions
          ) as THREE.WebGLRenderer;

          // userland custom renderer. assign as-is
          if (!!customRenderer?.render) {
            this.patchState({ renderer: customRenderer });
            return;
          }

          const renderer = new THREE.WebGLRenderer({
            powerPreference: 'high-performance',
            canvas: canvas,
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
            if (typeof shadows === 'object')
              Object.assign(renderer.shadowMap, shadows);
            else renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
          renderer.setPixelRatio(calculateDpr(dpr));
          renderer.setSize(size.width, size.height);

          this.patchState({ renderer });
        });
      })
    )
  );

  readonly initScene = this.effect(($) =>
    $.pipe(
      withLatestFrom(this.canvasInputsStore.selectors.sceneOptions$),
      tap(([, sceneOptions]) => {
        this.ngZone.runOutsideAngular(() => {
          const scene = new THREE.Scene();
          applyProps(scene, sceneOptions as UnknownRecord);
          this.patchState({ scene });
        });
      })
    )
  );

  readonly initCamera = this.effect(($) =>
    $.pipe(
      withLatestFrom(
        this.canvasInputsStore.selectors.cameraOptions$,
        this.canvasInputsStore.selectors.orthographic$,
        this.selectors.size$
      ),
      tap(([, cameraOptions, orthographic, size]) => {
        this.ngZone.runOutsideAngular(() => {
          const isCamera = cameraOptions instanceof THREE.Camera;
          const camera = isCamera
            ? (cameraOptions as THREE.Camera)
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
              (camera as NgtCamera).updateProjectionMatrix();
            }
            if (!cameraOptions?.rotation) camera.lookAt(0, 0, 0);
          }

          this.patchState({ camera: camera as NgtCamera });
        });
      })
    )
  );

  readonly initRaycaster = this.effect(($) =>
    $.pipe(
      withLatestFrom(this.canvasInputsStore.selectors.raycaster$),
      tap(([, raycastOptions]) => {
        this.ngZone.runOutsideAngular(() => {
          const raycaster = new THREE.Raycaster();
          const { params, ...options } = raycastOptions || {};
          applyProps(raycaster as unknown as NgtInstance, {
            enabled: true,
            ...options,
            params: { ...raycaster.params, ...params },
          });

          this.patchState({ raycaster: raycaster as NgtRaycaster });
        });
      })
    )
  );

  readonly updateDimensions = this.effect<{
    size: NgtSize;
    viewport: NgtState['viewport'];
  }>((dimensions$) =>
    dimensions$.pipe(
      withLatestFrom(
        this.selectors.camera$,
        this.selectors.renderer$,
        this.selectors.ready$,
        this.canvasInputsStore.selectors.cameraOptions$
      ),
      tap(
        ([
          {
            viewport: { dpr },
            size,
          },
          camera,
          renderer,
          ready,
          cameraOptions,
        ]) => {
          this.ngZone.runOutsideAngular(() => {
            // leave the userland camera alone
            if (cameraOptions instanceof THREE.Camera) return;

            // only update when the scene graph is ready
            if (ready && camera && renderer) {
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

              // Update renderer
              renderer.setPixelRatio(dpr);
              renderer.setSize(size.width, size.height);
            }
          });
        }
      )
    )
  );
}

import { Injectable, OnDestroy } from '@angular/core';
import { combineLatest, filter, mapTo, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import type {
  CanvasStoreState,
  NgtCamera,
  NgtCameraOptions,
  NgtInstance,
  NgtRaycaster,
  NgtRaycasterOptions,
  NgtSceneOptions,
  NgtSize,
  UnknownRecord,
} from '../models';
import { applyProps } from '../utils/apply-props.util';
import { EnhancedComponentStore } from './enhanced-component-store.abstract';

interface WindowResizeEffectParams {
  size: NgtSize;
  dpr: number;
}

const position = new THREE.Vector3();
const defaultTarget = new THREE.Vector3();

export const isOrthographicCamera = (
  value: THREE.Camera
): value is THREE.OrthographicCamera =>
  value && (value as THREE.OrthographicCamera).isOrthographicCamera;

@Injectable()
export class CanvasStore
  extends EnhancedComponentStore<CanvasStoreState>
  implements OnDestroy
{
  constructor() {
    super({
      isOrthographic: false,
      isLinear: false,
      shadows: false,
      alpha: true,
      mouse: new THREE.Vector2(),
      clock: new THREE.Clock(),
      renderer: undefined,
      scene: undefined,
      camera: undefined,
      raycaster: undefined,
      internal: {
        active: false,
        size: { width: 0, height: 0 },
        dpr: 1,
        viewport: {
          initialDpr: 1,
          dpr: 1,
          width: 0,
          height: 0,
          aspect: 0,
          distance: 0,
          factor: 0,
          getCurrentViewport: (
            camera = this.getImperativeState().camera,
            target = defaultTarget,
            size = this.getImperativeState().internal.size
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
      },
    });

    this.setActive(
      combineLatest([
        this.selectors.renderer$,
        this.selectors.camera$,
        this.selectors.scene$,
        this.selectors.raycaster$,
      ]).pipe(
        filter((coreObjects) => coreObjects.every(Boolean)),
        mapTo(true)
      )
    );
  }

  readonly setSize = this.updater<NgtSize>((state, size) => ({
    ...state,
    internal: { ...state.internal, size },
  }));

  readonly setDpr = this.updater<number>((state, dpr) => ({
    ...state,
    internal: { ...state.internal, dpr },
  }));

  readonly setViewport = this.updater((state) => ({
    ...state,
    internal: {
      ...state.internal,
      viewport: {
        ...state.internal.viewport,
        ...state.internal.viewport.getCurrentViewport(
          state.camera,
          defaultTarget,
          state.internal.size
        ),
        dpr: state.internal.dpr,
      },
    },
  }));

  readonly setActive = this.updater<boolean>((state, active) => ({
    ...state,
    internal: { ...state.internal, active },
  }));

  readonly initRendererEffect = this.effect<HTMLCanvasElement>((canvas$) => {
    return canvas$.pipe(
      withLatestFrom(
        this.selectors.internal$,
        this.selectors.isLinear$,
        this.selectors.shadows$,
        this.selectors.alpha$
      ),
      tap(([canvas, { size, dpr }, isLinear, shadows, alpha]) => {
        // TODO: custom renderer
        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          powerPreference: 'high-performance',
          alpha,
        });

        if (shadows) {
          renderer.shadowMap.enabled = true;
          if (typeof shadows === 'object')
            Object.assign(renderer.shadowMap, shadows);
          else renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        if (!isLinear) {
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.outputEncoding = THREE.sRGBEncoding;
        } else {
          renderer.outputEncoding = THREE.LinearEncoding;
        }

        renderer.setClearAlpha(0);
        renderer.setPixelRatio(dpr);
        renderer.setSize(size.width, size.height);

        this.patchState({ renderer });
      })
    );
  });

  readonly initSceneEffect = this.effect<NgtSceneOptions | undefined>(
    (sceneOptions$) =>
      sceneOptions$.pipe(
        tap((sceneOptions) => {
          const scene = new THREE.Scene();
          applyProps(scene, sceneOptions as UnknownRecord);
          this.patchState({ scene });
        })
      )
  );

  readonly initCameraEffect = this.effect<NgtCameraOptions | undefined>(
    (cameraOptions$) =>
      cameraOptions$.pipe(
        withLatestFrom(
          this.selectors.isOrthographic$,
          this.selectors.internal$
        ),
        tap(([cameraOptions, isOrthographic, { size }]) => {
          const isCamera = cameraOptions instanceof THREE.Camera;
          let camera: NgtCamera;

          if (isCamera) {
            camera = cameraOptions as NgtCamera;
          } else {
            if (isOrthographic) {
              camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 1000);
              camera.zoom = 100;
            } else {
              camera = new THREE.PerspectiveCamera(
                75,
                size.width / size.height ?? 0,
                0.1,
                1000
              );
            }

            camera.position.z = 5;

            applyProps(camera, cameraOptions as UnknownRecord);
            // Update projection matrix after applying props
            camera.updateProjectionMatrix();
          }

          // look at center by default
          camera.lookAt(0, 0, 0);

          this.patchState({ camera });
          this.setViewport();
        })
      )
  );

  readonly initRaycasterEffect = this.effect<NgtRaycasterOptions | undefined>(
    (raycasterOptions$) =>
      raycasterOptions$.pipe(
        tap((raycasterOptions) => {
          const raycaster = new THREE.Raycaster() as NgtRaycaster;
          raycaster.enabled = true;
          applyProps(
            raycaster as unknown as NgtInstance,
            raycasterOptions as UnknownRecord
          );
          this.patchState({ raycaster });
        })
      )
  );

  readonly windowResizeEffect = this.effect<WindowResizeEffectParams>(
    (params$) =>
      params$.pipe(
        withLatestFrom(this.selectors.renderer$, this.selectors.camera$),
        tap(([{ dpr, size }, renderer, camera]) => {
          if (renderer && camera) {
            if (camera.type === 'PerspectiveCamera') {
              camera.aspect = size.width / size.height;
            } else {
              camera.left = size.width / -2;
              camera.right = size.width / 2;
              camera.top = size.height / 2;
              camera.bottom = size.height / -2;
            }
            camera.updateProjectionMatrix();
            camera.updateMatrixWorld();

            renderer.setPixelRatio(dpr);
            renderer.setSize(size.width, size.height);
            this.setSize(size);
            this.setDpr(dpr);
            this.setViewport();
          }
        })
      )
  );

  readonly cleanUpEffect = this.effect(($) =>
    $.pipe(
      withLatestFrom(this.selectors.renderer$),
      tap(([, renderer]) => {
        if (renderer) {
          renderer.renderLists.dispose();
          renderer.forceContextLoss();
        }
      })
    )
  );

  ngOnDestroy() {
    this.cleanUpEffect();
    super.ngOnDestroy();
  }
}

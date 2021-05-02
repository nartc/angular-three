import { Injectable, OnDestroy } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, mapTo, tap, withLatestFrom } from 'rxjs/operators';
import {
  ACESFilmicToneMapping,
  Camera,
  Clock,
  OrthographicCamera,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  sRGBEncoding,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLShadowMap,
} from 'three';
import type {
  CameraOptions,
  CanvasInternal,
  CanvasStoreState,
  RaycasterOptions,
  SceneOptions,
  Size,
  ThreeCameraAlias,
  ThreeInstance,
  ThreeRaycaster,
  UnknownRecord,
} from '../typings';
import { applyProps } from '../utils';
import { ImperativeComponentStore } from './imperative-component-store.abstract';

interface WindowResizeEffectParams {
  size: Size;
  dpr: number;
}

const position = new Vector3();
const defaultTarget = new Vector3();

export const isOrthographicCamera = (def: Camera): def is OrthographicCamera =>
  def && (def as OrthographicCamera).isOrthographicCamera;

@Injectable()
export class CanvasStore
  extends ImperativeComponentStore<CanvasStoreState>
  implements OnDestroy {
  readonly renderer$ = this.select((s) => s.renderer);
  readonly camera$ = this.select((s) => s.camera);
  readonly scene$ = this.select((s) => s.scene);
  readonly raycaster$ = this.select((s) => s.raycaster);

  readonly isOrthographic$ = this.select((s) => s.isOrthographic);
  readonly isLinear$ = this.select((s) => s.isLinear);
  readonly shadows$ = this.select((s) => s.shadows);
  readonly active$ = this.select((s) => s.internal.active);
  readonly canvasInternal$ = this.select((s) => s.internal);

  constructor() {
    super({
      isOrthographic: false,
      isLinear: false,
      shadows: false,
      mouse: new Vector2(),
      clock: new Clock(),
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
        this.renderer$,
        this.camera$,
        this.scene$,
        this.raycaster$,
      ]).pipe(
        filter((coreObjects) => coreObjects.every(Boolean)),
        mapTo(true)
      )
    );
  }

  readonly setIsOrthographic = this.updater<boolean>(
    (state, isOrthographic) => ({ ...state, isOrthographic })
  );
  readonly setIsLinear = this.updater<boolean>((state, isLinear) => ({
    ...state,
    isLinear,
  }));
  readonly setShadows = this.updater<boolean | Partial<WebGLShadowMap>>(
    (state, shadows) => ({
      ...state,
      shadows,
    })
  );
  readonly setSize = this.updater<Size>((state, size) => ({
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
      withLatestFrom(this.canvasInternal$, this.isLinear$, this.shadows$),
      tap(
        ([canvas, { size, dpr }, isLinear, shadows]: [
          HTMLCanvasElement,
          CanvasInternal,
          boolean,
          boolean | Partial<WebGLShadowMap>
        ]) => {
          const renderer = new WebGLRenderer({
            canvas,
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true,
          });

          if (shadows) {
            renderer.shadowMap.enabled = true;
            if (typeof shadows === 'object')
              Object.assign(renderer.shadowMap, shadows);
            else renderer.shadowMap.type = PCFSoftShadowMap;
          }

          if (!isLinear) {
            renderer.toneMapping = ACESFilmicToneMapping;
            renderer.outputEncoding = sRGBEncoding;
          }

          renderer.setClearAlpha(0);
          renderer.setPixelRatio(dpr);
          renderer.setSize(size.width, size.height);

          this.patchState({ renderer });
        }
      )
    );
  });

  readonly initSceneEffect = this.effect<SceneOptions | undefined>(
    (sceneOptions$) =>
      sceneOptions$.pipe(
        tap((sceneOptions: SceneOptions | undefined) => {
          const scene = new Scene();
          applyProps(scene, sceneOptions as UnknownRecord);
          this.patchState({ scene });
        })
      )
  );

  readonly initCameraEffect = this.effect<CameraOptions | undefined>(
    (cameraOptions$) =>
      cameraOptions$.pipe(
        withLatestFrom(this.isOrthographic$, this.canvasInternal$),
        tap(
          ([cameraOptions, isOrthographic, { size }]: [
            CameraOptions | undefined,
            boolean,
            CanvasInternal
          ]) => {
            const isCamera = cameraOptions instanceof Camera;
            let camera: ThreeCameraAlias;

            if (isCamera) {
              camera = cameraOptions as ThreeCameraAlias;
            } else {
              if (isOrthographic) {
                camera = new OrthographicCamera(0, 0, 0, 0, 0.1, 1000);
                camera.zoom = 100;
              } else {
                camera = new PerspectiveCamera(
                  75,
                  size.width / size.height ?? 0,
                  0.1,
                  1000
                );
              }

              camera.position.z = 5;

              applyProps(camera, cameraOptions as UnknownRecord);
            }

            // look at center by default
            camera.lookAt(0, 0, 0);

            this.patchState({ camera });
            this.setViewport();
          }
        )
      )
  );

  readonly initRaycasterEffect = this.effect<RaycasterOptions | undefined>(
    (raycasterOptions$) =>
      raycasterOptions$.pipe(
        tap((raycasterOptions: RaycasterOptions | undefined) => {
          const raycaster = new Raycaster() as ThreeRaycaster;
          raycaster.enabled = true;
          applyProps(
            (raycaster as unknown) as ThreeInstance,
            raycasterOptions as UnknownRecord
          );
          this.patchState({ raycaster });
        })
      )
  );

  readonly windowResizeEffect = this.effect<WindowResizeEffectParams>(
    (params$) =>
      params$.pipe(
        withLatestFrom(
          this.renderer$ as Observable<WebGLRenderer>,
          this.camera$ as Observable<ThreeCameraAlias>
        ),
        tap(
          ([{ dpr, size }, renderer, camera]: [
            WindowResizeEffectParams,
            WebGLRenderer,
            ThreeCameraAlias
          ]) => {
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
        )
      )
  );

  ngOnDestroy() {
    const { renderer } = this.getImperativeState();
    if (renderer) {
      renderer.renderLists.dispose();
      renderer.forceContextLoss();
    }
    super.ngOnDestroy();
  }
}

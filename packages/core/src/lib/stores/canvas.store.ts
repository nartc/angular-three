import type {
  CameraOptions,
  CanvasInternal,
  CanvasStoreState,
  RaycasterOptions,
  SceneOptions,
  Size,
  ThreeCamera,
  ThreeInstance,
  ThreeRaycaster,
  UnknownRecord,
} from '@angular-three/core/typings';
import { Injectable } from '@angular/core';
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
  WebGLRenderer,
  WebGLShadowMap,
} from 'three';
import { applyProps } from '../utils';
import { ImperativeComponentStore } from './imperative-component-store.abstract';

interface WindowResizeEffectParams {
  size: Size;
  dpr: number;
}

@Injectable()
export class CanvasStore extends ImperativeComponentStore<CanvasStoreState> {
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
  readonly setShadows = this.updater<boolean | Partial<THREE.WebGLShadowMap>>(
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
            let camera: ThreeCamera;

            if (isCamera) {
              camera = cameraOptions as ThreeCamera;
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
          this.camera$ as Observable<ThreeCamera>
        ),
        tap(
          ([{ dpr, size }, renderer, camera]: [
            WindowResizeEffectParams,
            WebGLRenderer,
            ThreeCamera
          ]) => {
            if (camera.type === 'PerspectiveCamera') {
              camera.aspect = size.width / size.height;
            }
            camera.updateProjectionMatrix();
            camera.updateMatrixWorld();

            renderer.setSize(size.width, size.height);
            renderer.setPixelRatio(dpr);
            this.setSize(size);
            this.setDpr(dpr);
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

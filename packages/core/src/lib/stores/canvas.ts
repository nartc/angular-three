import { ElementRef, Inject, Injectable } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { map, Observable } from 'rxjs';
import * as THREE from 'three';
import { NGT_PERFORMANCE_OPTIONS } from '../di/performance';
import { NgtResize, NgtResizeResult } from '../services/resize';
import type {
  NgtCanvasState,
  NgtInstance,
  NgtPerformanceOptions,
  NgtRaycaster,
  NgtSize,
  NgtViewport,
  UnknownRecord,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { calculateDpr } from '../utils/calculate-dpr';
import { isOrthographicCamera } from '../utils/is-orthographic';
import { zonelessRequestAnimationFrame } from '../utils/zoneless-timer';
import { NgtStore } from './store';

const position = new THREE.Vector3();
const defaultTarget = new THREE.Vector3();

@Injectable()
export class NgtCanvasStore extends NgtStore<NgtCanvasState> {
  private allConstructed$ = this.select(
    selectSlice(['scene', 'camera', 'renderer', 'raycaster']),
    map(
      ({ camera, renderer, scene, raycaster }) =>
        !!camera && !!renderer && !!scene && !!raycaster
    )
  );

  private dimensions$ = this.select(selectSlice(['size', 'viewport']));

  constructor(
    @Inject(NGT_PERFORMANCE_OPTIONS) performance: NgtPerformanceOptions,
    { nativeElement: { clientHeight, clientWidth } }: ElementRef<HTMLElement>,
    @Inject(NgtResize)
    private resizeResult$: Observable<NgtResizeResult>
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
      dpr: 1,
      shadows: false,
      cameraOptions: {},
      glOptions: {},
      raycasterOptions: {},
      sceneOptions: {},
      viewport: {
        initialDpr: 1,
        dpr: 1,
        width: clientWidth,
        height: clientHeight,
        aspect: clientWidth / clientHeight,
        distance: 0,
        factor: 0,
        getCurrentViewport: (camera, target = defaultTarget, size) => {
          const { camera: defaultCamera, size: defaultSize } = this.get();
          if (!camera) {
            camera = defaultCamera!;
          }

          if (!size) {
            size = defaultSize;
          }

          const { width, height } = size;
          const aspect = width / height;
          const distance = camera!
            .getWorldDirection(position)
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
          const h = 2 * Math.tan(fov / 2) * distance; // height of viewport
          const w = h * aspect; // width of viewport
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

  init(canvasElement: HTMLCanvasElement) {
    this.connect('ready', this.allConstructed$);
    this.hold(this.dimensions$, this.updateDimensions);
    this.hold(this.resizeResult$, ({ height, width, dpr }) => {
      const viewport = this.get('viewport');
      this.set({
        size: { width, height },
        viewport: { ...viewport, dpr },
      });
    });

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
      : new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);

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
      typeof glOptions === 'function' ? glOptions(canvasElement) : glOptions
    ) as THREE.WebGLRenderer;

    // userland custom renderer, assign as-is
    if (!!customRenderer?.render) {
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
  }

  override ngOnDestroy() {
    zonelessRequestAnimationFrame(() => {
      const { renderer, vr } = this.get();
      if (renderer) {
        renderer.renderLists.dispose();
        renderer.forceContextLoss();

        if (vr) {
          renderer.setAnimationLoop(null);
        }
      }
    });
    super.ngOnDestroy();
  }

  private updateDimensions = ({
    size,
    viewport,
  }: {
    size: NgtSize;
    viewport: NgtViewport;
  }) => {
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
  };
}

import {
  createInjectionToken,
  extend,
  getLocalState,
  injectNgtRef,
  injectNgtStore,
  NgtAnyRecord,
  NgtRef,
  NgtRxStore,
} from '@angular-three/core';
import { shaderMaterial } from '@angular-three/soba/shaders';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Directive, inject, Input } from '@angular/core';
import { RxActionFactory } from '@rx-angular/state/actions';
import { combineLatest } from 'rxjs';
import * as THREE from 'three';
import { Group, Mesh, PlaneGeometry } from 'three';
import { ProgressiveLightMap } from './progressive-light-map';

const SoftShadowMaterial = shaderMaterial(
  {
    color: new THREE.Color(),
    blend: 2.0,
    alphaTest: 0.75,
    opacity: 0,
    map: null,
  },
  `varying vec2 vUv;
   void main() {
     gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
     vUv = uv;
   }`,
  `varying vec2 vUv;
   uniform sampler2D map;
   uniform vec3 color;
   uniform float opacity;
   uniform float alphaTest;
   uniform float blend;
   void main() {
     vec4 sampledDiffuseColor = texture2D(map, vUv);
     gl_FragColor = vec4(color * sampledDiffuseColor.r * blend, max(0.0, (1.0 - (sampledDiffuseColor.r + sampledDiffuseColor.g + sampledDiffuseColor.b) / alphaTest)) * opacity);
     #include <tonemapping_fragment>
     #include <encodings_fragment>
   }`
);

type SoftShadowMaterialProps = {
  map: THREE.Texture;
  color?: THREE.ColorRepresentation;
  alphaTest?: number;
  blend?: number;
};

interface NgtsAccumulativeApi {
  lights: Map<any, any>;
  temporal: boolean;
  frames: number;
  blend: number;
  count: number;
  /** Returns the plane geometry onto which the shadow is cast */
  getMesh: () => THREE.Mesh<THREE.PlaneGeometry, SoftShadowMaterialProps & THREE.ShaderMaterial>;
  /** Resets the buffers, starting from scratch */
  reset: () => void;
  /** Updates the lightmap for a number of frames accumulartively */
  update: (frames?: number) => void;
}

export const [injectNgtsAccumulativeApi, provideNgtsAccumulativeApi] =
  createInjectionToken<NgtsAccumulativeApi>('NgtsAccumulativeShadows API');

function accumulativeApiFactory(shadows: NgtsAccumulativeShadows) {
  const store = injectNgtStore();
  const actions = inject(RxActionFactory<{ setBeforeRender: void }>).create();

  const api = {
    lights: new Map(),
    count: 0,
    getMesh: () =>
      shadows.meshRef.nativeElement as THREE.Mesh<
        THREE.PlaneGeometry,
        SoftShadowMaterialProps & THREE.ShaderMaterial
      >,
    reset: () => {
      shadows.pLM.clear();
      const material = shadows.meshRef.nativeElement.material as NgtAnyRecord;
      material['opacity'] = 0;
      material['alphaTest'] = 0;
      api.count = 0;
    },
    update: (frames = 1) => {
      // Adapt the opacity-blend ratio to the number of frames
      const material = shadows.meshRef.nativeElement.material as SoftShadowMaterialProps &
        THREE.ShaderMaterial;
      if (!api.temporal) {
        material.opacity = shadows.get('opacity');
        material.alphaTest = shadows.get('alphaTest');
      } else {
        material.opacity = Math.min(
          shadows.get('opacity'),
          material.opacity + shadows.get('opacity') / api.blend
        );
        material.alphaTest = Math.min(
          shadows.get('alphaTest'),
          material.alphaTest + shadows.get('alphaTest') / api.blend
        );
      }

      // Switch accumulative lights on
      shadows.groupRef.nativeElement.visible = true;
      // Collect scene lights and meshes
      shadows.pLM.prepare();

      // Update the lightmap and the accumulative lights
      for (let i = 0; i < frames; i++) {
        api.lights.forEach((light) => light.update());
        shadows.pLM.update(store.get('camera'), api.blend);
      }
      // Switch lights off
      shadows.groupRef.nativeElement.visible = false;
      // Restore lights and meshes
      shadows.pLM.finish();
    },
  } as NgtsAccumulativeApi;

  Object.defineProperty(api, 'temporal', {
    get: () => !!shadows.get('temporal'),
  });
  Object.defineProperty(api, 'frames', {
    get: () => Math.max(2, shadows.get('frames')),
  });
  Object.defineProperty(api, 'blend', {
    get: () =>
      Math.max(
        2,
        shadows.get('frames') === Infinity ? shadows.get('blend') : shadows.get('frames')
      ),
  });

  shadows.pLM.configure(shadows.meshRef.nativeElement);

  shadows.hold(
    combineLatest([shadows.select(), getLocalState(store.get('scene'))!.objects]),
    () => {
      // Reset internals, buffers, ...
      api.reset();
      // Update lightmap
      if (!api.temporal && api.frames !== Infinity) api.update(api.blend);
    }
  );

  shadows.effect(actions.setBeforeRender$, () =>
    store.get('internal').subscribe(() => {
      const limit = shadows.get('limit');
      if (
        (api.temporal || api.frames === Infinity) &&
        api.count < api.frames &&
        api.count < limit
      ) {
        api.update();
        api.count++;
      }
    })
  );
  actions.setBeforeRender();

  return api as NgtsAccumulativeApi;
}

extend({ SoftShadowMaterial, Group, Mesh, PlaneGeometry });

@Directive({
  selector: 'ngts-accumulative-shadows-consumer',
  standalone: true,
})
export class AccumulativeShadowsConsumer {
  readonly #api = injectNgtsAccumulativeApi();
}

@Component({
  selector: 'ngts-accumulative-shadows',
  standalone: true,
  template: `
    <ngt-group ngtCompound>
      <ngt-group *ref="groupRef" [traverse]="nullTraverse">
        <ng-content></ng-content>
        <ngts-accumulative-shadows-consumer></ngts-accumulative-shadows-consumer>
      </ngt-group>
      <ngt-mesh
        *ref="meshRef"
        receiveShadow
        [scale]="get('scale')"
        [rotation]="[-Math.PI / 2, 0, 0]"
      >
        <ngt-plane-geometry></ngt-plane-geometry>
        <ngt-soft-shadow-material
          transparent
          [depthWrite]="false"
          [color]="get('color')"
          [toneMapped]="get('toneMapped')"
          [blend]="get('colorBlend')"
          [map]="pLM.progressiveLightMap2.texture"
        ></ngt-soft-shadow-material>
      </ngt-mesh>
    </ngt-group>
  `,
  imports: [NgtRef, AccumulativeShadowsConsumer],
  providers: [
    RxActionFactory,
    provideNgtsAccumulativeApi([NgtsAccumulativeShadows], accumulativeApiFactory),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsAccumulativeShadows extends NgtRxStore {
  readonly nullTraverse = () => null;
  readonly Math = Math;

  readonly #store = injectNgtStore();

  readonly pLM = new ProgressiveLightMap(
    this.#store.get('gl'),
    this.#store.get('scene'),
    this.get('resolution')
  );

  readonly groupRef = injectNgtRef<Group>();
  readonly meshRef = injectNgtRef<Mesh>();

  /** How many frames it can render, more yields cleaner results but takes more time, 40 */
  @Input() set frames(frames: number) {
    this.set({ frames });
  }

  /** If frames === Infinity blend controls the refresh ratio, 100 */
  @Input() set blend(blend: number) {
    this.set({ blend });
  }

  /** Can limit the amount of frames rendered if frames === Infinity, usually to get some performance back once a movable scene has settled, Infinity */
  @Input() set limit(limit: number) {
    this.set({ limit });
  }

  /** Scale of the plane,  */
  @Input() set scale(scale: number) {
    this.set({ scale });
  }

  /** Temporal accumulates shadows over time which is more performant but has a visual regression over instant results, false  */
  @Input() set temporal(temporal: boolean) {
    this.set({ temporal });
  }

  /** Opacity of the plane, 1 */
  @Input() set opacity(opacity: number) {
    this.set({ opacity });
  }

  /** Discards alpha pixels, 0.65 */
  @Input() set alphaTest(alphaTest: number) {
    this.set({ alphaTest });
  }

  /** Shadow color, black */
  @Input() set color(color: string) {
    this.set({ color });
  }

  /** Colorblend, how much colors turn to black, 0 is black, 2 */
  @Input() set colorBlend(colorBlend: number) {
    this.set({ colorBlend });
  }

  /** Buffer resolution, 1024 */
  @Input() set resolution(resolution: number) {
    this.set({ resolution });
  }

  /** Texture tonemapping */
  @Input() set toneMapped(toneMapped: boolean) {
    this.set({ toneMapped });
  }

  override initialize(): void {
    super.initialize();
    this.set({
      frames: 40,
      limit: Infinity,
      blend: 20,
      scale: 10,
      opacity: 1,
      alphaTest: 0.75,
      color: 'black',
      colorBlend: 2,
      resolution: 1024,
      toneMapped: true,
    });
  }
}

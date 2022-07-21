import {
  AnyFunction,
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  is,
  NGT_INSTANCE_HOST_REF,
  NGT_INSTANCE_REF,
  NgtComponentStore,
  NgtInstance,
  NgtInstanceState,
  NgtLoader,
  NgtPortalModule,
  NgtSidePipeModule,
  NgtStore,
  NumberInput,
  prepare,
  Ref,
  startWithUndefined,
  tapEffect,
} from '@angular-three/core';
import { NgtCubeCameraModule } from '@angular-three/core/cameras';
import { NgtIcosahedronGeometryModule } from '@angular-three/core/geometries';
import { NgtShaderMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Inject,
  Injectable,
  Input,
  NgModule,
  NgZone,
  Optional,
  Self,
  SkipSelf,
  TemplateRef,
} from '@angular/core';
import {
  animationFrameScheduler,
  filter,
  isObservable,
  Observable,
  observeOn,
  of,
  pipe,
  startWith,
  Subscription,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import * as THREE from 'three/src/Three';
import { RGBELoader } from 'three-stdlib';
import { presetsObj, PresetsType } from './presets';

const fragmentShader =
  // language=glsl
  `
#define ENVMAP_TYPE_CUBE_UV

varying vec3 vWorldPosition;

uniform float radius;
uniform float height;

#ifdef ENVMAP_TYPE_CUBE
  uniform samplerCube cubemap;
#else
  uniform sampler2D cubemap;
#endif

// From: https://www.iquilezles.org/www/articles/intersectors/intersectors.htm
float diskIntersect( in vec3 ro, in vec3 rd, vec3 c, vec3 n, float r ) {
    vec3  o = ro - c;
    float t = -dot(n, o)/dot(rd,n);
    vec3  q = o + rd * t;
    return (dot(q, q) < r * r) ? t : 1e6;
}

// From: https://www.iquilezles.org/www/articles/intersectors/intersectors.htm
float sphereIntersect( in vec3 ro, in vec3 rd, in vec3 ce, float ra ) {
    vec3 oc = ro - ce;
    float b = dot( oc, rd );
    float c = dot( oc, oc ) - ra*ra;
    float h = b * b - c;
    if(h < 0.0) -1.0;
    h = sqrt( h );
    return -b + h;
}

vec3 project() {
  vec3 p = normalize(vWorldPosition);
  vec3 camPos = cameraPosition;
  camPos.y -= height;

  float intersection = sphereIntersect(camPos, p, vec3(0.), radius);
  if(intersection > 0.) {
    vec3 h = vec3(0.0,-height,0.0);
    float intersection2 = diskIntersect(camPos, p, h, vec3(0.0,-1.0,0.0), radius);
    p = (camPos + min(intersection, intersection2) * p) / radius;
  }
  else {
    p = vec3(0.0,1.0,0.0);
  }
  return p;
}

#include <common>
#include <cube_uv_reflection_fragment>

void main(){
  vec3 projectedWorldPosition = project();

  #ifdef ENVMAP_TYPE_CUBE
    vec3 outcolor = textureCube(cubemap, projectedWorldPosition).rgb;
  #else
    vec3 direction = normalize(projectedWorldPosition);
    vec2 uv = equirectUv(direction);
    vec3 outcolor = texture2D(cubemap, uv).rgb;
  #endif

  gl_FragColor = vec4(outcolor, 1.0);

  #include <tonemapping_fragment>
  #include <encodings_fragment>
}`;

const vertexShader =
  // language=glsl
  `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const CUBEMAP_ROOT = 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/';

const isCubeTexture = (def: unknown): def is THREE.CubeTexture => !!def && (def as THREE.CubeTexture).isCubeTexture;
function resolveScene(scene: THREE.Scene | Ref<THREE.Scene>): THREE.Scene {
  return is.ref(scene) ? scene.value : scene;
}

export interface NgtSobaEnvironmentGenericState<T extends object = {}> extends NgtInstanceState<T> {
  frames?: number;
  near?: number;
  far?: number;
  resolution?: number;
  background?: boolean | 'only';
  map?: THREE.Texture;
  files?: string | string[];
  path?: string;
  preset?: PresetsType;
  scene?: THREE.Scene | Ref<THREE.Scene>;
  extensions?: (loader: THREE.Loader) => void;
  ground?:
    | boolean
    | {
        radius?: number;
        height?: number;
        scale?: number;
      };
}

@Directive()
export abstract class NgtSobaEnvironmentGeneric<T extends object = {}> extends NgtInstance<
  T,
  NgtSobaEnvironmentGenericState<T>
> {
  get frames() {
    return this.get((s) => s.frames);
  }
  @Input() set frames(frames: NumberInput) {
    this.set({ frames: coerceNumberProperty(frames) });
  }

  get near() {
    return this.get((s) => s.near);
  }
  @Input() set near(near: NumberInput) {
    this.set({ near: coerceNumberProperty(near) });
  }

  get far() {
    return this.get((s) => s.far);
  }
  @Input() set far(far: NumberInput) {
    this.set({ far: coerceNumberProperty(far) });
  }

  get resolution() {
    return this.get((s) => s.resolution);
  }
  @Input() set resolution(resolution: NumberInput) {
    this.set({ resolution: coerceNumberProperty(resolution) });
  }

  get background() {
    return this.get((s) => s.background);
  }
  @Input() set background(background: BooleanInput | 'only') {
    this.set({
      background: background === 'only' ? background : coerceBooleanProperty(background),
    });
  }

  get map() {
    return this.get((s) => s.map) as THREE.Texture;
  }
  @Input() set map(map: THREE.Texture) {
    this.set({ map });
  }

  get files() {
    return this.get((s) => s.files) as string | string[];
  }
  @Input() set files(files: string | string[]) {
    this.set({ files });
  }

  get path() {
    return this.get((s) => s.path) as string;
  }
  @Input() set path(path: string) {
    this.set({ path });
  }

  get preset() {
    return this.get((s) => s.preset) as PresetsType;
  }
  @Input() set preset(preset: PresetsType) {
    this.set({ preset });
  }

  get scene() {
    return this.get((s) => s.scene) as THREE.Scene | Ref<THREE.Scene>;
  }
  @Input() set scene(scene: THREE.Scene | Ref<THREE.Scene>) {
    this.set({ scene });
  }

  get extensions() {
    return this.get((s) => s.extensions) as (loader: THREE.Loader) => void;
  }
  @Input() set extensions(extensions: (loader: THREE.Loader) => void) {
    this.set({ extensions });
  }

  get ground() {
    return this.get((s) => s.ground);
  }
  @Input() set ground(
    ground:
      | BooleanInput
      | {
          radius?: number;
          height?: number;
          scale?: number;
        }
  ) {
    this.set({
      ground: is.obj(ground) ? ground : coerceBooleanProperty(ground),
    });
  }
}

@Directive({
  selector: '[ngtSobaEnvironmentPassThrough]',
})
export class NgtSobaEnvironmentPassThrough {
  @Input() set ngtSobaEnvironmentPassThrough(wrapper: unknown) {
    this.assertWrapper(wrapper);

    wrapper
      .select(
        wrapper.select((s) => s.frames).pipe(startWithUndefined()),
        wrapper.select((s) => s.near).pipe(startWithUndefined()),
        wrapper.select((s) => s.far).pipe(startWithUndefined()),
        wrapper.select((s) => s.resolution).pipe(startWithUndefined()),
        wrapper.select((s) => s.background).pipe(startWithUndefined()),
        wrapper.select((s) => s.map).pipe(startWithUndefined()),
        wrapper.select((s) => s.files).pipe(startWithUndefined()),
        wrapper.select((s) => s.path).pipe(startWithUndefined()),
        wrapper.select((s) => s.preset).pipe(startWithUndefined()),
        wrapper.select((s) => s.scene).pipe(startWithUndefined()),
        wrapper.select((s) => s.extensions).pipe(startWithUndefined()),
        wrapper.select((s) => s.ground).pipe(startWithUndefined())
      )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.frames = wrapper.frames;
        this.host.near = wrapper.near;
        this.host.far = wrapper.far;
        this.host.resolution = wrapper.resolution;
        this.host.background = wrapper.background;
        this.host.map = wrapper.map;
        this.host.files = wrapper.files;
        this.host.path = wrapper.path;
        this.host.preset = wrapper.preset;
        this.host.scene = wrapper.scene;
        this.host.extensions = wrapper.extensions;
        this.host.ground = wrapper.ground;
      });
  }

  constructor(@Self() @Optional() private host: NgtSobaEnvironmentGeneric) {
    if (!host) return;
  }

  private assertWrapper(wrapper: unknown): asserts wrapper is NgtSobaEnvironmentGeneric {
    if (!(wrapper instanceof NgtSobaEnvironmentGeneric)) {
      throw new Error(`[ngtSobaEnvironmentPassThrough] wrapper is not an NgtSobaEnvironmentGeneric`);
    }
  }
}

export type NgtSobaEnvironmentResolverParams = Partial<
  Pick<NgtSobaEnvironmentGenericState, 'files' | 'path' | 'preset' | 'extensions'>
>;

export interface NgtSobaEnvironmentResolverState
  extends Pick<NgtSobaEnvironmentGenericState, 'files' | 'path' | 'preset' | 'extensions'> {
  textureRef: Ref<THREE.Texture | THREE.CubeTexture>;
}

@Injectable()
export class NgtSobaEnvironmentResolver extends NgtComponentStore<NgtSobaEnvironmentResolverState> {
  constructor(private loader: NgtLoader, private store: NgtStore) {
    super();
    this.set({ textureRef: new Ref() });
  }

  private useSubscription?: Subscription;

  use(
    paramsFactory: (
      defaultParams: NgtSobaEnvironmentResolverParams
    ) => NgtSobaEnvironmentResolverParams | Observable<NgtSobaEnvironmentResolverParams>
  ): Ref<THREE.Texture | THREE.CubeTexture> {
    if (this.useSubscription) {
      this.useSubscription.unsubscribe();
    }

    const params = paramsFactory({
      files: ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'],
      path: '',
    });

    const params$ = isObservable(params) ? params : of(params);

    this.set(params$);

    this.useSubscription = this.onCanvasReady(
      this.store.ready$,
      () => {
        this.setTexture(
          this.select(
            this.select((s) => s.path),
            this.select((s) => s.files),
            this.select((s) => s.preset).pipe(startWithUndefined()),
            this.select((s) => s.extensions).pipe(startWithUndefined())
          )
        );

        return () => {
          if (this.useSubscription) {
            this.useSubscription.unsubscribe();
          }
        };
      },
      true
    );

    return this.get((s) => s.textureRef);
  }

  private readonly setTexture = this.effect<{}>(
    tapEffect(() => {
      const { textureRef, extensions, preset } = this.get();
      let { files, path } = this.get();

      if (preset) {
        if (!(preset in presetsObj)) throw new Error('Preset must be one of: ' + Object.keys(presetsObj).join(', '));
        files = presetsObj[preset];
        path = CUBEMAP_ROOT;
      }

      const isCubeMap = Array.isArray(files);
      const loader = isCubeMap ? THREE.CubeTextureLoader : RGBELoader;

      const sub = this.loader
        .use(
          // @ts-expect-error
          loader,
          isCubeMap ? [files] : files,
          (loader) => {
            loader.setPath(path!);
            if (extensions) extensions(loader);
          }
        ) // @ts-ignore
        .subscribe((data) => {
          const texture: THREE.Texture | THREE.CubeTexture = isCubeMap
            ? // @ts-ignore
              data[0]
            : data;

          texture.mapping = isCubeMap ? THREE.CubeReflectionMapping : THREE.EquirectangularReflectionMapping;

          textureRef.set(texture);
        });

      return () => {
        sub.unsubscribe();
      };
    })
  );
}

@Component({
  selector: 'ngt-soba-environment-map[map]',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NgtSobaEnvironmentGeneric,
      useExisting: NgtSobaEnvironmentMap,
    },
  ],
})
export class NgtSobaEnvironmentMap extends NgtSobaEnvironmentGeneric {
  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      background: state.background ?? false,
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.setEnvironment(
          this.select(
            this.store.select((s) => s.scene),
            this.select((s) => s.background),
            this.select((s) => s.map),
            this.select((s) => s.scene).pipe(startWithUndefined())
          )
        );
      });
    });
  }

  private readonly setEnvironment = this.effect<{}>(
    tapEffect(() => {
      const { map, background, scene } = this.get();
      const defaultScene = this.store.get((s) => s.scene);

      if (map) {
        const target = resolveScene(scene || defaultScene);
        const oldBg = target.background;
        const oldEnv = target.environment;

        if (background !== 'only') {
          target.environment = map;
        }

        if (background) {
          target.background = map;
        }

        return () => {
          if (background !== 'only') {
            target.environment = oldEnv;
          }

          if (background) {
            target.background = oldBg;
          }
        };
      }
      return;
    })
  );
}

@Component({
  selector: 'ngt-soba-environment-cube',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NgtSobaEnvironmentGeneric,
      useExisting: NgtSobaEnvironmentCube,
    },
    NgtSobaEnvironmentResolver,
  ],
})
export class NgtSobaEnvironmentCube extends NgtSobaEnvironmentGeneric {
  constructor(
    zone: NgZone,
    store: NgtStore,
    @Optional()
    @SkipSelf()
    @Inject(NGT_INSTANCE_REF)
    parentRef: AnyFunction<Ref>,
    @Optional()
    @SkipSelf()
    @Inject(NGT_INSTANCE_HOST_REF)
    parentHostRef: AnyFunction<Ref>,
    private environmentResolver: NgtSobaEnvironmentResolver
  ) {
    super(zone, store, parentRef, parentHostRef);
  }

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      background: state.background ?? false,
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        const textureRef = this.environmentResolver.use((defaultParams) => {
          return this.select(
            this.select((s) => s.files).pipe(startWith(defaultParams.files)),
            this.select((s) => s.path).pipe(startWith(defaultParams.path)),
            this.select((s) => s.preset).pipe(startWithUndefined()),
            this.select((s) => s.extensions).pipe(startWithUndefined()),
            (files, path, preset, extensions) => ({
              files,
              path,
              preset,
              extensions,
            })
          );
        });

        this.setEnvironment(
          this.select(
            textureRef.pipe(filter((texture) => !!texture)),
            this.select((s) => s.background),
            this.select((s) => s.scene).pipe(startWithUndefined()),
            this.store.select((s) => s.scene),
            (texture) => ({ texture })
          )
        );
      });
    });
  }

  private readonly setEnvironment = this.effect<{
    texture: THREE.Texture | THREE.CubeTexture;
  }>(
    tapEffect(({ texture }) => {
      const defaultScene = this.store.get((s) => s.scene);
      const { background, scene } = this.get();

      const target = resolveScene(scene || defaultScene);
      const oldBg = target.background;
      const oldEnv = target.environment;
      if (background !== 'only') {
        target.environment = texture;
      }

      if (background) {
        target.background = texture;
      }

      return () => {
        if (background !== 'only') {
          target.environment = oldEnv;
        }

        if (background) {
          target.background = oldBg;
        }
      };
    })
  );
}

@Directive({
  selector: 'ng-template[ngt-soba-environment-content]',
})
export class NgtSobaEnvironmentContent {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'ngt-soba-environment-portal',
  template: `
    <ngt-portal [ref]="virtualScene">
      <ng-container *ngTemplateOutlet="content.templateRef"></ng-container>

      <ngt-cube-camera
        *ngIf="fbo$ | async as fbo"
        [ref]="cubeCamera"
        (beforeRender)="onBeforeRender()"
        [args]="[$any(near), $any(far), fbo]"
      ></ngt-cube-camera>

      <ngt-soba-environment-cube
        *ngIf="files || preset; else environmentMap"
        [ngtSobaEnvironmentPassThrough]="this"
      ></ngt-soba-environment-cube>

      <ng-template #environmentMap>
        <ngt-soba-environment-map [ngtSobaEnvironmentPassThrough]="this" [map]="map"></ngt-soba-environment-map>
      </ng-template>
    </ngt-portal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NgtSobaEnvironmentGeneric,
      useExisting: NgtSobaEnvironmentPortal,
    },
  ],
})
export class NgtSobaEnvironmentPortal extends NgtSobaEnvironmentGeneric {
  readonly virtualScene = new Ref(prepare(new THREE.Scene(), () => this.store.get()));
  readonly cubeCamera = new Ref<THREE.CubeCamera>();

  @ContentChild(NgtSobaEnvironmentContent, { static: true })
  content!: NgtSobaEnvironmentContent;

  private count = 1;

  readonly fbo$ = this.select((s) => s['fbo']);

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      near: state.near ?? 1,
      far: state.far ?? 1000,
      resolution: state.resolution ?? 256,
      frames: state.frames ?? 1,
      background: state.background ?? false,
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.set(
          this.select(
            this.select((s) => s.resolution),
            (resolution) => {
              const fbo = new THREE.WebGLCubeRenderTarget(resolution!);
              fbo.texture.type = THREE.HalfFloatType;
              return { fbo };
            }
          )
        );

        this.setEnvironment(this.select(this.select(), this.cubeCamera.pipe(filter((camera) => !!camera))));
      });
    });
  }

  private readonly setEnvironment = this.effect<{}>(
    tapEffect(() => {
      const { gl, scene: defaultScene } = this.store.get();
      const { frames, scene, background, fbo } = this.get();

      if (frames === 1) {
        (this.cubeCamera.value as THREE.CubeCamera).update(gl, this.virtualScene.value);
      }
      const target = resolveScene(scene || defaultScene);
      const oldBg = target.background;
      const oldEnv = target.environment;
      if (background !== 'only') {
        target.environment = fbo.texture;
      }

      if (background) {
        target.background = fbo.texture;
      }

      return () => {
        if (background !== 'only') {
          target.environment = oldEnv;
        }

        if (background) {
          target.background = oldBg;
        }
      };
    })
  );

  onBeforeRender() {
    const { camera, frames } = this.get();
    const gl = this.store.get((s) => s.gl);
    if (camera && (frames === Infinity || this.count < frames!)) {
      camera.update(gl, this.virtualScene.value);
      this.count++;
    }
  }
}

@Component({
  selector: 'ngt-soba-environment-ground',
  template: `
    <ng-container *ngIf="environmentGroundViewModel$ | async as viewModel">
      <ngt-soba-environment-map
        [ngtSobaEnvironmentPassThrough]="this"
        [map]="viewModel.texture"
      ></ngt-soba-environment-map>

      <ngt-mesh [scale]="viewModel.scale">
        <ngt-icosahedron-geometry [args]="[1, 16]"></ngt-icosahedron-geometry>
        <ngt-shader-material
          [ref]="materialRef"
          [side]="'back' | side"
          [vertexShader]="vertexShader"
          [fragmentShader]="viewModel.fragment"
          [uniforms]="uniforms"
        ></ngt-shader-material>
      </ngt-mesh>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NgtSobaEnvironmentGeneric,
      useExisting: NgtSobaEnvironmentGround,
    },
    NgtSobaEnvironmentResolver,
  ],
})
export class NgtSobaEnvironmentGround extends NgtSobaEnvironmentGeneric {
  readonly materialRef = new Ref<THREE.ShaderMaterial>();

  constructor(
    zone: NgZone,
    store: NgtStore,
    @Optional()
    @SkipSelf()
    @Inject(NGT_INSTANCE_REF)
    parentRef: AnyFunction<Ref>,
    @Optional()
    @SkipSelf()
    @Inject(NGT_INSTANCE_HOST_REF)
    parentHostRef: AnyFunction<Ref>,
    private environmentResolver: NgtSobaEnvironmentResolver
  ) {
    super(zone, store, parentRef, parentHostRef);
  }

  readonly vertexShader = vertexShader;

  readonly uniforms = {
    cubemap: { value: null },
    height: { value: 15 },
    radius: { value: 60 },
  };

  readonly environmentGroundViewModel$ = this.select(
    this.select((s) => s['texture']),
    this.select((s) => s['scale']),
    this.select((s) => s['fragment']),
    (texture, scale, fragment) => ({ texture, scale, fragment })
  );

  override ngOnInit() {
    super.ngOnInit();
    this.onCanvasReady(this.store.ready$, () => {
      const textureRef = this.environmentResolver.use((defaultParams) =>
        this.select(
          this.select((s) => s.files).pipe(startWith(defaultParams.files)),
          this.select((s) => s.path).pipe(startWith(defaultParams.path)),
          this.select((s) => s.preset).pipe(startWithUndefined()),
          this.select((s) => s.extensions).pipe(startWithUndefined()),
          (files, path, preset, extensions) => ({
            files,
            path,
            preset,
            extensions,
          })
        )
      );

      this.set(
        this.select(
          this.select((s) => s.map).pipe(startWithUndefined()),
          textureRef.pipe(filter((texture) => !!texture)),
          (map, texture) => {
            if (map) {
              texture = map;
            }
            return {
              texture,
              isCubeMap: isCubeTexture(texture),
            };
          }
        )
      );

      this.setDefines(this.select((s) => s['texture']).pipe(take(1)));
      this.setFragment(this.select((s) => s['defines']));
      this.setMaterialOptions(this.select((s) => s.ground));

      this.setHeightUniform(
        this.select(
          this.materialRef.pipe(filter((material) => !!material)),
          this.select((s) => s['height']).pipe(startWithUndefined())
        )
      );
      this.setRadiusUniform(
        this.select(
          this.materialRef.pipe(filter((material) => !!material)),
          this.select((s) => s['radius']).pipe(startWithUndefined())
        )
      );
      this.setCubeMapUniform(
        this.select(
          this.materialRef.pipe(filter((material) => !!material)),
          this.select((s) => s['texture'])
        )
      );
    });
  }

  private readonly setDefines = this.effect<{}>(
    tap(() => {
      const { isCubeMap, texture } = this.get();
      const w = (isCubeMap ? texture.image[0]?.width : texture.image.width) ?? 1024;
      const cubeSize = w / 4;
      const _lodMax = Math.floor(Math.log2(cubeSize));
      const _cubeSize = Math.pow(2, _lodMax);
      const width = 3 * Math.max(_cubeSize, 16 * 7);
      const height = 4 * _cubeSize;

      this.set({
        defines: [
          isCubeMap ? `#define ENVMAP_TYPE_CUBE` : '',
          `#define CUBEUV_TEXEL_WIDTH ${1.0 / width}`,
          `#define CUBEUV_TEXEL_HEIGHT ${1.0 / height}`,
          `#define CUBEUV_MAX_MIP ${_lodMax}.0`,
          ``,
        ],
      });
    })
  );

  private readonly setFragment = this.effect<{}>(
    tap(() => {
      const defines = this.get((s) => s['defines']);
      this.set({ fragment: defines.join('\n') + fragmentShader });
    })
  );

  private readonly setMaterialOptions = this.effect<{}>(
    tap(() => {
      const ground = this.get((s) => s.ground) as {
        radius?: number;
        height?: number;
        scale?: number;
      };

      this.set({
        height: ground?.height,
        radius: ground?.radius,
        scale: ground?.scale ?? 1000,
      });
    })
  );

  private readonly setHeightUniform = this.effect<{}>(
    pipe(
      observeOn(animationFrameScheduler),
      tap(() => {
        const { height } = this.get();

        if (this.materialRef.value) {
          if (height) {
            this.materialRef.value.uniforms['height'].value = height;
          }
        }
      })
    )
  );

  private readonly setRadiusUniform = this.effect<{}>(
    pipe(
      observeOn(animationFrameScheduler),
      tap(() => {
        const { radius } = this.get();

        if (this.materialRef.value) {
          if (radius) {
            this.materialRef.value.uniforms['radius'].value = radius;
          }
        }
      })
    )
  );

  private readonly setCubeMapUniform = this.effect<{}>(
    pipe(
      observeOn(animationFrameScheduler),
      tap(() => {
        const { texture } = this.get();

        if (this.materialRef.value) {
          this.materialRef.value.uniforms['cubemap'].value = texture;
        }
      })
    )
  );
}

@Component({
  selector: 'ngt-soba-environment',
  template: `
    <ngt-soba-environment-ground
      *ngIf="!!ground; else mapOrPortalOrCube"
      [ngtSobaEnvironmentPassThrough]="this"
    ></ngt-soba-environment-ground>
    <ng-template #mapOrPortalOrCube>
      <ngt-soba-environment-map
        *ngIf="!!map; else portalOrCube"
        [ngtSobaEnvironmentPassThrough]="this"
        [map]="map"
      ></ngt-soba-environment-map>

      <ng-template #portalOrCube>
        <ngt-soba-environment-portal *ngIf="!!content; else cube" [ngtSobaEnvironmentPassThrough]="this">
          <ng-template ngt-soba-environment-content>
            <ng-container *ngTemplateOutlet="content.templateRef"></ng-container>
          </ng-template>
        </ngt-soba-environment-portal>

        <ng-template #cube>
          <ngt-soba-environment-cube [ngtSobaEnvironmentPassThrough]="this"></ngt-soba-environment-cube>
        </ng-template>
      </ng-template>
    </ng-template>

    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NgtSobaEnvironmentGeneric, useExisting: NgtSobaEnvironment }],
})
export class NgtSobaEnvironment extends NgtSobaEnvironmentGeneric {
  @ContentChild(NgtSobaEnvironmentContent)
  content?: NgtSobaEnvironmentContent;
}

@NgModule({
  declarations: [
    NgtSobaEnvironment,
    NgtSobaEnvironmentPassThrough,
    NgtSobaEnvironmentMap,
    NgtSobaEnvironmentCube,
    NgtSobaEnvironmentPortal,
    NgtSobaEnvironmentGround,
    NgtSobaEnvironmentContent,
  ],
  exports: [NgtSobaEnvironment, NgtSobaEnvironmentContent],
  imports: [
    NgtPortalModule,
    CommonModule,
    NgtCubeCameraModule,
    NgtMeshModule,
    NgtIcosahedronGeometryModule,
    NgtShaderMaterialModule,
    NgtSidePipeModule,
  ],
})
export class NgtSobaEnvironmentModule {}

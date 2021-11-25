import {
  CanvasStore,
  EnhancedComponentStore,
  LoaderService,
  NgtCoreModule,
} from '@angular-three/core';
import { presetsObj, PresetsType } from '@angular-three/soba';
import { Directive, Input, NgModule, NgZone, OnInit } from '@angular/core';
import { Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

interface NgtSobaEnvironmentState {
  path: string;
  background?: boolean;
  files?: string | string[];
  scene?: THREE.Scene;
  extensions?: (loader: THREE.Loader) => void;
  texture?: THREE.Texture;
  map?: THREE.Texture;
  oldBg: THREE.Texture | THREE.Color | null;
  oldEnv: THREE.Texture | null;
  firstEnvironmentUpdate: boolean;
}

const initialSobaEnvironmentState: NgtSobaEnvironmentState = {
  background: false,
  files: ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'],
  path: '',
  oldBg: null,
  oldEnv: null,
  firstEnvironmentUpdate: false,
  scene: undefined,
  extensions: undefined,
  texture: undefined,
  map: undefined,
};

const CUBEMAP_ROOT =
  'https://rawcdn.githack.com/pmndrs/drei-assets/aa3600359ba664d546d05821bcbca42013587df2';

@Directive({
  selector: 'ngt-soba-environment',
  exportAs: 'ngtSobaEnvironment',
})
export class NgtSobaEnvironment
  extends EnhancedComponentStore<NgtSobaEnvironmentState>
  implements OnInit
{
  @Input() set background(v: boolean) {
    this.updaters.setBackground(v);
  }

  @Input() set files(v: string | string[]) {
    this.updaters.setFiles(v);
  }

  @Input() set path(v: string) {
    this.updaters.setPath(v);
  }

  @Input() set preset(v: PresetsType) {
    this.updaters.setFiles(presetsObj[v]);
    this.updaters.setPath(CUBEMAP_ROOT + '/hdri/');
  }

  @Input() set scene(v: THREE.Scene) {
    this.updaters.setScene(v);
  }

  @Input() set extensions(v: (loader: THREE.Loader) => void) {
    this.updaters.setExtensions(v);
  }

  changes$ = this.select(
    this.selectors.texture$,
    this.selectors.scene$,
    this.selectors.background$,
    (texture, scene, background) => ({ texture, scene, background }),
    { debounce: true }
  );

  constructor(
    private loaderService: LoaderService,
    private ngZone: NgZone,
    private canvasStore: CanvasStore
  ) {
    super(initialSobaEnvironmentState);
  }

  ngOnInit() {
    this.updateTextureEffect(
      this.selectors.files$.pipe(
        withLatestFrom(this.selectors.path$, this.selectors.extensions$),
        switchMap(([files, path, extensions]) => {
          // TODO: fix any
          const isCubeMap = Array.isArray(files);
          return this.loaderService.use(
            (isCubeMap ? THREE.CubeTextureLoader : RGBELoader) as any,
            (isCubeMap ? [files] : files) as any,
            (loader) => {
              loader.setPath(path);
              if (extensions) extensions(loader);
            }
          ) as Observable<THREE.Texture | THREE.Texture[]>;
        })
      )
    );

    this.updateEnvironmentEffect(
      this.changes$ as Observable<{
        texture: THREE.Texture;
        scene: THREE.Scene;
        background: boolean;
      }>
    );
  }

  readonly updateTextureEffect = this.effect<THREE.Texture | THREE.Texture[]>(
    (loaderResult$) =>
      loaderResult$.pipe(
        withLatestFrom(this.canvasStore.selectors.renderer$),
        tap(([loaderResult, renderer]) => {
          this.ngZone.runOutsideAngular(() => {
            const map = this.isCubeMap
              ? (loaderResult as THREE.Texture[])[0]
              : (loaderResult as THREE.Texture);

            const gen = new THREE.PMREMGenerator(renderer!);
            const texture = NgtSobaEnvironment.getTexture(
              map,
              gen,
              this.isCubeMap
            ) as THREE.Texture;
            gen.dispose();

            this.patchState({ map, texture });
          });
        })
      )
  );

  readonly updateEnvironmentEffect = this.effect<{
    texture: THREE.Texture;
    scene: THREE.Scene;
    background: boolean;
  }>((params$) =>
    params$.pipe(
      withLatestFrom(
        this.canvasStore.selectors.scene$,
        this.selectors.firstEnvironmentUpdate$,
        this.canvasStore.selectors.renderer$
      ),
      tap(
        ([
          { texture, scene, background },
          defaultScene,
          firstEnvironmentUpdate,
        ]) => {
          this.ngZone.runOutsideAngular(() => {
            if (firstEnvironmentUpdate) {
              this.cleanUpEffect();
            }

            const oldBg = scene ? scene.background : defaultScene!.background;
            const oldEnv = scene
              ? scene.environment
              : defaultScene!.environment;

            this.patchState({ oldBg, oldEnv });

            if (scene) {
              scene.environment = texture;
              if (background) scene.background = texture;
            } else {
              defaultScene!.environment = texture;
              if (background) defaultScene!.background = texture;
            }

            this.patchState({ firstEnvironmentUpdate: true });
          });
        }
      )
    )
  );

  cleanUpEffect = this.effect(($) =>
    $.pipe(
      withLatestFrom(
        this.selectors.texture$,
        this.selectors.scene$,
        this.canvasStore.selectors.scene$,
        this.selectors.oldBg$,
        this.selectors.oldEnv$
      ),
      tap(([, texture, scene, defaultScene, oldBg, oldEnv]) => {
        this.ngZone.runOutsideAngular(() => {
          if (scene) {
            scene.environment = oldEnv;
            scene.background = oldBg;
          } else {
            defaultScene!.environment = oldEnv;
            defaultScene!.background = oldBg;
          }
          texture!.dispose();
        });
      })
    )
  );

  get isCubeMap() {
    return Array.isArray(this.files);
  }

  ngOnDestroy() {
    this.cleanUpEffect();
    super.ngOnDestroy();
  }

  private static getTexture(
    texture: THREE.Texture | THREE.CubeTexture,
    gen: THREE.PMREMGenerator,
    isCubeMap: boolean
  ) {
    if (isCubeMap) {
      gen.compileEquirectangularShader();
      return gen.fromCubemap(texture as THREE.CubeTexture).texture;
    }
    return gen.fromEquirectangular(texture).texture;
  }
}

@NgModule({
  declarations: [NgtSobaEnvironment],
  exports: [NgtSobaEnvironment],
  imports: [NgtCoreModule],
})
export class NgtSobaEnvironmentModule {}

import {
  EnhancedComponentStore,
  NgtLoaderService,
  NgtStore,
  tapEffect,
} from '@angular-three/core';
import { presetsObj, PresetsType } from '@angular-three/soba';
import { Directive, Input, NgModule, NgZone, OnInit } from '@angular/core';
import { Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';

const CUBEMAP_ROOT =
  'https://rawcdn.githack.com/pmndrs/drei-assets/aa3600359ba664d546d05821bcbca42013587df2';

interface NgtSobaEnvironmentState {
  background?: boolean;
  files?: string | string[];
  path?: string;
  scene?: THREE.Scene;
  extensions?: (loader: THREE.Loader) => void;
  texture?: THREE.Texture;
}

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
    if (!(v in presetsObj)) {
      throw new Error(
        'Preset must be one of: ' + Object.keys(presetsObj).join(', ')
      );
    }
    this.updaters.setFiles(presetsObj[v]);
    this.updaters.setPath(CUBEMAP_ROOT + '/hdri/');
  }

  @Input() set scene(v: THREE.Scene) {
    this.updaters.setScene(v);
  }

  @Input() set extensions(v: (loader: THREE.Loader) => void) {
    this.updaters.setExtensions(v);
  }

  #textureParams$ = this.select(
    this.selectors.files$,
    this.selectors.path$,
    this.selectors.extensions$,
    (files, path, extensions) => {
      const loader = this.#isCubeMap ? THREE.CubeTextureLoader : RGBELoader;
      const urls = this.#isCubeMap ? [files] : files;
      return { loader, urls, path, extensions };
    },
    { debounce: true }
  );

  #environmentParams$ = this.select(
    this.selectors.texture$,
    this.selectors.scene$,
    this.selectors.background$,
    (texture, scene, background) => ({ texture, scene, background }),
    { debounce: true }
  );

  constructor(
    private loaderService: NgtLoaderService,
    private ngZone: NgZone,
    private store: NgtStore
  ) {
    super({
      background: false,
      files: ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'],
      path: '',
      scene: undefined,
      extensions: undefined,
      texture: undefined,
    });
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.init();
    });
  }

  readonly init = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.#updateTexture(
          this.#textureParams$.pipe(
            switchMap(({ extensions, path, urls, loader }) =>
              // @ts-ignore
              this.loaderService.use(loader, urls, (innerLoader) => {
                innerLoader.setPath(path!);
                if (extensions) {
                  extensions(innerLoader);
                }
              })
            )
          ) as Observable<THREE.Texture>
        );

        this.#updateEnvironment(this.#environmentParams$);
      })
    )
  );

  #updateTexture = this.effect<THREE.Texture>((texture$) =>
    texture$.pipe(
      withLatestFrom(this.store.selectors.renderer$),
      tap(([textureResult, renderer]) => {
        this.ngZone.runOutsideAngular(() => {
          const gen = new THREE.PMREMGenerator(renderer!);
          const texture = NgtSobaEnvironment.getTexture(
            textureResult,
            gen,
            this.#isCubeMap
          ) as THREE.Texture;
          gen.dispose();

          this.updaters.setTexture(texture);
        });
      })
    )
  );

  #updateEnvironment = this.effect<{
    texture?: THREE.Texture;
    scene?: THREE.Scene;
    background?: boolean;
  }>((params$) =>
    params$.pipe(
      withLatestFrom(this.store.selectors.scene$),
      tapEffect(([{ texture, scene, background }, defaultScene]) => {
        const oldBg = scene ? scene.background : defaultScene!.background;
        const oldEnv = scene ? scene.environment : defaultScene!.environment;

        this.ngZone.runOutsideAngular(() => {
          if (scene) {
            scene.environment = texture!;
            if (background) scene.background = texture!;
          } else {
            defaultScene!.environment = texture!;
            if (background) defaultScene!.background = texture!;
          }
        });

        return () => {
          this.ngZone.runOutsideAngular(() => {
            if (scene) {
              scene.environment = oldEnv;
              scene.background = oldBg;
            } else {
              defaultScene!.environment = oldEnv;
              defaultScene!.background = oldBg;
            }
            texture?.dispose();
          });
        };
      })
    )
  );

  get #isCubeMap() {
    return Array.isArray(this.getImperativeState().files);
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
})
export class NgtSobaEnvironmentModule {}

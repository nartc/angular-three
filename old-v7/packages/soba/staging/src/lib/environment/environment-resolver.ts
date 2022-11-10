import { NgtComponentStore, NgtLoader, NgtRef, NgtStore, tapEffect } from '@angular-three/core';
import { inject, Injectable } from '@angular/core';
import { animationFrameScheduler, Observable, observeOn, Subscription } from 'rxjs';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';
import { NgtSobaEnvironmentResolverParams } from './environment-inputs';
import { presetsObj, PresetsType } from './presets';

const CUBEMAP_ROOT = 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/';

@Injectable()
export class NgtSobaEnvironmentResolver extends NgtComponentStore {
  private readonly textureRef = new NgtRef<THREE.CubeTexture | THREE.Texture>();
  private subscription?: Subscription;

  private readonly loader = inject(NgtLoader);
  private readonly store = inject(NgtStore);

  private readonly setTexture = this.effect(
    tapEffect(() => {
      const { preset, extensions, encoding } = this.getState();
      let { files, path } = this.getState();

      if (preset) {
        if (!(preset in presetsObj)) {
          throw new Error('Preset must be one of: ' + Object.keys(presetsObj).join(', '));
        }
        files = presetsObj[preset as PresetsType];
        path = CUBEMAP_ROOT;
      }

      const isCubeMap = Array.isArray(files);
      const loader = isCubeMap ? THREE.CubeTextureLoader : RGBELoader;

      const texture$ = this.loader.use(
        // @ts-expect-error
        loader,
        isCubeMap ? [files] : files,
        (_loader) => {
          _loader.setPath(path);
          if (extensions) extensions(_loader);
        }
      );

      const textureSub = (texture$ as Observable<THREE.Texture | THREE.Texture[]>).subscribe((data) => {
        const texture: THREE.Texture | THREE.CubeTexture = isCubeMap
          ? // @ts-ignore
            data[0]
          : data;

        if (texture) {
          texture.encoding = encoding ?? isCubeMap ? THREE.sRGBEncoding : THREE.LinearEncoding;
          texture.mapping = isCubeMap ? THREE.CubeReflectionMapping : THREE.EquirectangularReflectionMapping;

          this.textureRef.set(texture);
        }
      });

      return () => {
        textureSub.unsubscribe();
      };
    })
  );

  use(
    paramsFactory: (
      defaultParams: NgtSobaEnvironmentResolverParams
    ) => NgtSobaEnvironmentResolverParams | Observable<NgtSobaEnvironmentResolverParams>
  ): NgtRef<THREE.Texture | THREE.CubeTexture> {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.set(
      paramsFactory({
        files: ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'],
        path: '',
        preset: undefined,
        encoding: undefined,
      })
    );

    this.subscription = this.store.onReady(() => {
      this.setTexture(
        this.select(
          this.select((s) => s['path']),
          this.select((s) => s['files']),
          this.select((s) => s['preset']),
          this.select((s) => s['encoding']),
          this.select((s) => s['extensions']),
          this.defaultProjector
        ).pipe(observeOn(animationFrameScheduler))
      );

      return () => {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      };
    });

    return this.textureRef;
  }
}

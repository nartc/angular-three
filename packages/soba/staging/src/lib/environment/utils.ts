import {
  injectNgtDestroy,
  injectNgtLoader,
  injectNgtRef,
  is,
  NgtAnyConstructor,
} from '@angular-three/core';
import { ElementRef } from '@angular/core';
import { debounceTime, isObservable, map, Observable, of, takeUntil } from 'rxjs';
import {
  CubeReflectionMapping,
  CubeTexture,
  CubeTextureLoader,
  EquirectangularReflectionMapping,
  LinearEncoding,
  sRGBEncoding,
  Texture,
} from 'three';
import { RGBELoader } from 'three-stdlib';
import { ngtsEnvironmentPresetsObj } from './assets';
import { NgtsEnvironmentInputs } from './environment-inputs';

function resolveScene(scene: THREE.Scene | ElementRef<THREE.Scene>) {
  return is.ref(scene) ? scene.nativeElement : scene;
}

export function setEnvProps(
  background: boolean | 'only',
  scene: THREE.Scene | ElementRef<THREE.Scene> | undefined,
  defaultScene: THREE.Scene,
  texture: THREE.Texture,
  blur = 0
) {
  const target = resolveScene(scene || defaultScene);
  const oldbg = target.background;
  const oldenv = target.environment;
  const oldBlur = target.backgroundBlurriness || 0;

  if (background !== 'only') target.environment = texture;
  if (background) target.background = texture;
  if (background && target.backgroundBlurriness !== undefined) target.backgroundBlurriness = blur;

  return () => {
    if (background !== 'only') target.environment = oldenv;
    if (background) target.background = oldbg;
    if (background && target.backgroundBlurriness !== undefined)
      target.backgroundBlurriness = oldBlur;
  };
}

type NgtsInjectEnvironmentParams = Partial<
  Pick<NgtsEnvironmentInputs, 'files' | 'path' | 'preset' | 'extensions' | 'encoding'>
>;

const CUBEMAP_ROOT = 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/';
export function injectNgtsEnvironment(
  paramsFactory: (
    defaultParams: NgtsInjectEnvironmentParams
  ) => NgtsInjectEnvironmentParams | Observable<NgtsInjectEnvironmentParams>
) {
  let p = {
    files: ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'],
    path: '',
    preset: undefined,
    encoding: undefined,
  } as NgtsInjectEnvironmentParams;
  const params = paramsFactory(p);
  const params$ = isObservable(params) ? params : of(params);

  const textureRef = injectNgtRef<Texture | CubeTexture>();
  const [destroy$] = injectNgtDestroy(() => {
    textureRef.nativeElement?.dispose();
  });

  const loaderResult = injectNgtLoader(
    (inputs) => (Array.isArray(inputs) ? CubeTextureLoader : RGBELoader) as NgtAnyConstructor,
    params$.pipe(
      debounceTime(0),
      map((data) => {
        p = data;
        return p;
      }),
      map((data) => {
        if (data.preset) {
          if (!(data.preset in ngtsEnvironmentPresetsObj))
            throw new Error(
              'Preset must be one of: ' + Object.keys(ngtsEnvironmentPresetsObj).join(', ')
            );
          data.files = ngtsEnvironmentPresetsObj[data.preset];
          data.path = CUBEMAP_ROOT;
        }
        return Array.isArray(data.files) ? [data.files] : (data.files! as any);
      })
    ),
    (loader) => {
      if (p.path) {
        loader.setPath(p.path);
      }
      if (p.extensions) {
        p.extensions(loader);
      }
    }
  );

  loaderResult.pipe(takeUntil(destroy$)).subscribe((results) => {
    const texture = Array.isArray(p.files!) ? (results as any[])[0] : results;
    texture.mapping = Array.isArray(p.files!)
      ? CubeReflectionMapping
      : EquirectangularReflectionMapping;
    texture.encoding = p.encoding ?? Array.isArray(p.files!) ? sRGBEncoding : LinearEncoding;

    textureRef.nativeElement = texture;
  });

  return textureRef;
}

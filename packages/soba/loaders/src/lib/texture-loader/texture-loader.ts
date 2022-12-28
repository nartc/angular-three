import { injectNgtDestroy, injectNgtLoader, injectNgtStore } from '@angular-three/core';
import { map, Observable, takeUntil } from 'rxjs';
import { Texture, TextureLoader } from 'three';

export const IsObject = (url: any): url is Record<string, string> =>
  url === Object(url) && !Array.isArray(url) && typeof url !== 'function';

export function injectNgtsTextureLoader<TInput extends string[] | string | Record<string, string>>(
  input: TInput,
  onLoad?: (texture: Texture | Texture[]) => void
): Observable<
  TInput extends any[]
    ? Texture[]
    : TInput extends object
    ? { [key in keyof TInput]: Texture }
    : Texture
> {
  const store = injectNgtStore();
  const [destroy$] = injectNgtDestroy();
  const textures$ = injectNgtLoader(TextureLoader, IsObject(input) ? Object.values(input) : input);

  textures$.pipe(takeUntil(destroy$)).subscribe((textures: Texture | Texture[]) => {
    if (onLoad) onLoad(textures);
    const array = Array.isArray(textures) ? textures : [textures];
    array.forEach(store.get('gl').initTexture);
  });

  return textures$.pipe(
    map((textures: Texture | Texture[]) => {
      if (IsObject(input)) {
        const keys = Object.keys(input);
        return keys.reduce((result, key) => {
          result[key as keyof typeof result] = (textures as Texture[])[keys.indexOf(key)];
          return result;
        }, {} as Record<keyof TInput, Texture>);
      }
      return textures;
    })
  ) as Observable<
    TInput extends any[]
      ? Texture[]
      : TInput extends object
      ? { [key in keyof TInput]: Texture }
      : Texture
  >;
}

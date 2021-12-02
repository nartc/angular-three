import { NgtLoaderService, NgtStore } from '@angular-three/core';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, tap } from 'rxjs';
import * as THREE from 'three';

export const IsObject = (url: any): url is Record<string, string> =>
  url === Object(url) && !Array.isArray(url) && typeof url !== 'function';

@Injectable({ providedIn: 'root' })
export class TextureLoaderService {
  constructor(
    private store: NgtStore,
    private loaderService: NgtLoaderService
  ) {}

  load<TInput extends string | string[] | Record<string, string>>(
    input: TInput
  ): Observable<
    TInput extends any[]
      ? THREE.Texture[]
      : TInput extends object
      ? Record<keyof TInput, THREE.Texture>
      : THREE.Texture
  > {
    return combineLatest([
      this.store.selectors.renderer$,
      this.loaderService.use(
        THREE.TextureLoader,
        IsObject(input) ? Object.values(input) : input
      ),
    ]).pipe(
      tap(([renderer, textures]) => {
        if (renderer) {
          (Array.isArray(textures) ? textures : [textures]).forEach(
            renderer.initTexture.bind(renderer)
          );
        }
      }),
      map(([, textures]) => {
        if (IsObject(input)) {
          return Object.keys(input).reduce((record, key, index) => {
            record[key as keyof TInput] = (textures as THREE.Texture[])[index];
            return record;
          }, {} as Record<keyof TInput, THREE.Texture>);
        }

        return textures;
      })
    ) as Observable<
      TInput extends any[]
        ? THREE.Texture[]
        : TInput extends object
        ? Record<keyof TInput, THREE.Texture>
        : THREE.Texture
    >;
  }
}

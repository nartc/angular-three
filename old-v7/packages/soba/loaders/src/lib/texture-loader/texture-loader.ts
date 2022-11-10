import { NgtLoader, skipFirstUndefined } from '@angular-three/core';
import { inject, Injectable } from '@angular/core';
import { combineLatestWith, defer, isObservable, map, Observable, of, tap } from 'rxjs';
import * as THREE from 'three';

const isObject = (url: unknown): url is Record<string, string> =>
  url === Object(url) && !Array.isArray(url) && typeof url !== 'function';

@Injectable({ providedIn: 'root' })
export class NgtTextureLoader {
  private readonly loader = inject(NgtLoader);

  load<TInput extends string | string[] | Record<string, string>>(
    input: TInput,
    gl: THREE.WebGLRenderer | Observable<THREE.WebGLRenderer>
  ): Observable<
    TInput extends string[]
      ? THREE.Texture[]
      : TInput extends object
      ? Record<keyof TInput, THREE.Texture>
      : THREE.Texture
  > {
    return defer(() => this.loader.use(THREE.TextureLoader, isObject(input) ? Object.values(input) : input)).pipe(
      combineLatestWith(isObservable(gl) ? gl.pipe(skipFirstUndefined()) : of(gl)),
      tap(([textures, renderer]: [THREE.Texture | THREE.Texture[], THREE.WebGLRenderer]) => {
        if (renderer) {
          (Array.isArray(textures) ? textures : [textures]).forEach(renderer.initTexture.bind(gl));
        }
      }),
      map(([textures]: [THREE.Texture | THREE.Texture[], THREE.WebGLRenderer]) => {
        if (isObject(input)) {
          return Object.keys(input).reduce((record, key, index) => {
            record[key as keyof TInput] = (textures as THREE.Texture[])[index];
            return record;
          }, {} as Record<keyof TInput, THREE.Texture>);
        }

        return textures;
      })
    ) as Observable<
      TInput extends string[]
        ? THREE.Texture[]
        : TInput extends object
        ? Record<keyof TInput, THREE.Texture>
        : THREE.Texture
    >;
  }
}

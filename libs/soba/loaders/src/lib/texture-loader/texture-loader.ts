import { is, NgtLoader } from '@angular-three/core';
import { inject, Injectable } from '@angular/core';
import { defer, map, Observable, tap } from 'rxjs';
import * as THREE from 'three';

const isObject = (url: unknown): url is Record<string, string> =>
  url === Object(url) && !is.arr(url) && typeof url !== 'function';

@Injectable({ providedIn: 'root' })
export class NgtTextureLoader {
  readonly #loader = inject(NgtLoader);

  load<TInput extends string | string[] | Record<string, string>>(
    input: TInput,
    gl: THREE.WebGLRenderer
  ): Observable<
    TInput extends string[]
      ? THREE.Texture[]
      : TInput extends object
      ? Record<keyof TInput, THREE.Texture>
      : THREE.Texture
  > {
    return defer(() =>
      this.#loader.use(
        THREE.TextureLoader,
        isObject(input) ? Object.values(input) : input
      )
    ).pipe(
      tap((textures: THREE.Texture | THREE.Texture[]) => {
        if (gl) {
          (is.arr(textures) ? textures : [textures]).forEach(
            gl.initTexture.bind(gl)
          );
        }
      }),
      map((textures: THREE.Texture | THREE.Texture[]) => {
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

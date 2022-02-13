import { NgtCanvasStore, NgtLoader } from '@angular-three/core';
import { Injectable } from '@angular/core';
import { defer, map, Observable, tap } from 'rxjs';
import * as THREE from 'three';

export const IsObject = (url: any): url is Record<string, string> =>
    url === Object(url) && !Array.isArray(url) && typeof url !== 'function';

@Injectable()
export class NgtTextureLoader {
    constructor(
        private canvasStore: NgtCanvasStore,
        private loader: NgtLoader
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
        return defer(() =>
            this.loader.use(
                THREE.TextureLoader,
                IsObject(input) ? Object.values(input) : input
            )
        ).pipe(
            tap((textures: THREE.Texture | THREE.Texture[]) => {
                const renderer = this.canvasStore.get((s) => s.renderer);
                if (renderer) {
                    (Array.isArray(textures) ? textures : [textures]).forEach(
                        renderer.initTexture.bind(renderer)
                    );
                }
            }),
            map((textures: THREE.Texture | THREE.Texture[]) => {
                if (IsObject(input)) {
                    return Object.keys(input).reduce((record, key, index) => {
                        record[key as keyof TInput] = (
                            textures as THREE.Texture[]
                        )[index];
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

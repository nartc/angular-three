import { injectNgtDestroy, injectNgtLoader, injectNgtStore } from '@angular-three/core';
import { isObservable, map, Observable, of, switchMap, takeUntil, tap } from 'rxjs';
import { Texture, TextureLoader } from 'three';

export const IsObject = (url: any): url is Record<string, string> =>
    url === Object(url) && !Array.isArray(url) && typeof url !== 'function';

export function injectNgtsTextureLoader<TInput extends string[] | string | Record<string, string>>(
    input: TInput | Observable<TInput>,
    onLoad?: (texture: Texture | Texture[]) => void
): Observable<TInput extends any[] ? Texture[] : TInput extends object ? { [key in keyof TInput]: Texture } : Texture> {
    const store = injectNgtStore();
    const [destroy$] = injectNgtDestroy();
    const input$ = isObservable(input) ? input : of(input);

    return input$.pipe(
        switchMap((inputs) => {
            // NOTE: this works because injectNgtLoader doesn't actually use any "inject". We need to reevaluate this approach
            return injectNgtLoader(() => TextureLoader, IsObject(inputs) ? Object.values(inputs) : inputs).pipe(
                tap((textures) => {
                    if (onLoad) onLoad(textures);
                    const array = Array.isArray(textures) ? textures : [textures];
                    array.forEach(store.get('gl').initTexture);
                }),
                map((textures) => {
                    if (IsObject(inputs)) {
                        const keys = Object.keys(input);
                        return keys.reduce((result, key) => {
                            result[key as keyof typeof result] = (textures as Texture[])[keys.indexOf(key)];
                            return result;
                        }, {} as Record<keyof TInput, Texture>);
                    }
                    return textures as any;
                })
            );
        }),

        takeUntil(destroy$)
    ) as Observable<
        TInput extends any[] ? Texture[] : TInput extends object ? { [key in keyof TInput]: Texture } : Texture
    >;
}

import { injectNgtLoader, injectNgtStore, NgtLoaderResults } from '@angular-three/core';
import { Observable, tap } from 'rxjs';
import { Texture, TextureLoader } from 'three';

export const IsObject = (url: any): url is Record<string, string> =>
    url === Object(url) && !Array.isArray(url) && typeof url !== 'function';

export function injectNgtsTextureLoader<TInput extends string[] | string | Record<string, string>>(
    input: TInput | Observable<TInput>,
    onLoad?: (texture: Texture | Texture[]) => void
): Observable<NgtLoaderResults<TInput, Texture>> {
    const store = injectNgtStore();
    return injectNgtLoader(() => TextureLoader, input).pipe(
        tap((textures) => {
            const array = Array.isArray(textures)
                ? textures
                : textures instanceof Texture
                ? [textures]
                : Object.values(textures);
            if (onLoad) onLoad(array);
            array.forEach(store.get('gl').initTexture);
        })
    ) as Observable<NgtLoaderResults<TInput, Texture>>;
}

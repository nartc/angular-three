import { injectNgtLoader, NgtLoaderResults, NgtObjectMap } from '@angular-three/core';
import { Observable, take } from 'rxjs';
import * as THREE from 'three';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MeshoptDecoder } from 'three-stdlib';
import { DRACOLoader } from 'three-stdlib/loaders/DRACOLoader';
import { GLTF, GLTFLoader } from 'three-stdlib/loaders/GLTFLoader';

let dracoLoader: DRACOLoader | null = null;

function _extensions(useDraco: boolean | string, useMeshOpt: boolean, extensions?: (loader: GLTFLoader) => void) {
    return (loader: THREE.Loader) => {
        if (extensions) {
            extensions(loader as GLTFLoader);
        }

        if (useDraco) {
            if (!dracoLoader) {
                dracoLoader = new DRACOLoader();
            }

            dracoLoader.setDecoderPath(
                typeof useDraco === 'string' ? useDraco : 'https://www.gstatic.com/draco/versioned/decoders/1.4.3/'
            );
            (loader as GLTFLoader).setDRACOLoader(dracoLoader);
        }

        if (useMeshOpt) {
            (loader as GLTFLoader).setMeshoptDecoder(
                typeof MeshoptDecoder === 'function' ? MeshoptDecoder() : MeshoptDecoder
            );
        }
    };
}

export interface NgtsGLTFLoader {
    <TInput extends string | string[] | Record<string, string>>(
        path: TInput | Observable<TInput>,
        useDraco?: boolean | string,
        useMeshOpt?: boolean,
        extensions?: (loader: GLTFLoader) => void
    ): Observable<NgtLoaderResults<TInput, GLTF & NgtObjectMap>>;
    preload: <TInput extends string | string[] | Record<string, string>>(
        path: TInput | Observable<TInput>,
        useDraco?: boolean | string,
        useMeshOpt?: boolean,
        extensions?: (loader: GLTFLoader) => void
    ) => void;
}

function injectGLTFLoader<TInput extends string | string[] | Record<string, string>>(
    path: TInput | Observable<TInput>,
    useDraco: boolean | string = true,
    useMeshOpt = true,
    extensions?: (loader: GLTFLoader) => void
): Observable<NgtLoaderResults<TInput, GLTF & NgtObjectMap>> {
    return injectNgtLoader(() => GLTFLoader, path, _extensions(useDraco, useMeshOpt, extensions)) as Observable<
        NgtLoaderResults<TInput, GLTF & NgtObjectMap>
    >;
}

(injectGLTFLoader as NgtsGLTFLoader).preload = (path, useDraco = true, useMeshOpt = true, extensions) => {
    injectGLTFLoader(path, useDraco, useMeshOpt, extensions).pipe(take(1)).subscribe();
};

export const injectNgtsGLTFLoader = injectGLTFLoader as NgtsGLTFLoader;

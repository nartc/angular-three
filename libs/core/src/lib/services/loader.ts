import { Injectable, OnDestroy } from '@angular/core';
import {
    catchError,
    defer,
    forkJoin,
    map,
    Observable,
    of,
    ReplaySubject,
    share,
    tap,
    throwError,
} from 'rxjs';
import * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type {
    BranchingReturn,
    LoaderExtensions,
    NgtLoaderResult,
    NgtObjectMap,
} from '../types';
import { buildGraph } from '../utils/build-graph';

@Injectable({ providedIn: 'root' })
export class NgtLoader implements OnDestroy {
    private readonly cached = new Map<string, BranchingReturn>();

    use<TReturnType, TUrl extends string | string[]>(
        loaderConstructor: new () => NgtLoaderResult<TReturnType>,
        input: TUrl,
        extensions?: LoaderExtensions,
        onProgress?: (event: ProgressEvent) => void
    ): TUrl extends any[]
        ? Observable<BranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>[]>
        : Observable<BranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>> {
        const keys = (Array.isArray(input) ? input : [input]) as string[];
        const loader = new loaderConstructor();
        if (extensions) {
            extensions(loader);
        }

        const results$ = forkJoin(
            keys.map((key) => {
                if (this.cached.has(key)) {
                    return of(this.cached.get(key));
                }

                return defer(() => loader.loadAsync(key, onProgress)).pipe(
                    tap((data) => {
                        if (data.scene) {
                            Object.assign(
                                data,
                                buildGraph(data.scene as THREE.Scene)
                            );
                        }
                        this.cached.set(key, data);
                    }),
                    catchError((err) => {
                        console.error(`Error loading ${key}: ${err.message}`);
                        return throwError(err);
                    })
                );
            })
        ) as Observable<
            BranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>[]
        >;

        return defer(() =>
            Array.isArray(input)
                ? results$
                : results$.pipe(map((results) => results[0]))
        ).pipe(
            share({
                connector: () => new ReplaySubject(),
                resetOnRefCountZero: true,
                resetOnError: true,
            })
        ) as TUrl extends any[]
            ? Observable<
                  BranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>[]
              >
            : Observable<
                  BranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>
              >;
    }

    ngOnDestroy() {
        this.cached.clear();
    }
}

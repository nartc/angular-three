import { Injectable, OnDestroy } from '@angular/core';
import { catchError, forkJoin, from, map, Observable, of, ReplaySubject, retry, share, tap } from 'rxjs';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three/src/Three';
import type { BranchingReturn, LoaderExtensions, NgtLoaderResult, NgtObjectMap } from '../types';
import { buildGraph } from '../utils/build-graph';
import { is } from '../utils/is';

@Injectable({ providedIn: 'root' })
export class NgtLoader implements OnDestroy {
  readonly cached = new Map();

  use<TReturnType, TUrl extends string | string[]>(
    loaderConstructor: new () => NgtLoaderResult<TReturnType>,
    input: TUrl,
    extensions?: LoaderExtensions,
    onProgress?: (event: ProgressEvent) => void
  ): TUrl extends string[]
    ? Observable<BranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>[]>
    : Observable<BranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>> {
    const keys = (is.arr(input) ? input : [input]) as string[];
    const loader = new loaderConstructor();
    if (extensions) {
      extensions(loader);
    }

    const observables$ = keys.map((key) => {
      if (!this.cached.has(key)) {
        this.cached.set(
          key,
          from(loader.loadAsync(key, onProgress)).pipe(
            tap((data) => {
              if (data.scene) {
                Object.assign(data, buildGraph(data.scene as THREE.Scene));
              }
            }),
            retry({ count: 2 }),
            catchError((err) => {
              console.error(`Error loading ${key}: ${err.message}`);
              return of(null);
            }),
            share({
              connector: () => new ReplaySubject(),
              resetOnComplete: true,
              resetOnRefCountZero: true,
              resetOnError: true,
            })
          )
        );
      }

      return this.cached.get(key);
    });

    return forkJoin(observables$).pipe(map((results) => (is.arr(input) ? results : results[0])));
  }

  destroy() {
    this.cached.clear();
  }

  ngOnDestroy() {
    this.destroy();
  }
}

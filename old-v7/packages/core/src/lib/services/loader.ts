import { Injectable } from '@angular/core';
import { catchError, forkJoin, from, map, Observable, of, ReplaySubject, retry, share, tap } from 'rxjs';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type { NgtBranchingReturn, NgtLoaderExtensions, NgtLoaderResult, NgtObjectMap } from '../types';
import { buildGraph } from '../utils/build-graph';

@Injectable({ providedIn: 'root' })
export class NgtLoader {
  private readonly cached = new Map();

  use<TReturnType, TUrl extends string | string[]>(
    loaderConstructor: new () => NgtLoaderResult<TReturnType>,
    input: TUrl,
    extensions?: NgtLoaderExtensions,
    onProgress?: (event: ProgressEvent) => void
  ): TUrl extends string[]
    ? Observable<NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>[]>
    : Observable<NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>> {
    const keys = (Array.isArray(input) ? input : [input]) as string[];
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
                Object.assign(data, buildGraph(data.scene));
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

    return forkJoin(observables$).pipe(map((results) => (Array.isArray(input) ? results : results[0])));
  }

  destroy() {
    this.cached.clear();
  }
}

import { Injectable } from '@angular/core';
import { catchError, forkJoin, from, map, Observable, of, ReplaySubject, retry, share, tap } from 'rxjs';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type {
    NgtAnyConstructor,
    NgtBranchingReturn,
    NgtLoaderExtensions,
    NgtLoaderResult,
    NgtObjectMap,
} from '../types';
import { buildGraph } from '../utils/build-graph';

@Injectable({ providedIn: 'root' })
export class NgtLoader {
    private readonly cached = new Map();

    use<TReturnType, TUrl extends string | string[]>(
        loadConstructor: NgtAnyConstructor<NgtLoaderResult<TReturnType>>,
        input: TUrl,
        extensions?: NgtLoaderExtensions,
        onProgress?: (event: ProgressEvent) => void
    ): TUrl extends string[]
        ? Observable<Array<NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>>>
        : Observable<NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>> {
        const urls = Array.isArray(input) ? input : [input];
        const loader = new loadConstructor();
        if (extensions) {
            extensions(loader);
        }

        const observables$ = urls.map((url) => {
            if (!this.cached.has(url)) {
                this.cached.set(
                    url,
                    from(loader.loadAsync(url, onProgress)).pipe(
                        tap((data) => {
                            if (data.scene) {
                                Object.assign(data, buildGraph(data.scene));
                            }
                        }),
                        retry(2),
                        catchError((err) => {
                            console.error(`[NgtLoader]: Error loading ${url}: ${err.message}`);
                            return of(null);
                        }),
                        share({
                            connector: () => new ReplaySubject(1),
                            resetOnComplete: true,
                            resetOnRefCountZero: true,
                            resetOnError: true,
                        })
                    )
                );
            }

            return this.cached.get(url);
        });

        return forkJoin(observables$).pipe(map((results) => (Array.isArray(input) ? results : results[0])));
    }

    destroy() {
        this.cached.clear();
    }
}

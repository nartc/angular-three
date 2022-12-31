import {
  catchError,
  defer,
  forkJoin,
  isObservable,
  map,
  Observable,
  of,
  ReplaySubject,
  retry,
  share,
  switchMap,
  tap,
} from 'rxjs';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type {
  NgtAnyConstructor,
  NgtBranchingReturn,
  NgtLoaderExtensions,
  NgtLoaderResult,
  NgtObjectMap,
} from '../types';
import { makeObjectGraph } from '../utils/make';

interface NgtLoader {
  <TReturnType, TUrl extends string | string[]>(
    loaderConstructor: NgtAnyConstructor<NgtLoaderResult<TReturnType>>,
    input: TUrl | Observable<TUrl>,
    extensions?: NgtLoaderExtensions,
    onProgress?: (event: ProgressEvent) => void
  ): Observable<
    TUrl extends string[]
      ? Array<NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>>
      : NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>
  >;
  destroy: () => void;
}

const cached = new Map<string, Observable<any>>();

function injectLoader<TReturnType, TUrl extends string | string[]>(
  loaderConstructor: NgtAnyConstructor<NgtLoaderResult<TReturnType>>,
  input: TUrl | Observable<TUrl>,
  extensions?: NgtLoaderExtensions,
  onProgress?: (event: ProgressEvent) => void
): Observable<
  TUrl extends string[]
    ? Array<NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>>
    : NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>
> {
  const urls$ = isObservable(input) ? input : of(input);
  const loader = new loaderConstructor();
  if (extensions) {
    extensions(loader);
  }

  return urls$.pipe(
    map((inputs) => {
      const urls = Array.isArray(inputs) ? inputs : [inputs];
      return [
        urls.map((url) => {
          if (!cached.has(url)) {
            cached.set(
              url,
              defer(() => loader.loadAsync(url, onProgress)).pipe(
                tap((data) => {
                  if (data.scene) {
                    Object.assign(data, makeObjectGraph(data.scene));
                  }
                }),
                retry(2),
                catchError((err) => {
                  console.error(`[NGT] Error loading ${url}: ${err.message}`);
                  return of(null);
                }),
                share({
                  connector: () => new ReplaySubject(1),
                  resetOnComplete: true,
                  resetOnError: true,
                  resetOnRefCountZero: true,
                })
              )
            );
          }
          return cached.get(url);
        }),
        inputs,
      ] as [Array<Observable<any>>, TUrl | TUrl[]];
    }),
    switchMap(([observables$, inputs]) => {
      return forkJoin(observables$).pipe(
        map((results) => (Array.isArray(inputs) ? results : results[0]))
      );
    })
  );
}

(injectLoader as NgtLoader).destroy = () => {
  cached.clear();
};

export const injectNgtLoader = injectLoader as NgtLoader;

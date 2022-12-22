import {
  catchError,
  forkJoin,
  from,
  map,
  Observable,
  of,
  ReplaySubject,
  retry,
  share,
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
import { buildGraph } from '../utils/build-graph';

interface NgtLoader {
  <TReturnType, TUrl extends string | string[]>(
    loaderConstructor: NgtAnyConstructor<NgtLoaderResult<TReturnType>>,
    input: TUrl,
    extensions?: NgtLoaderExtensions,
    onProgress?: (event: ProgressEvent) => void
  ): TUrl extends string[]
    ? Observable<Array<NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>>>
    : Observable<NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>>;
  destroy: () => void;
}

const cached = new Map<string, Observable<any>>();

function injectLoader<TReturnType, TUrl extends string | string[]>(
  loaderConstructor: NgtAnyConstructor<NgtLoaderResult<TReturnType>>,
  input: TUrl,
  extensions?: NgtLoaderExtensions,
  onProgress?: (event: ProgressEvent) => void
): TUrl extends string[]
  ? Observable<Array<NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>>>
  : Observable<NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>> {
  const urls = Array.isArray(input) ? input : [input];
  const loader = new loaderConstructor();
  if (extensions) {
    extensions(loader);
  }

  const observables$ = urls.map((url) => {
    if (!cached.has(url)) {
      cached.set(
        url,
        from(loader.loadAsync(url, onProgress)).pipe(
          tap((data) => {
            if (data.scene) {
              Object.assign(data, buildGraph(data.scene));
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
    return cached.get(url)!;
  });
  return forkJoin(observables$).pipe(
    map((results) => (Array.isArray(input) ? results : results[0]))
  );
}

(injectLoader as NgtLoader).destroy = () => {
  cached.clear();
};

export const injectNgtLoader = injectLoader as NgtLoader;

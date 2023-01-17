import {
    catchError,
    forkJoin,
    from,
    isObservable,
    map,
    Observable,
    of,
    ReplaySubject,
    retry,
    share,
    switchMap,
    take,
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
    <TReturnType, TUrl extends string | string[] | Record<string, string>>(
        loaderConstructorFactory: (inputs: TUrl) => NgtAnyConstructor<NgtLoaderResult<TReturnType>>,
        input: TUrl | Observable<TUrl>,
        extensions?: NgtLoaderExtensions,
        onProgress?: (event: ProgressEvent) => void
    ): Observable<
        TUrl extends string[]
            ? Array<NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>>
            : TUrl extends object
            ? { [key in keyof TUrl]: NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap> }
            : NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>
    >;
    destroy: () => void;
    preLoad: <TReturnType, TUrl extends string | string[] | Record<string, string>>(
        loaderConstructorFactory: (inputs: TUrl) => NgtAnyConstructor<NgtLoaderResult<TReturnType>>,
        inputs: TUrl | Observable<TUrl>,
        extensions?: NgtLoaderExtensions
    ) => void;
}

export type NgtLoaderResults<
    TInput extends string | string[] | Record<string, string>,
    TReturn
> = TInput extends string[] ? TReturn[] : TInput extends object ? { [key in keyof TInput]: TReturn } : TReturn;

const cached = new Map<string, Observable<any>>();

function injectLoader<TReturnType, TUrl extends string | string[] | Record<string, string>>(
    loaderConstructorFactory: (inputs: TUrl) => NgtAnyConstructor<NgtLoaderResult<TReturnType>>,
    input: TUrl | Observable<TUrl>,
    extensions?: NgtLoaderExtensions,
    onProgress?: (event: ProgressEvent) => void
): Observable<NgtLoaderResults<TUrl, NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap>>> {
    const urls$ = isObservable(input) ? input : of(input);

    return urls$.pipe(
        map((inputs) => {
            const loaderConstructor = loaderConstructorFactory(inputs);
            const loader = new loaderConstructor();
            if (extensions) {
                extensions(loader);
            }
            const urls = Array.isArray(inputs) ? inputs : typeof inputs === 'string' ? [inputs] : Object.values(inputs);
            return [
                urls.map((url) => {
                    if (!cached.has(url)) {
                        cached.set(
                            url,
                            from(loader.loadAsync(url, onProgress)).pipe(
                                tap((data) => {
                                    if (data.scene) {
                                        Object.assign(data, makeObjectGraph(data.scene));
                                    }
                                }),
                                retry(2),
                                catchError((err) => {
                                    console.error(`[NGT] Error loading ${url}: ${err.message}`);
                                    return of([]);
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
                map((results) => {
                    if (Array.isArray(inputs)) return results;
                    if (typeof inputs === 'string') return results[0];
                    const keys = Object.keys(inputs);
                    return keys.reduce((result, key) => {
                        result[key as keyof typeof result] = results[keys.indexOf(key)];
                        return result;
                    }, {} as { [key in keyof TUrl]: NgtBranchingReturn<TReturnType, GLTF, GLTF & NgtObjectMap> });
                })
            );
        })
    );
}

(injectLoader as NgtLoader).destroy = () => {
    cached.clear();
};

(injectLoader as NgtLoader).preLoad = (loaderConstructorFactory, inputs, extensions) => {
    injectLoader(loaderConstructorFactory, inputs, extensions).pipe(take(1)).subscribe();
};
export const injectNgtLoader = injectLoader as NgtLoader;

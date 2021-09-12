import { Injectable, OnDestroy } from '@angular/core';
import { defer, forkJoin, Observable, of, shareReplay, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import type { Material, Object3D, Scene } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type {
  BranchingReturn,
  LoaderExtensions,
  ThreeLoaderResult,
  ThreeObjectMap,
  UnknownRecord,
} from '../typings';

@Injectable({
  providedIn: 'root',
})
export class LoaderService implements OnDestroy {
  private readonly cached = new Map<string, BranchingReturn>();

  use<TReturnType, TUrl extends string | string[]>(
    loaderConstructor: new () => ThreeLoaderResult<TReturnType>,
    input: TUrl,
    extensions?: LoaderExtensions,
    onProgress?: (event: ProgressEvent) => void
  ): TUrl extends any[]
    ? Observable<BranchingReturn<TReturnType, GLTF, GLTF & ThreeObjectMap>[]>
    : Observable<BranchingReturn<TReturnType, GLTF, GLTF & ThreeObjectMap>> {
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
              Object.assign(data, this.buildGraph(data.scene as Scene));
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
      BranchingReturn<TReturnType, GLTF, GLTF & ThreeObjectMap>[]
    >;

    return defer(() =>
      Array.isArray(input)
        ? results$
        : results$.pipe(map((results) => results[0]))
    ).pipe(shareReplay({ bufferSize: 1, refCount: true })) as TUrl extends any[]
      ? Observable<BranchingReturn<TReturnType, GLTF, GLTF & ThreeObjectMap>[]>
      : Observable<BranchingReturn<TReturnType, GLTF, GLTF & ThreeObjectMap>>;
  }

  ngOnDestroy() {
    this.cached.clear();
  }

  private buildGraph(object: Object3D): ThreeObjectMap {
    const data: ThreeObjectMap = { nodes: {}, materials: {} };
    if (object) {
      object.traverse((obj) => {
        if (obj.name) {
          data.nodes[obj.name] = obj;
        }
        if (
          (obj as unknown as UnknownRecord).material &&
          !data.materials[
            (
              (obj as unknown as UnknownRecord)
                .material as unknown as UnknownRecord
            ).name as string
          ]
        ) {
          data.materials[
            (
              (obj as unknown as UnknownRecord)
                .material as unknown as UnknownRecord
            ).name as string
          ] = (obj as unknown as UnknownRecord).material as Material;
        }
      });
    }
    return data;
  }
}

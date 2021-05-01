import type { Loader, Material, Object3D } from 'three';

export interface ThreeLoader<T> extends Loader {
  load(
    url: string,
    onLoad?: (result: T) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ): unknown;
}

export interface LoaderExtensions {
  (loader: Loader): void;
}

export type ThreeLoaderResult<T> = T extends any[]
  ? ThreeLoader<T[number]>
  : ThreeLoader<T>;

export interface ThreeObjectMap {
  nodes: { [name: string]: Object3D };
  materials: { [name: string]: Material };
}

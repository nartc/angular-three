import * as THREE from 'three';

export interface NgtLoader<T> extends THREE.Loader {
  load(
    url: string,
    onLoad?: (result: T) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ): unknown;
}

export interface LoaderExtensions {
  (loader: THREE.Loader): void;
}

export type NgtLoaderResult<T> = T extends any[]
  ? NgtLoader<T[number]>
  : NgtLoader<T>;

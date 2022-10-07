import { NgtLoader, NgtObjectMap } from '@angular-three/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';
// @ts-ignore
import { MeshoptDecoder } from 'three-stdlib';
import { DRACOLoader } from 'three-stdlib/loaders/DRACOLoader';
import { GLTF, GLTFLoader } from 'three-stdlib/loaders/GLTFLoader';

let dracoLoader: DRACOLoader | null = null;

function _extensions(useDraco: boolean | string, useMeshOpt: boolean, extensions?: (loader: GLTFLoader) => void) {
  return (loader: THREE.Loader) => {
    if (extensions) {
      extensions(loader as GLTFLoader);
    }

    if (useDraco) {
      if (!dracoLoader) {
        dracoLoader = new DRACOLoader();
      }

      dracoLoader.setDecoderPath(
        typeof useDraco === 'string' ? useDraco : 'https://www.gstatic.com/draco/versioned/decoders/1.4.3/'
      );
      (loader as GLTFLoader).setDRACOLoader(dracoLoader);
    }

    if (useMeshOpt) {
      (loader as GLTFLoader).setMeshoptDecoder(
        typeof MeshoptDecoder === 'function' ? MeshoptDecoder() : MeshoptDecoder
      );
    }
  };
}

@Injectable({ providedIn: 'root' })
export class NgtGLTFLoader {
  constructor(private loader: NgtLoader) {}

  load<TInput extends string | string[]>(
    path: TInput,
    useDraco: boolean | string = true,
    useMeshOpt = true,
    extensions?: (loader: GLTFLoader) => void
  ): Observable<TInput extends string[] ? (GLTF & NgtObjectMap)[] : GLTF & NgtObjectMap> {
    return this.loader.use(GLTFLoader, path, _extensions(useDraco, useMeshOpt, extensions)) as Observable<
      TInput extends string[] ? (GLTF & NgtObjectMap)[] : GLTF & NgtObjectMap
    >;
  }
}

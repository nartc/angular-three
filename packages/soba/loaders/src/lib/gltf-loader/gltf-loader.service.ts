import { LoaderService, NgtObjectMap } from '@angular-three/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';
// @ts-ignore
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let dracoLoader: DRACOLoader | null = null;

function _extensions(
  useDraco: boolean | string,
  useMeshOpt: boolean,
  extensions?: (loader: GLTFLoader) => void
) {
  return (loader: THREE.Loader) => {
    if (extensions) {
      extensions(loader as GLTFLoader);
    }

    if (useDraco) {
      if (!dracoLoader) {
        dracoLoader = new DRACOLoader();
      }

      dracoLoader.setDecoderPath(
        typeof useDraco === 'string'
          ? useDraco
          : 'https://www.gstatic.com/draco/versioned/decoders/1.4.3/'
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
export class GLTFLoaderService {
  constructor(private loaderService: LoaderService) {}

  load<TInput extends string | string[]>(
    path: TInput,
    useDraco: boolean | string = true,
    useMeshOpt: boolean = true,
    extensions?: (loader: GLTFLoader) => void
  ): Observable<
    TInput extends any[] ? (GLTF & NgtObjectMap)[] : GLTF & NgtObjectMap
  > {
    return this.loaderService.use(
      GLTFLoader,
      path,
      _extensions(useDraco, useMeshOpt, extensions)
    ) as Observable<
      TInput extends any[] ? (GLTF & NgtObjectMap)[] : GLTF & NgtObjectMap
    >;
  }
}

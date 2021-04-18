import { defer, from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfLoader = new GLTFLoader();

export function loadGLTF(
  url: string,
  onLoad?: (gltf: GLTF) => void,
  beforeLoad?: (loader: GLTFLoader) => void
): Observable<GLTF> {
  return defer(() => {
    if (beforeLoad) {
      beforeLoad(gltfLoader);
    }
    return from(gltfLoader.loadAsync(url));
  }).pipe(
    tap((gltf) => {
      if (onLoad) {
        onLoad(gltf);
      }
    })
  );
}

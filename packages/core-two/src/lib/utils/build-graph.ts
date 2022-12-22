import type { NgtObjectMap } from '../types';

export function buildGraph(object: THREE.Object3D): NgtObjectMap {
  const data: NgtObjectMap = { nodes: {}, materials: {} };
  if (object) {
    object.traverse((obj: THREE.Object3D) => {
      if (obj.name) data.nodes[obj.name] = obj;
      if (
        'material' in obj &&
        !data.materials[((obj as THREE.Mesh).material as THREE.Material).name]
      ) {
        data.materials[((obj as THREE.Mesh).material as THREE.Material).name] = (obj as THREE.Mesh)
          .material as THREE.Material;
      }
    });
  }
  return data;
}

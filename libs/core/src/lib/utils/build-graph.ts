import * as THREE from 'three';
import type { NgtObjectMap, UnknownRecord } from '../types';

export function buildGraph(object: THREE.Object3D): NgtObjectMap {
    const data: NgtObjectMap = { nodes: {}, materials: {} };
    if (object) {
        object.traverse((obj) => {
            if (obj.name) {
                data.nodes[obj.name] = obj;
            }
            if (
                (obj as unknown as UnknownRecord)['material'] &&
                !data.materials[
                    (
                        (obj as unknown as UnknownRecord)[
                            'material'
                        ] as unknown as UnknownRecord
                    )['name'] as string
                ]
            ) {
                data.materials[
                    (
                        (obj as unknown as UnknownRecord)[
                            'material'
                        ] as unknown as UnknownRecord
                    )['name'] as string
                ] = (obj as unknown as UnknownRecord)[
                    'material'
                ] as THREE.Material;
            }
        });
    }
    return data;
}

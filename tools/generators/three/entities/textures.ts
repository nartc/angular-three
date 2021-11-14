import * as THREE from 'three';
import type { EntityCollection } from '../models/entity-collection.model';

export const textures: EntityCollection = {
  core: [
    THREE.CanvasTexture,
    THREE.CompressedTexture,
    THREE.CubeTexture,
    THREE.DataTexture,
    THREE.DataTexture2DArray,
    THREE.DataTexture3D,
    THREE.DepthTexture,
    THREE.VideoTexture,
  ].map((m) => m.name),
};

import { createRefInjection } from '../utils/inject';
import { provideMaterialGeometryRef } from './material-geometry';

export const [injectCommonMeshRef, provideCommonMeshRef, NGT_COMMON_MESH_REF] =
  createRefInjection('NgtCommonMesh ref', provideMaterialGeometryRef);

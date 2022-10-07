import { createRefInjection } from '../utils/inject';
import { provideObjectRef } from './object';

export const [injectCommonMeshRef, provideCommonMeshRef, NGT_COMMON_MESH_REF] = createRefInjection(
  'NgtCommonMesh ref',
  provideObjectRef
);

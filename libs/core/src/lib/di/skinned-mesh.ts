import { createRefInjection } from '../utils/inject';

export const [injectSkinnedMeshHostRef, provideSkinnedMeshHostRef, NGT_HOST_SKINNED_MESH_REF] = createRefInjection(
  'NgtSkinnedMesh host ref',
  true
);

export const [injectSkeletonHostRef, provideSkeletonHostRef, NGT_HOST_SKELETON_REF] = createRefInjection(
  'NgtSkeleton host ref',
  true
);

export const [injectBoneHostRef, provideBoneHostRef, NGT_HOST_BONE_REF] = createRefInjection('NgtBone host ref', true);

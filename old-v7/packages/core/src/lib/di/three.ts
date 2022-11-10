import { createRefInjection } from '../utils/inject';

// instance
export const [injectInstanceRef, provideInstanceRef, NGT_INSTANCE_REF] = createRefInjection('NgtInstance ref');
export const [injectInstanceHostRef, provideInstanceHostRef, NGT_INSTANCE_HOST_REF] =
  createRefInjection('NgtInstance host ref');

// object
export const [injectObjectRef, provideObjectRef, NGT_OBJECT_REF] = createRefInjection(
  'NgtObject ref',
  provideInstanceRef
);
export const [injectObjectHostRef, provideObjectHostRef, NGT_OBJECT_HOST_REF] = createRefInjection(
  'NgtObject host ref',
  true,
  provideInstanceHostRef
);
export const [injectCameraRef, provideCameraRef, NGT_CAMERA_REF] = createRefInjection('NgtCamera ref');
export const [injectSceneRef, provideSceneRef, NGT_SCENE_REF] = createRefInjection('NgtScene ref');

// material geometry object
export const [injectMaterialGeometryRef, provideMaterialGeometryRef, NGT_MATERIAL_GEOMETRY_REF] = createRefInjection(
  'NgtMaterialGeometry ref',
  provideObjectRef
);

// common attribute
export const [injectCommonAttributeRef, provideCommonAttributeRef, NGT_COMMON_ATTRIBUTE_REF] = createRefInjection(
  'NgtCommonAttribute ref',
  provideInstanceRef
);

// common audio
export const [injectCommonAudioRef, provideCommonAudioRef, NGT_COMMON_AUDIO_REF] = createRefInjection(
  'NgtCommonAudio ref',
  provideObjectRef
);

// common camera
export const [injectCommonCameraRef, provideCommonCameraRef, NGT_COMMON_CAMERA_REF] = createRefInjection(
  'NgtCommonCamera ref',
  provideObjectRef
);

// common curve
export const [injectCommonCurveRef, provideCommonCurveRef, NGT_COMMON_CURVE_REF] = createRefInjection(
  'NgtCommonCurve ref',
  provideInstanceRef
);

// common geometry
export const [injectCommonGeometryRef, provideCommonGeometryRef, NGT_COMMON_GEOMETRY_REF] = createRefInjection(
  'NgtCommonGeometry ref',
  provideInstanceRef
);

// common helper
export const [injectCommonHelperRef, provideCommonHelperRef, NGT_COMMON_HELPER_REF] = createRefInjection(
  'NgtCommonHelper ref',
  provideObjectRef
);
export const [injectCommonObjectHelperRef, provideCommonObjectHelperRef, NGT_COMMON_OBJECT_HELPER_REF] =
  createRefInjection('NgtCommonObjectHelper ref', provideInstanceRef);

// common light
export const [injectCommonLightRef, provideCommonLightRef, NGT_COMMON_LIGHT_REF] = createRefInjection(
  'NgtCommonLight ref',
  provideObjectRef
);

// common material
export const [injectCommonMaterialRef, provideCommonMaterialRef, NGT_COMMON_MATERIAL_REF] = createRefInjection(
  'NgtCommonMaterial ref',
  provideInstanceRef
);

// common mesh
export const [injectCommonMeshRef, provideCommonMeshRef, NGT_COMMON_MESH_REF] = createRefInjection(
  'NgtCommonMesh ref',
  provideMaterialGeometryRef
);

export const [injectSkinnedMeshHostRef, provideSkinnedMeshHostRef, NGT_HOST_SKINNED_MESH_REF] = createRefInjection(
  'NgtSkinnedMesh host ref',
  true
);

// skinned mesh
export const [injectSkeletonHostRef, provideSkeletonHostRef, NGT_HOST_SKELETON_REF] = createRefInjection(
  'NgtSkeleton host ref',
  true
);
export const [injectBoneHostRef, provideBoneHostRef, NGT_HOST_BONE_REF] = createRefInjection('NgtBone host ref', true);

// common texture
export const [injectCommonTextureRef, provideCommonTextureRef, NGT_COMMON_TEXTURE_REF] = createRefInjection(
  'NgtCommonTexture ref',
  provideInstanceRef
);

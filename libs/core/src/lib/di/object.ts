import { createRefInjection } from '../utils/inject';
import { provideInstanceHostRef, provideInstanceRef } from './instance';

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

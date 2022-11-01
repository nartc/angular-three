import { createRefInjection } from '../utils/inject';
import { provideObjectRef } from './object';

export const [
  injectCommonCameraRef,
  provideCommonCameraRef,
  NGT_COMMON_CAMERA_REF,
] = createRefInjection('NgtCommonCamera ref', provideObjectRef);

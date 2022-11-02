import { createRefInjection } from '../utils/inject';
import { provideObjectRef } from './object';

export const [
  injectCommonLightRef,
  provideCommonLightRef,
  NGT_COMMON_LIGHT_REF,
] = createRefInjection('NgtCommonLight ref', provideObjectRef);

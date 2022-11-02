import { createRefInjection } from '../utils/inject';
import { provideInstanceRef } from './instance';

export const [
  injectCommonTextureRef,
  provideCommonTextureRef,
  NGT_COMMON_TEXTURE_REF,
] = createRefInjection('NgtCommonTexture ref', provideInstanceRef);

import { createRefInjection } from '../utils/inject';
import { provideObjectRef } from './object';

export const [injectCommonSpriteRef, provideCommonSpriteRef, NGT_COMMON_SPRITE_REF] = createRefInjection(
  'NgtCommonSprite ref',
  provideObjectRef
);

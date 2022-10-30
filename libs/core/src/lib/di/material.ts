import { createRefInjection } from '../utils/inject';
import { provideInstanceRef } from './instance';

export const [
  injectCommonMaterialRef,
  provideCommonMaterialRef,
  NGT_COMMON_MATERIAL_REF,
] = createRefInjection('NgtCommonMaterial ref', provideInstanceRef);

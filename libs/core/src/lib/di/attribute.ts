import { createRefInjection } from '../utils/inject';
import { provideInstanceRef } from './instance';

export const [
  injectCommonAttributeRef,
  provideCommonAttributeRef,
  NGT_COMMON_ATTRIBUTE_REF,
] = createRefInjection('NgtCommonAttribute ref', provideInstanceRef);

import { createRefInjection } from '../utils/inject';
import { provideInstanceRef } from './instance';
import { provideObjectRef } from './object';

export const [injectCommonHelperRef, provideCommonHelperRef, NGT_COMMON_HELPER_REF] = createRefInjection(
  'NgtCommonHelper ref',
  provideObjectRef
);
export const [injectCommonObjectHelperRef, provideCommonObjectHelperRef, NGT_COMMON_OBJECT_HELPER_REF] =
  createRefInjection('NgtCommonObjectHelper ref', provideInstanceRef);

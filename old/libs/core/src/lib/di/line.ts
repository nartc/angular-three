import { createRefInjection } from '../utils/inject';
import { provideObjectRef } from './object';

export const [injectCommonLineRef, provideCommonLineRef, NGT_COMMON_LINE_REF] = createRefInjection(
  'NgtCommonLine ref',
  provideObjectRef
);

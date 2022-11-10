import { createRefInjection } from '../utils/inject';
import { provideInstanceRef } from './instance';

export const [
  injectCommonCurveRef,
  provideCommonCurveRef,
  NGT_COMMON_CURVE_REF,
] = createRefInjection('NgtCommonCurve ref', provideInstanceRef);

import { createRefInjection } from '../utils/inject';
import { provideInstanceRef } from './instance';

export const [
  injetCommonGeometryRef,
  provideCommonGeometryRef,
  NGT_COMMON_GEOMETRY_REF,
] = createRefInjection('NgtCommonGeometry ref', provideInstanceRef);

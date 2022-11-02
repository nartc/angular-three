import { createRefInjection } from '../utils/inject';
import { provideObjectRef } from './object';

export const [
  injectMaterialGeometryRef,
  provideMaterialGeometryRef,
  NGT_MATERIAL_GEOMETRY_REF,
] = createRefInjection('NgtMaterialGeometry ref', provideObjectRef);

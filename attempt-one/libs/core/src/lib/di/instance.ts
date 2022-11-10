import { createRefInjection } from '../utils/inject';

export const [injectInstanceRef, provideInstanceRef, NGT_INSTANCE_REF] =
  createRefInjection('NgtInstance ref');
export const [
  injectInstanceHostRef,
  provideInstanceHostRef,
  NGT_INSTANCE_HOST_REF,
] = createRefInjection('NgtInstance host ref');

import { InjectionToken } from '@angular/core';
import { BodyShapeType } from '../models/body';
import { ArgFn } from '../models/types';

export const NGT_PHYSIC_BODY_ARGS_FN = new InjectionToken<ArgFn<unknown>>(
  'ArgsFn for NgtPhysicBody',
  {
    providedIn: 'root',
    factory:
      () =>
      (...args: unknown[]) =>
        args,
  }
);

export const NGT_PHYSIC_BODY_TYPE = new InjectionToken<BodyShapeType>(
  'Body Type for Physic'
);

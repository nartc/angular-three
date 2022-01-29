import { InjectionToken } from '@angular/core';
import { ConstraintTypes } from '../models/constraints';

export const NGT_PHYSIC_CONSTRAINT_TYPE = new InjectionToken<
  'Hinge' | ConstraintTypes
>('Constraint type for Physic');

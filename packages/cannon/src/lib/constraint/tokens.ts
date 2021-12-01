import { ConstraintTypes } from '@angular-three/cannon';
import { InjectionToken } from '@angular/core';

export const NGT_PHYSIC_CONSTRAINT_TYPE = new InjectionToken<
  'Hinge' | ConstraintTypes
>('Constraint type for Physic');

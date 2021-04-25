import { InjectionToken } from '@angular/core';
import type { Material, Object3D } from 'three';

export const THREE_POPABLE = new InjectionToken<
  () => Object3D | Material | null
>('Injection token for popable object getter');

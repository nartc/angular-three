import { InjectionToken, Type } from '@angular/core';
import * as THREE from 'three';
import type { AnyFunction } from '../types';

export const NGT_PARENT_OBJECT = new InjectionToken<AnyFunction>(
  'THREE_OBJECT_3D as Parent'
);

export function createParentObjectProvider<TExisting extends Type<any>>(
  existing: TExisting,
  factory: (existing: InstanceType<TExisting>) => THREE.Object3D
) {
  return {
    provide: NGT_PARENT_OBJECT,
    useFactory: (existing: InstanceType<TExisting>) => {
      return () => factory?.(existing);
    },
    deps: [existing],
  };
}

import { InjectionToken, Optional, Provider, Type } from '@angular/core';
import * as THREE from 'three';
import {
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObjectController,
} from '../controllers/object.controller';
import {
  NGT_WITH_MATERIAL_WATCHED_CONTROLLER,
  NgtWithMaterialController,
} from '../controllers/with-material.controller';
import { NgtExtender } from '../three/extender';
import { AnyFunction } from '../types';

export const NGT_OBJECT = new InjectionToken<AnyFunction>('THREE_OBJECT_3D');
export const NGT_OBJECT_PROVIDER: Provider = {
  provide: NGT_OBJECT,
  useFactory: (
    extender: NgtExtender<THREE.Object3D>,
    objectController: NgtObjectController,
    withMaterialController: NgtWithMaterialController
  ) => {
    return () => {
      if (
        extender &&
        extender.object &&
        withMaterialController &&
        'material' in extender.object
      )
        return extender.object;
      if (objectController) return objectController.object;
      return null;
    };
  },
  deps: [
    [new Optional(), NgtExtender],
    [new Optional(), NGT_OBJECT_WATCHED_CONTROLLER],
    [new Optional(), NGT_WITH_MATERIAL_WATCHED_CONTROLLER],
  ],
};

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

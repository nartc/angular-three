import { InjectionToken, Optional, Provider } from '@angular/core';
import * as THREE from 'three';
import {
  NGT_CONTENT_MATERIAL_WATCHED_CONTROLLER,
  NgtContentMaterialController,
} from '../controllers/content-material.controller';
import {
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
} from '../controllers/object-3d.controller';
import { NgtSobaExtender } from '../three/extender';
import { AnyFunction } from '../types';

export const NGT_OBJECT_3D = new InjectionToken<AnyFunction<THREE.Object3D>>(
  'THREE_OBJECT_3D'
);
export const NGT_OBJECT_3D_PROVIDER: Provider = {
  provide: NGT_OBJECT_3D,
  useFactory: (
    sobaExtender: NgtSobaExtender<THREE.Object3D>,
    objectController: NgtObject3dController,
    contentMaterialController: NgtContentMaterialController
  ) => {
    return () => {
      if (
        sobaExtender &&
        contentMaterialController &&
        'material' in sobaExtender.object
      )
        return sobaExtender.object;
      if (objectController) return objectController.object3d;
      return null;
    };
  },
  deps: [
    [new Optional(), NgtSobaExtender],
    [new Optional(), NGT_OBJECT_WATCHED_CONTROLLER],
    [new Optional(), NGT_CONTENT_MATERIAL_WATCHED_CONTROLLER],
  ],
};

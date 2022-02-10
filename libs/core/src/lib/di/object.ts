import { InjectionToken, Optional, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObjectController } from '../controllers/object.controller';
import { NgtWithMaterialController } from '../controllers/with-material.controller';
import { NgtExtender } from '../three/extender';
import type { AnyFunction } from '../types';

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
        [new Optional(), NgtObjectController],
        [new Optional(), NgtWithMaterialController],
    ],
};

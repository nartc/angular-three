import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonCamera } from '../three/camera';
import { NGT_COMMON_CAMERA_FACTORY } from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideObjectFactory } from './object';

export function provideCommonCameraFactory<
    TCamera extends THREE.Camera,
    TSubCamera extends NgtCommonCamera<TCamera> = NgtCommonCamera<TCamera>
>(
    subCameraType: AnyConstructor<TSubCamera>,
    factory?: (sub: TSubCamera) => THREE.Object3D
): Provider {
    return [
        provideObjectFactory(
            subCameraType as unknown as AnyConstructor<NgtObject>,
            factory as AnyFunction
        ),
        { provide: NgtCommonCamera, useExisting: subCameraType },
        {
            provide: NGT_COMMON_CAMERA_FACTORY,
            useFactory: (subCamera: TSubCamera) => {
                return () => factory?.(subCamera) || subCamera.object3d;
            },
            deps: [subCameraType],
        },
    ];
}

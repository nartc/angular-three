import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonCamera } from '../three/camera';
import { NGT_COMMON_CAMERA_FACTORY, NGT_COMMON_CAMERA_REF } from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideObjectFactory, provideObjectRef } from './object';

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
                return () => factory?.(subCamera) || subCamera.instance.value;
            },
            deps: [subCameraType],
        },
    ];
}

export function provideCommonCameraRef<TType extends AnyConstructor<any>>(
    subCameraType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideObjectRef(subCameraType, factory),
        { provide: NgtCommonCamera, useExisting: subCameraType },
        {
            provide: NGT_COMMON_CAMERA_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subCameraType],
        },
    ];
}

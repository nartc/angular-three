import { Provider } from '@angular/core';
import { NgtCommonCamera } from '../three/camera';
import { NGT_COMMON_CAMERA_REF } from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';
import { provideObjectRef } from './object';

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
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subCameraType],
        },
    ];
}

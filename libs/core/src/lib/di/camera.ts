import { Provider } from '@angular/core';
import { Ref } from '../ref';
import { NgtCommonCamera } from '../three/camera';
import { NGT_COMMON_CAMERA_REF } from '../tokens';
import type { AnyConstructor } from '../types';
import { provideObjectRef } from './object';

export function provideCommonCameraRef<TType extends AnyConstructor<any>>(
    subCameraType: TType,
    factory?: (instance: InstanceType<TType>) => Ref
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

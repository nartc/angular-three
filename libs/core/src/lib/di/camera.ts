import { InjectionToken, Provider } from '@angular/core';
import { NgtObject } from '../abstracts/object';
import { NgtCommonCamera } from '../three/camera';
import type { AnyConstructor } from '../types';
import { provideObjectFactory } from './object';

export const NGT_COMMON_CAMERA_FACTORY = new InjectionToken(
    'NgtCommonCamera factory'
);

export function provideCommonCameraFactory<TSubCamera extends NgtCommonCamera>(
    subCameraType: AnyConstructor<TSubCamera>
): Provider {
    return [
        provideObjectFactory(
            subCameraType as unknown as AnyConstructor<NgtObject>
        ),
        { provide: NgtCommonCamera, useExisting: subCameraType },
        {
            provide: NGT_COMMON_CAMERA_FACTORY,
            useFactory: (subCamera: TSubCamera) => {
                return () => subCamera.object;
            },
            deps: [subCameraType],
        },
    ];
}

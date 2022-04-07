import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtObject } from '../abstracts/object';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideInstanceFactory } from './instance';

export const NGT_OBJECT_FACTORY = new InjectionToken<AnyFunction>(
    'NgtObject factory'
);

export function provideObjectFactory<
    TObject extends THREE.Object3D,
    TSubObject extends NgtObject<TObject> = NgtObject<TObject>
>(subObjectType: AnyConstructor<TSubObject>): Provider {
    return [
        provideInstanceFactory<TObject>(
            subObjectType as unknown as AnyConstructor<NgtInstance<TObject>>
        ),
        { provide: NgtObject, useExisting: subObjectType },
        {
            provide: NGT_OBJECT_FACTORY,
            useFactory: (subObject: TSubObject) => {
                return () => subObject.object3d;
            },
            deps: [subObjectType],
        },
    ];
}

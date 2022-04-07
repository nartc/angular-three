import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtObject, NgtObjectState } from '../abstracts/object';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideInstanceFactory } from './instance';

export const NGT_OBJECT_FACTORY = new InjectionToken<AnyFunction>(
    'NgtObject factory'
);

export function provideObjectFactory<
    TObject extends THREE.Object3D,
    TObjectState extends NgtObjectState<TObject> = NgtObjectState<TObject>,
    TSubObject extends NgtObject<TObject, TObjectState> = NgtObject<
        TObject,
        TObjectState
    >
>(
    subObjectType: AnyConstructor<TSubObject>,
    factory?: (sub: TSubObject) => TObject
): Provider {
    return [
        provideInstanceFactory<TObject>(
            subObjectType as unknown as AnyConstructor<NgtInstance<TObject>>
        ),
        { provide: NgtObject, useExisting: subObjectType },
        {
            provide: NGT_OBJECT_FACTORY,
            useFactory: (subObject: TSubObject) => {
                return () => factory?.(subObject) || subObject.object3d;
            },
            deps: [subObjectType],
        },
    ];
}

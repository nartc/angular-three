import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtWrapper } from '../abstracts/wrapper';
import { NGT_WRAPPED_OBJECT_FACTORY } from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideObjectFactory } from './object';

export function provideWrappedObjectFactory<
    TObject extends THREE.Object3D,
    TWrapper extends NgtWrapper<TObject> = NgtWrapper<TObject>
>(
    wrapper: AnyConstructor<TWrapper>,
    factory?: (wrapper: TWrapper) => TObject
): Provider {
    return [
        provideObjectFactory(
            wrapper as any,
            factory ? (factory as AnyFunction) : (sub: TWrapper) => sub.wrapped
        ),
        {
            provide: NGT_WRAPPED_OBJECT_FACTORY,
            useFactory: (subWrapper: TWrapper) => {
                return () => factory?.(subWrapper) || subWrapper.wrapped;
            },
            deps: [wrapper],
        },
    ];
}

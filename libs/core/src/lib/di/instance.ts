import { Provider } from '@angular/core';
import { NgtInstance } from '../abstracts/instance';
import { Ref } from '../ref';
import { NGT_INSTANCE_HOST_REF, NGT_INSTANCE_REF } from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';

export function provideInstanceRef<TType extends AnyConstructor<any>>(
    subType: TType,
    factory?: (instance: InstanceType<TType>) => Ref
): Provider {
    return [
        { provide: NgtInstance, useExisting: subType },
        {
            provide: NGT_INSTANCE_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subType],
        },
    ];
}

export function provideInstanceHostRef<TType extends AnyConstructor<any>>(
    subType: TType,
    factory: (instance: InstanceType<TType>) => Ref,
    hostFactory?: (instance: InstanceType<TType>) => AnyFunction<Ref>
): Provider {
    return [
        {
            provide: NGT_INSTANCE_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory(instance);
            },
            deps: [subType],
        },
        {
            provide: NGT_INSTANCE_HOST_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return hostFactory
                    ? hostFactory(instance)
                    : () => instance.parent;
            },
            deps: [subType],
        },
    ];
}

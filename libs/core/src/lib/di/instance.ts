import { Provider } from '@angular/core';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import {
    NGT_INSTANCE_FACTORY,
    NGT_INSTANCE_HOST_REF,
    NGT_INSTANCE_REF,
} from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';

export function provideInstanceFactory<
    TInstance extends object,
    TInstanceState extends NgtInstanceState<TInstance> = NgtInstanceState<TInstance>,
    TSubInstance extends NgtInstance<TInstance, TInstanceState> = NgtInstance<
        TInstance,
        TInstanceState
    >
>(
    subInstanceType: AnyConstructor<TSubInstance>,
    factory?: (sub: TSubInstance) => TInstance
): Provider {
    return [
        { provide: NgtInstance, useExisting: subInstanceType },
        {
            provide: NGT_INSTANCE_FACTORY,
            useFactory: (subInstance: TSubInstance) => {
                return () =>
                    factory?.(subInstance) || subInstance.instance.value;
            },
            deps: [subInstanceType],
        },
    ];
}

export function provideInstanceRef<TType extends AnyConstructor<any>>(
    subType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        { provide: NgtInstance, useExisting: subType },
        {
            provide: NGT_INSTANCE_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subType],
        },
    ];
}

export function provideInstanceHostRef<TType extends AnyConstructor<any>>(
    subType: TType,
    factory: (instance: InstanceType<TType>) => NgtRef,
    hostFactory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        { provide: NGT_INSTANCE_REF, useFactory: factory, deps: [subType] },
        {
            provide: NGT_INSTANCE_HOST_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return hostFactory?.(instance) || instance.parent;
            },
            deps: [subType],
        },
    ];
}

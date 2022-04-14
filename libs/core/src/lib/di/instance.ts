import { Provider } from '@angular/core';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { NGT_INSTANCE_FACTORY } from '../tokens';
import type { AnyConstructor } from '../types';

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

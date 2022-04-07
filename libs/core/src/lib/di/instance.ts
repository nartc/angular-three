import { InjectionToken, Provider, Type } from '@angular/core';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import type { AnyConstructor, AnyFunction } from '../types';

export const NGT_INSTANCE_FACTORY = new InjectionToken<AnyFunction>(
    'NgtInstance Factory'
);

export function provideInstanceFactory<
    TInstance extends object,
    TInstanceState extends NgtInstanceState<TInstance> = NgtInstanceState<TInstance>,
    TSubInstance extends NgtInstance<TInstance, TInstanceState> = NgtInstance<
        TInstance,
        TInstanceState
    >
>(subInstanceType: AnyConstructor<TSubInstance>): Provider {
    return [
        { provide: NgtInstance, useExisting: subInstanceType },
        {
            provide: NGT_INSTANCE_FACTORY,
            useFactory: (subInstance: TSubInstance) => {
                return () => subInstance.instance;
            },
            deps: [subInstanceType],
        },
    ];
}

export function provideSceneInstanceFactory(canvasType: Type<any>): Provider {
    return {
        provide: NGT_INSTANCE_FACTORY,
        useFactory: (canvas: any) => {
            return () => canvas.scene;
        },
        deps: [canvasType],
    };
}

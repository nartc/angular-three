import { InjectionToken, Provider, Type } from '@angular/core';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import type { AnyConstructor, AnyFunction } from '../types';

export const NGT_INSTANCE_FACTORY = new InjectionToken<AnyFunction>(
    'NgtInstance Factory'
);

export const NGT_CAMERA_INSTANCE_FACTORY = new InjectionToken<AnyFunction>(
    'NgtInstance factory for root Camera'
);

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
                return () => factory?.(subInstance) || subInstance.instance;
            },
            deps: [subInstanceType],
        },
    ];
}

export function provideCanvasInstanceFactory(canvasType: Type<any>): Provider {
    return [
        {
            provide: NGT_INSTANCE_FACTORY,
            useFactory: (canvas: any) => {
                return () => canvas.scene;
            },
            deps: [canvasType],
        },
        {
            provide: NGT_CAMERA_INSTANCE_FACTORY,
            useFactory: (canvas: any) => {
                return () => canvas.camera;
            },
            deps: [canvasType],
        },
    ];
}

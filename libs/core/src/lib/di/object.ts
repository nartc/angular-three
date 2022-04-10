import { InjectionToken, Provider, Type } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtObject, NgtObjectState } from '../abstracts/object';
import type { AnyConstructor, AnyFunction } from '../types';
import { NGT_INSTANCE_FACTORY, provideInstanceFactory } from './instance';

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

export const NGT_CAMERA_INSTANCE_FACTORY = new InjectionToken<AnyFunction>(
    'NgtObject factory for root Camera'
);

export const NGT_SCENE_INSTANCE_FACTORY = new InjectionToken<AnyFunction>(
    'NgtObject factory for root Scene'
);

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
            provide: NGT_OBJECT_FACTORY,
            useFactory: (canvas: any) => {
                return () => canvas.scene;
            },
            deps: [canvasType],
        },
        {
            provide: NGT_SCENE_INSTANCE_FACTORY,
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

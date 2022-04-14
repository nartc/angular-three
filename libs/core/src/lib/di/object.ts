import { Provider, Type } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtObject, NgtObjectInputsState } from '../abstracts/object';
import {
    NGT_CAMERA_INSTANCE_FACTORY,
    NGT_INSTANCE_FACTORY,
    NGT_OBJECT_FACTORY,
    NGT_SCENE_INSTANCE_FACTORY,
} from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideInstanceFactory } from './instance';

export function provideObjectFactory<
    TObject extends THREE.Object3D,
    TObjectState extends NgtObjectInputsState<TObject> = NgtObjectInputsState<TObject>,
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
            subObjectType as unknown as AnyConstructor<NgtInstance<TObject>>,
            factory as AnyFunction
        ),
        { provide: NgtObject, useExisting: subObjectType },
        {
            provide: NGT_OBJECT_FACTORY,
            useFactory: (subObject: TSubObject) => {
                return () => factory?.(subObject) || subObject.instance.value;
            },
            deps: [subObjectType],
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

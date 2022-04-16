import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtObject, NgtObjectInputsState } from '../abstracts/object';
import {
    NGT_CAMERA_REF,
    NGT_INSTANCE_HOST_REF,
    NGT_INSTANCE_REF,
    NGT_OBJECT_FACTORY,
    NGT_OBJECT_HOST_REF,
    NGT_OBJECT_REF,
    NGT_SCENE_REF,
} from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideInstanceFactory, provideInstanceRef } from './instance';

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

export function provideObjectRef<TType extends AnyConstructor<any>>(
    subType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef<THREE.Object3D>
): Provider {
    return [
        provideInstanceRef(subType, factory),
        { provide: NgtObject, useExisting: subType },
        {
            provide: NGT_OBJECT_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subType],
        },
    ];
}

export function provideObjectHosRef<TType extends AnyConstructor<any>>(
    subType: TType,
    factory: (instance: InstanceType<TType>) => NgtRef<THREE.Object3D>,
    hostFactory?: (instance: InstanceType<TType>) => NgtRef<THREE.Object3D>
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
        { provide: NGT_OBJECT_REF, useFactory: factory, deps: [subType] },
        {
            provide: NGT_OBJECT_HOST_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return hostFactory?.(instance) || instance.parent;
            },
            deps: [subType],
        },
    ];
}

export function provideCanvasInstanceRef<TType extends AnyConstructor<any>>(
    canvasType: TType
): Provider {
    return [
        {
            provide: NGT_INSTANCE_REF,
            useFactory: (canvas: InstanceType<TType>) => {
                return canvas.sceneRef;
            },
            deps: [canvasType],
        },
        {
            provide: NGT_OBJECT_REF,
            useFactory: (canvas: InstanceType<TType>) => {
                return canvas.sceneRef;
            },
            deps: [canvasType],
        },
        {
            provide: NGT_SCENE_REF,
            useFactory: (canvas: InstanceType<TType>) => {
                return canvas.sceneRef;
            },
            deps: [canvasType],
        },
        {
            provide: NGT_CAMERA_REF,
            useFactory: (canvas: InstanceType<TType>) => {
                return canvas.cameraRef;
            },
            deps: [canvasType],
        },
    ];
}

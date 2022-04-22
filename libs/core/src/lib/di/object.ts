import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject, NgtObjectInputs } from '../abstracts/object';
import {
    NGT_CAMERA_REF,
    NGT_INSTANCE_HOST_REF,
    NGT_INSTANCE_REF,
    NGT_OBJECT_HOST_REF,
    NGT_OBJECT_REF,
    NGT_SCENE_REF,
} from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideInstanceRef } from './instance';

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
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subType],
        },
    ];
}

export function provideObjectHosRef<TType extends AnyConstructor<any>>(
    subType: TType,
    factory: (instance: InstanceType<TType>) => NgtRef,
    hostFactory?: (instance: InstanceType<TType>) => AnyFunction<NgtRef>
): Provider {
    return [
        { provide: NgtObject, useExisting: subType },
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
        {
            provide: NGT_OBJECT_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory(instance);
            },
            deps: [subType],
        },
        {
            provide: NGT_OBJECT_HOST_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return hostFactory
                    ? hostFactory(instance)
                    : () => instance.parent;
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
                return () => canvas.sceneRef;
            },
            deps: [canvasType],
        },
        {
            provide: NGT_OBJECT_REF,
            useFactory: (canvas: InstanceType<TType>) => {
                return () => canvas.sceneRef;
            },
            deps: [canvasType],
        },
        {
            provide: NGT_SCENE_REF,
            useFactory: (canvas: InstanceType<TType>) => {
                return () => canvas.sceneRef;
            },
            deps: [canvasType],
        },
        {
            provide: NGT_CAMERA_REF,
            useFactory: (canvas: InstanceType<TType>) => {
                return () => canvas.cameraRef;
            },
            deps: [canvasType],
        },
    ];
}

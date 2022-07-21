import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { Ref } from '../ref';
import {
  NGT_CAMERA_REF,
  NGT_INSTANCE_HOST_REF,
  NGT_INSTANCE_REF,
  NGT_OBJECT_HOST_REF,
  NGT_OBJECT_REF,
  NGT_SCENE_REF,
} from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideInstanceRef } from './instance';

export function provideObjectRef<TType extends AnyConstructor<any>>(
  subType: TType,
  factory?: (instance: InstanceType<TType>) => Ref<THREE.Object3D>
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

export function provideObjectHostRef<TType extends AnyConstructor<any>>(
  subType: TType,
  factory?: (instance: InstanceType<TType>) => Ref,
  hostFactory?: (instance: InstanceType<TType>) => AnyFunction<Ref>
): Provider {
  return [
    { provide: NgtObject, useExisting: subType },
    {
      provide: NGT_INSTANCE_REF,
      useFactory: (instance: InstanceType<TType>) => {
        return () => (factory ? factory(instance) : instance['instance']);
      },
      deps: [subType],
    },
    {
      provide: NGT_INSTANCE_HOST_REF,
      useFactory: (instance: InstanceType<TType>) => {
        return hostFactory ? hostFactory(instance) : instance.parentRef;
      },
      deps: [subType],
    },
    {
      provide: NGT_OBJECT_REF,
      useFactory: (instance: InstanceType<TType>) => {
        return () => (factory ? factory(instance) : instance['instance']);
      },
      deps: [subType],
    },
    {
      provide: NGT_OBJECT_HOST_REF,
      useFactory: (instance: InstanceType<TType>) => {
        return hostFactory ? hostFactory(instance) : instance.parentRef;
      },
      deps: [subType],
    },
  ];
}

export function provideCanvasInstanceRef<TType extends AnyConstructor<any>>(canvasType: TType): Provider {
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

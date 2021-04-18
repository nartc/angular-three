import { Injectable } from '@angular/core';
import type { BufferGeometry, Material } from 'three';
import type { InstancesStoreState, ThreeInstance } from '../typings';
import { ImperativeComponentStore } from './imperative-component-store.abstract';

@Injectable()
export class InstancesStore extends ImperativeComponentStore<InstancesStoreState> {
  constructor() {
    super({ materials: {}, bufferGeometries: {}, objects: {} });
  }

  readonly saveMaterial = this.updater<{
    material: Material;
    id?: string;
  }>((state, { material, id = material.uuid }) => ({
    ...state,
    materials: { ...state.materials, [id]: material },
  }));

  readonly saveBufferGeometry = this.updater<{
    bufferGeometry: BufferGeometry;
    id?: string;
  }>((state, { bufferGeometry, id = bufferGeometry.uuid }) => ({
    ...state,
    bufferGeometries: { ...state.bufferGeometries, [id]: bufferGeometry },
  }));

  readonly saveObject = this.updater<ThreeInstance>((state, obj) => ({
    ...state,
    objects: { ...state.objects, [obj.uuid]: obj },
  }));
}

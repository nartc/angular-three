import { Injectable } from '@angular/core';
import * as THREE from 'three';
import type { InstancesStoreState, NgtInstance } from '../models';
import { EnhancedComponentStore } from './enhanced-component-store.abstract';

@Injectable()
export class InstancesStore extends EnhancedComponentStore<InstancesStoreState> {
  constructor() {
    super({ materials: {}, geometries: {}, objects: {} });
  }

  readonly saveMaterial = this.updater<{
    material: THREE.Material;
    id?: string;
  }>((state, { material, id = material.uuid }) => ({
    ...state,
    materials: { ...state.materials, [id]: material },
  }));

  readonly removeMaterial = this.updater<string>((state, id) => {
    const { [id]: _, ...materials } = state.materials;

    return {
      ...state,
      materials,
    };
  });

  readonly saveGeometry = this.updater<{
    geometry: THREE.BufferGeometry;
    id?: string;
  }>((state, { geometry, id = geometry.uuid }) => ({
    ...state,
    bufferGeometries: { ...state.geometries, [id]: geometry },
  }));

  readonly removeGeometry = this.updater<string>((state, id) => {
    const { [id]: _, ...geometries } = state.geometries;

    return {
      ...state,
      geometries,
    };
  });

  readonly saveObject = this.updater<NgtInstance>((state, obj) => ({
    ...state,
    objects: { ...state.objects, [obj.uuid]: obj },
  }));

  readonly removeObject = this.updater<string>((state, id) => {
    const { [id]: _, ...objects } = state.objects;
    return { ...state, objects };
  });
}

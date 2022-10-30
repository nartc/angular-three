import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtRef } from '../ref';
import { AnyConstructor, UnknownRecord } from '../types';
import { createNgtProvider } from '../utils/inject';
import { is } from '../utils/is';
import { NgtObject, NgtObjectInputsState, provideNgtObject } from './object';

export interface NgtMaterialGeometryState<
  TObject extends THREE.Object3D = THREE.Object3D
> extends NgtObjectInputsState<TObject> {
  material:
    | THREE.Material
    | THREE.Material[]
    | NgtRef<THREE.Material>
    | NgtRef<THREE.Material>[];
  geometry: THREE.BufferGeometry | NgtRef<THREE.BufferGeometry>;
  morphTargetInfluences?: number[];
  morphTargetDictionary?: Record<string, number>;
}

@Directive()
export abstract class NgtMaterialGeometry<
  TMaterialGeometryObject extends THREE.Object3D = THREE.Object3D
> extends NgtObject<
  TMaterialGeometryObject,
  NgtMaterialGeometryState<TMaterialGeometryObject>
> {
  @Input() set material(
    material:
      | THREE.Material
      | THREE.Material[]
      | NgtRef<THREE.Material>
      | NgtRef<THREE.Material>[]
  ) {
    this.set({ material });
  }

  @Input() set geometry(
    geometry: THREE.BufferGeometry | NgtRef<THREE.BufferGeometry>
  ) {
    this.set({ geometry });
  }

  @Input() set morphTargetInfluences(morphTargetInfluences: number[]) {
    this.set({ morphTargetInfluences });
  }

  @Input() set morphTargetDictionary(
    morphTargetDictionary: Record<string, number>
  ) {
    this.set({ morphTargetDictionary });
  }

  abstract get objectType(): AnyConstructor<TMaterialGeometryObject>;

  protected argsKeys: string[] = [];

  protected override instanceInitFn(): TMaterialGeometryObject {
    const state = this.get();

    // this is the additional arguments to pass into the object constructor
    // eg: InstancedMesh has "count" -> objectArgs = [count]
    const objectArgs = this.argsKeys.reduce((args, argKey) => {
      args.push(state[argKey]);
      return args;
    }, [] as unknown[]);

    const object = new this.objectType(
      is.ref(state.geometry) ? state.geometry.value : state.geometry,
      is.arr(state.material)
        ? state.material.map((m) => (is.ref(m) ? m.value : m))
        : is.ref(state.material)
        ? state.material.value
        : state.material,
      ...objectArgs
    );

    if (state.morphTargetDictionary && 'morphTargetDictionary' in object) {
      (object as UnknownRecord)['morphTargetDictionary'] =
        state.morphTargetDictionary;
    }

    if (state.morphTargetInfluences && 'morphTargetInfluences' in object) {
      (object as UnknownRecord)['morphTargetInfluences'] =
        state.morphTargetInfluences;
    }

    return object;
  }

  protected override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      material: true,
      geometry: true,
      morphTargetInfluences: true,
      morphTargetDictionary: true,
    };
  }
}

export const provideNgtMaterialGeometry = createNgtProvider(
  NgtMaterialGeometry,
  provideNgtObject
);

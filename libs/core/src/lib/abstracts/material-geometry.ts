import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtRef } from '../ref';
import { AnyConstructor } from '../types';
import { createNgtProvider } from '../utils/inject';
import { is } from '../utils/is';
import { NgtObject, NgtObjectInputsState, provideNgtObject } from './object';

export interface NgtMaterialGeometryState<
  TObject extends THREE.Object3D = THREE.Object3D,
  TMaterial extends THREE.Material = THREE.Material,
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> extends NgtObjectInputsState<TObject> {
  material: TMaterial | TMaterial[] | NgtRef<TMaterial> | NgtRef<TMaterial>[];
  geometry: TGeometry | NgtRef<TGeometry>;
  morphTargetInfluences?: number[];
  morphTargetDictionary?: Record<string, number>;
}

@Directive()
export abstract class NgtMaterialGeometry<
  TMaterialGeometryObject extends THREE.Object3D = THREE.Object3D,
  TMaterial extends THREE.Material = THREE.Material,
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> extends NgtObject<
  TMaterialGeometryObject,
  NgtMaterialGeometryState<TMaterialGeometryObject, TMaterial, TGeometry>
> {
  @Input() set material(
    material: TMaterial | TMaterial[] | NgtRef<TMaterial> | NgtRef<TMaterial>[]
  ) {
    this.set({ material });
  }

  @Input() set geometry(geometry: TGeometry | NgtRef<TGeometry>) {
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

    return new this.objectType(
      is.ref(state.geometry) ? state.geometry.value : state.geometry,
      is.arr(state.material)
        ? state.material.map((m) => (is.ref(m) ? m.value : m))
        : is.ref(state.material)
        ? state.material.value
        : state.material,
      ...objectArgs
    );
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

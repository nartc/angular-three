import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import {
  NgtMaterialGeometry,
  provideNgtMaterialGeometry,
} from '../abstracts/material-geometry';
import type { AnyConstructor } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonMesh<
  TMesh extends THREE.Mesh = THREE.Mesh
> extends NgtMaterialGeometry<TMesh> {
  abstract get meshType(): AnyConstructor<TMesh>;

  @Input() set morphTargetInfluences(morphTargetInfluences: number[]) {
    this.set({ morphTargetInfluences });
  }

  @Input() set morphTargetDictionary(
    morphTargetDictionary: Record<string, number>
  ) {
    this.set({ morphTargetDictionary });
  }

  override get objectType(): AnyConstructor<TMesh> {
    return this.meshType;
  }

  override postPrepare(object: TMesh) {
    const state = this.get();

    if (state['morphTargetDictionary'] && 'morphTargetDictionary' in object) {
      object.morphTargetDictionary = state['morphTargetDictionary'];
    }

    if (state['morphTargetInfluences'] && 'morphTargetInfluences' in object) {
      object.morphTargetInfluences = state['morphTargetInfluences'];
    }
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      morphTargetInfluences: true,
      morphTargetDictionary: true,
    };
  }
}

export const provideNgtCommonMesh = createNgtProvider(
  NgtCommonMesh,
  provideNgtMaterialGeometry
);

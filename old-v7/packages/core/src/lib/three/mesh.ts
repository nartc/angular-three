import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterialGeometry, provideNgtMaterialGeometry } from '../abstracts/material-geometry';
import type { NgtAnyConstructor } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonMesh<TMesh extends THREE.Mesh = THREE.Mesh> extends NgtMaterialGeometry<TMesh> {
  abstract get meshType(): NgtAnyConstructor<TMesh>;

  @Input() set morphTargetInfluences(morphTargetInfluences: number[]) {
    this.set({ morphTargetInfluences });
  }

  @Input() set morphTargetDictionary(morphTargetDictionary: Record<string, number>) {
    this.set({ morphTargetDictionary });
  }

  override get objectType(): NgtAnyConstructor<TMesh> {
    return this.meshType;
  }

  override postInit() {
    super.postInit();
    const state = this.getState();

    if (state['morphTargetDictionary'] && 'morphTargetDictionary' in this.instanceValue) {
      this.instanceValue.morphTargetDictionary = state['morphTargetDictionary'];
    }

    if (state['morphTargetInfluences'] && 'morphTargetInfluences' in this.instanceValue) {
      this.instanceValue.morphTargetInfluences = state['morphTargetInfluences'];
    }
  }

  override get optionsFields() {
    return [...super.optionsFields, 'morphTargetInfluences', 'morphTargetDictionary'];
  }
}

export const provideNgtCommonMesh = createNgtProvider(NgtCommonMesh, provideNgtMaterialGeometry);

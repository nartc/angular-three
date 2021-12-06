// GENERATED
import {
  ContentChildren,
  Directive,
  Input,
  NgModule,
  NgZone,
  QueryList,
} from '@angular/core';
import * as THREE from 'three';
import { NgtInstancesStore } from '../stores/instances.store';
import { NgtMaterial } from '../three/material';
import { Controller, createControllerProviderFactory } from './controller';

@Directive({
  selector: `
    ngt-mesh,
    ngt-instanced-mesh,
    ngt-skinned-mesh,
    ngt-line,
    ngt-line-loop,
    ngt-line-segments,
    ngt-soba-plane,
    ngt-soba-box,
    ngt-soba-cylinder,
    ngt-soba-cone,
    ngt-soba-circle,
    ngt-soba-sphere,
    ngt-soba-tube,
    ngt-soba-torus,
    ngt-soba-tetrahedron,
    ngt-soba-ring,
    ngt-soba-polyhedron,
    ngt-soba-octahedron,
    ngt-soba-dodecahedron,
    ngt-soba-icosahedron,
    ngt-soba-extrude,
    ngt-soba-lathe,
    ngt-soba-torus-knot,
  `,
  exportAs: 'ngtContentMaterialController',
})
export class NgtContentMaterialController extends Controller {
  @ContentChildren(NgtMaterial, {
    descendants: true,
    emitDistinctChangesOnly: true,
  })
  set materialDirectives(v: QueryList<NgtMaterial>) {
    if (this.material == null && v) {
      this.material =
        v.length === 1
          ? v.first.material
          : v.toArray().map((dir) => dir.material);
    }
  }

  #materialInput?:
    | string
    | string[]
    | THREE.Material
    | THREE.Material[]
    | undefined;

  @Input() set material(
    v: string | string[] | THREE.Material | THREE.Material[] | undefined
  ) {
    if (v) {
      if (!(Array.isArray(v) && !v.length)) {
        this.#materialInput = v;
      }
      this.construct();
    }
  }

  @Input() contentMaterialController?: NgtContentMaterialController;

  get material() {
    return this.#material;
  }

  #material: THREE.Material | THREE.Material[] | undefined = undefined;

  constructor(ngZone: NgZone, private instancesStore: NgtInstancesStore) {
    super(ngZone);
  }

  construct() {
    this.#material = this.#getMaterial(this.#materialInput);
  }

  #getMaterial(
    input: string | string[] | THREE.Material | THREE.Material[] | undefined
  ): THREE.Material | THREE.Material[] | undefined {
    if (input) {
      if (Array.isArray(input)) {
        if (!input.length) return undefined;

        if (input[0] instanceof THREE.Material) {
          return input as THREE.Material[];
        }

        return (input as string[]).map(
          (materialId) =>
            this.instancesStore.getImperativeState().materials[materialId]
        );
      }

      if (input instanceof THREE.Material) {
        return input;
      }

      return this.instancesStore.getImperativeState().materials[input];
    }

    return undefined;
  }

  get controller(): Controller | undefined {
    return this.contentMaterialController;
  }

  get props(): string[] {
    return ['material'];
  }
}

@NgModule({
  declarations: [NgtContentMaterialController],
  exports: [NgtContentMaterialController],
})
export class NgtContentMaterialControllerModule {}

export const [
  NGT_CONTENT_MATERIAL_WATCHED_CONTROLLER,
  NGT_CONTENT_MATERIAL_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
  controller: NgtContentMaterialController,
  watchedControllerTokenName: 'Watched ContentMaterialController',
});

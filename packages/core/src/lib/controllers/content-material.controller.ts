// GENERATED
import {
  ContentChildren,
  Directive,
  Input,
  NgModule,
  QueryList,
} from '@angular/core';
import * as THREE from 'three';
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
    ngt-soba-text,
  `,
  exportAs: 'ngtContentMaterialController',
})
export class NgtContentMaterialController extends Controller {
  @ContentChildren(NgtMaterial, { descendants: true }) set materialDirectives(
    v: QueryList<NgtMaterial>
  ) {
    if (this.material == null && v) {
      this.material =
        v.length === 1
          ? v.first.material
          : v.toArray().map((dir) => dir.material);
    }
  }

  #materialInput?: THREE.Material | THREE.Material[] | undefined;

  @Input() set material(v: THREE.Material | THREE.Material[] | undefined) {
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

  construct() {
    this.#material = this.#getMaterial(this.#materialInput);
  }

  #getMaterial(
    input: THREE.Material | THREE.Material[] | undefined
  ): THREE.Material | THREE.Material[] | undefined {
    if (Array.isArray(input)) {
      if (!input.length) return undefined;

      if (input[0] instanceof THREE.Material) {
        return input as THREE.Material[];
      }
    }

    if (input instanceof THREE.Material) {
      return input;
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

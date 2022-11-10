import {
  coerceNumber,
  NgtAnyConstructor,
  NgtCommonMesh,
  NgtNumberInput,
  provideCommonMeshRef,
  provideNgtCommonMesh,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';
import { GroundProjectedEnv, GroundProjectedEnvParameters } from 'three-stdlib';

@Component({
  selector: 'ngt-soba-ground-projected-env[texture]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMesh(NgtSobaGroundProjectedEnv), provideCommonMeshRef(NgtSobaGroundProjectedEnv)],
})
export class NgtSobaGroundProjectedEnv extends NgtCommonMesh<GroundProjectedEnv> {
  @Input() set height(height: NgtNumberInput) {
    this.set({ height: coerceNumber(height) });
  }

  @Input() set radius(radius: NgtNumberInput) {
    this.set({ radius: coerceNumber(radius) });
  }

  @Input() set texture(texture: THREE.Texture | THREE.CubeTexture) {
    this.set({ texture });
  }

  override get meshType(): NgtAnyConstructor<GroundProjectedEnv> {
    return GroundProjectedEnv;
  }

  override initTrigger$ = this.select((s) => s['texture']);

  override instanceInitFn(): GroundProjectedEnv {
    const { height, radius, texture, scale } = this.getState();
    const initArgs: ConstructorParameters<typeof GroundProjectedEnv> = [texture];

    const parameters: GroundProjectedEnvParameters = {};
    if (height !== undefined) {
      parameters['height'] = height;
    }

    if (radius !== undefined) {
      parameters['radius'] = radius;
    }

    if (Object.keys(parameters).length > 0) {
      initArgs.push(parameters);
    }

    const ground = new GroundProjectedEnv(...initArgs);

    ground.scale.set(...scale.toArray());

    return ground;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'height', 'radius'];
  }
}

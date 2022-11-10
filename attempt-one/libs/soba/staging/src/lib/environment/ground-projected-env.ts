import {
  AnyConstructor,
  coerceNumberProperty,
  NgtCommonMesh,
  NumberInput,
  provideCommonMeshRef,
  provideNgtCommonMesh,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';
import { GroundProjectedEnv, GroundProjectedEnvParameters } from 'three-stdlib';

@Component({
  selector: 'ngt-soba-ground-projected-env[texture]',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,
  providers: [
    provideNgtCommonMesh(NgtSobaGroundProjectedEnv),
    provideCommonMeshRef(NgtSobaGroundProjectedEnv),
  ],
})
export class NgtSobaGroundProjectedEnv extends NgtCommonMesh<GroundProjectedEnv> {
  @Input() set height(height: NumberInput) {
    this.set({ height: coerceNumberProperty(height) });
  }

  @Input() set radius(radius: NumberInput) {
    this.set({ radius: coerceNumberProperty(radius) });
  }

  @Input() set texture(texture: THREE.Texture | THREE.CubeTexture) {
    this.set({ texture });
  }

  override get meshType(): AnyConstructor<GroundProjectedEnv> {
    return GroundProjectedEnv;
  }

  override initTrigger$ = this.select((s) => s['texture']);

  override instanceInitFn(): GroundProjectedEnv {
    const { height, radius, texture } = this.get();
    const initArgs: ConstructorParameters<typeof GroundProjectedEnv> = [
      texture,
    ];

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

    return new GroundProjectedEnv(...initArgs);
  }

  override get optionsFields(): Record<string, boolean> {
    return { ...super.optionsFields, height: true, radius: true };
  }
}

import {
  coerceNumberProperty,
  NgtObject,
  NumberInput,
  provideNgtObject,
  provideObjectRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-cube-camera',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [provideNgtObject(NgtCubeCamera), provideObjectRef(NgtCubeCamera)],
})
export class NgtCubeCamera extends NgtObject<THREE.CubeCamera> {
  @Input() set args(args: ConstructorParameters<typeof THREE.CubeCamera>) {
    this.set({ instanceArgs: args });
  }

  @Input() set near(near: NumberInput) {
    this.set({ near: coerceNumberProperty(near) });
  }

  @Input() set far(far: NumberInput) {
    this.set({ far: coerceNumberProperty(far) });
  }

  @Input() set renderTarget(renderTarget: THREE.WebGLCubeRenderTarget) {
    this.set({ renderTarget });
  }

  override instanceInitFn(): THREE.CubeCamera {
    const args = this.get((s) => s.instanceArgs) as ConstructorParameters<
      typeof THREE.CubeCamera
    >;

    if (args && args.length) {
      this.set({
        near: args[0],
        far: args[1],
        renderTarget: args[2],
      });
    }

    return new THREE.CubeCamera(...args);
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      near: false,
      far: false,
      renderTarget: false,
    };
  }
}

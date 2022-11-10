import {
  coerceNumber,
  NgtNumberInput,
  NgtObject,
  NgtObservableInput,
  provideNgtObject,
  provideObjectRef,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-cube-camera',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtObject(NgtCubeCamera), provideObjectRef(NgtCubeCamera)],
})
export class NgtCubeCamera extends NgtObject<THREE.CubeCamera> {
  @Input() set args(args: ConstructorParameters<typeof THREE.CubeCamera>) {
    this.instanceArgs = args;
  }

  @Input() set near(near: NgtObservableInput<NgtNumberInput>) {
    this.set({
      near: isObservable(near) ? near.pipe(map(coerceNumber)) : coerceNumber(near),
    });
  }

  @Input() set far(far: NgtObservableInput<NgtNumberInput>) {
    this.set({
      far: isObservable(far) ? far.pipe(map(coerceNumber)) : coerceNumber(far),
    });
  }

  @Input() set renderTarget(renderTarget: NgtObservableInput<THREE.WebGLCubeRenderTarget>) {
    this.set({ renderTarget });
  }

  override instanceInitFn(): THREE.CubeCamera {
    const args = this.initInstanceArgs(this.instanceArgs) as ConstructorParameters<typeof THREE.CubeCamera>;

    if (args && args.length) {
      this.set({
        near: args[0],
        far: args[1],
        renderTarget: args[2],
      });
    }

    return new THREE.CubeCamera(...args);
  }

  override get optionsFields() {
    return [...super.optionsFields, 'near', 'far', 'renderTarget'];
  }
}

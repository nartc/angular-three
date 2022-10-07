import {
  is,
  NgtObject,
  NgtObjectPropsState,
  NgtPreObjectInit,
  provideNgtObject,
  provideObjectRef,
  Ref,
  tapEffect,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { filter } from 'rxjs';
import * as THREE from 'three';

export interface NgtPrimitiveState extends NgtObjectPropsState {
  object: THREE.Object3D;
}

@Component({
  selector: 'ngt-primitive[object]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtObject(NgtPrimitive), provideObjectRef(NgtPrimitive)],
})
export class NgtPrimitive extends NgtObject<THREE.Object3D, NgtPrimitiveState> {
  @Input() set object(object: THREE.Object3D | Ref<THREE.Object3D>) {
    if (is.ref(object)) {
      this.ref = object;
      this.set({ object: object.value });
    } else {
      this.set({ object: object as THREE.Object3D });
    }
  }

  get object() {
    return this.get((s) => s.object);
  }

  private readonly object$ = this.select((s) => s.object).pipe(filter((object) => object != null));

  protected override objectInitFn(): THREE.Object3D {
    return this.object as THREE.Object3D;
  }

  protected override get preObjectInit(): NgtPreObjectInit {
    return (initFn) => {
      this.effect<THREE.Object3D>(
        tapEffect(() => {
          // TODO: determine whether we should run clean up logic if object is undefined/null
          initFn();
        })
      )(this.object$);
    };
  }

  override isPrimitive = true;
}

@NgModule({
  imports: [NgtPrimitive],
  exports: [NgtPrimitive],
})
export class NgtPrimitiveModule {}

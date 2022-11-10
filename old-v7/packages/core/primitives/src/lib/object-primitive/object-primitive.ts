import { NgtObject, NgtRef, provideNgtObject, provideObjectRef } from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-object-primitive[object]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtObject(NgtObjectPrimitive), provideObjectRef(NgtObjectPrimitive)],
})
export class NgtObjectPrimitive<TObject extends THREE.Object3D = THREE.Object3D> extends NgtObject<TObject> {
  override isPrimitive = true;

  @Input() set object(object: TObject | NgtRef<TObject>) {
    this.ref = object;
  }

  override instanceInitFn(): TObject {
    return this.instanceValue;
  }
}

import { NgtObject, provideNgtObject, provideObjectRef } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-group',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtObject(NgtGroup), provideObjectRef(NgtGroup)],
})
export class NgtGroup extends NgtObject<THREE.Group> {
  override instanceInitFn(): THREE.Group {
    return new THREE.Group();
  }
}

import {
  NgtObject,
  provideNgtObject,
  provideObjectRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-lod',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtObject(NgtLOD), provideObjectRef(NgtLOD)],
})
export class NgtLOD extends NgtObject<THREE.LOD> {
  override instanceInitFn() {
    return new THREE.LOD();
  }
}

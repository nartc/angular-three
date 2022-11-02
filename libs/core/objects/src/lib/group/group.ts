import {
  NgtObject,
  provideNgtObject,
  provideObjectRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-group',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtObject(NgtGroup), provideObjectRef(NgtGroup)],
})
export class NgtGroup extends NgtObject<THREE.Group> {
  protected override instanceInitFn(): THREE.Group {
    return new THREE.Group();
  }
}

import { NgtObject, provideObjectRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-group',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectRef(NgtGroup)],
})
export class NgtGroup extends NgtObject<THREE.Group> {
  protected override objectInitFn(): THREE.Group {
    return new THREE.Group();
  }
}

@NgModule({
  imports: [NgtGroup],
  exports: [NgtGroup],
})
export class NgtGroupModule {}

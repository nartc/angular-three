import { AnyConstructor, NgtMaterialGeometry, provideNgtObject, provideObjectRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-points',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtObject(NgtPoints), provideObjectRef(NgtPoints)],
})
export class NgtPoints extends NgtMaterialGeometry<THREE.Points> {
  override get objectType(): AnyConstructor<THREE.Points> {
    return THREE.Points;
  }
}

@NgModule({
  imports: [NgtPoints],
  exports: [NgtPoints],
})
export class NgtPointsModule {}

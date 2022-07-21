import { AnyConstructor, NgtMaterialGeometry, provideMaterialGeometryObjectRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-points',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideMaterialGeometryObjectRef(NgtPoints)],
})
export class NgtPoints extends NgtMaterialGeometry<THREE.Points> {
  override get objectType(): AnyConstructor<THREE.Points> {
    return THREE.Points;
  }
}

@NgModule({
  declarations: [NgtPoints],
  exports: [NgtPoints],
})
export class NgtPointsModule {}

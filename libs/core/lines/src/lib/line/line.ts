// GENERATED
import { AnyConstructor, NgtCommonLine, provideCommonLineRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-line',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonLineRef(NgtLine)],
})
export class NgtLine extends NgtCommonLine<THREE.Line> {
  override get lineType(): AnyConstructor<THREE.Line> {
    return THREE.Line;
  }
}

@NgModule({
  imports: [NgtLine],
  exports: [NgtLine],
})
export class NgtLineModule {}

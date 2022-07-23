// GENERATED
import { AnyConstructor, NgtCommonLine, provideNgtCommonLine, provideCommonLineRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line-loop',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonLine(NgtLineLoop), provideCommonLineRef(NgtLineLoop)],
})
export class NgtLineLoop extends NgtCommonLine<THREE.LineLoop> {
  override get lineType(): AnyConstructor<THREE.LineLoop> {
    return THREE.LineLoop;
  }
}

@NgModule({
  imports: [NgtLineLoop],
  exports: [NgtLineLoop],
})
export class NgtLineLoopModule {}

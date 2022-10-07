// GENERATED
import { AnyConstructor, NgtCommonLine, provideNgtCommonLine, provideCommonLineRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line-segments',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonLine(NgtLineSegments), provideCommonLineRef(NgtLineSegments)],
})
export class NgtLineSegments extends NgtCommonLine<THREE.LineSegments> {
  override get lineType(): AnyConstructor<THREE.LineSegments> {
    return THREE.LineSegments;
  }
}

@NgModule({
  imports: [NgtLineSegments],
  exports: [NgtLineSegments],
})
export class NgtLineSegmentsModule {}

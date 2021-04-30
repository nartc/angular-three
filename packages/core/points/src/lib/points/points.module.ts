import { NgModule } from '@angular/core';
import { PointsDirective } from './points.directive';

@NgModule({
  declarations: [PointsDirective],
  exports: [PointsDirective],
})
export class ThreePointsModule {}

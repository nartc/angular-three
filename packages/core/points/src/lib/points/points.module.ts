import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PointsDirective } from './points.directive';

@NgModule({
  declarations: [PointsDirective],
  imports: [CommonModule],
  exports: [PointsDirective],
})
export class ThreePointsModule {}

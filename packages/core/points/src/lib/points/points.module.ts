import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointsDirective } from './points.directive';



@NgModule({
  declarations: [
    PointsDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PointsDirective
  ]
})
export class PointsModule { }

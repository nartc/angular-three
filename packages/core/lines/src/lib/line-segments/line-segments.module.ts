import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineSegmentsDirective } from './line-segments.directive';



@NgModule({
  declarations: [
    LineSegmentsDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LineSegmentsDirective
  ]
})
export class LineSegmentsModule { }

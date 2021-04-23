import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShapeBufferGeometryDirective } from './shape-buffer-geometry.directive';



@NgModule({
  declarations: [
    ShapeBufferGeometryDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ShapeBufferGeometryDirective
  ]
})
export class ShapeBufferGeometryModule { }

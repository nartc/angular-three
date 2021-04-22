import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametricBufferGeometryDirective } from './parametric-buffer-geometry.directive';



@NgModule({
  declarations: [
    ParametricBufferGeometryDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ParametricBufferGeometryDirective
  ]
})
export class ParametricBufferGeometryModule { }

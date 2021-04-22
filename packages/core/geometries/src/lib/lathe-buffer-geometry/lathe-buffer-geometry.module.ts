import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LatheBufferGeometryDirective } from './lathe-buffer-geometry.directive';



@NgModule({
  declarations: [
    LatheBufferGeometryDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LatheBufferGeometryDirective
  ]
})
export class LatheBufferGeometryModule { }

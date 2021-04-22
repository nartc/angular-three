import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtrudeBufferGeometryDirective } from './extrude-buffer-geometry.directive';



@NgModule({
  declarations: [
    ExtrudeBufferGeometryDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ExtrudeBufferGeometryDirective
  ]
})
export class ExtrudeBufferGeometryModule { }

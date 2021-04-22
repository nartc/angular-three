import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RingBufferGeometryDirective } from './ring-buffer-geometry.directive';



@NgModule({
  declarations: [
    RingBufferGeometryDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RingBufferGeometryDirective
  ]
})
export class RingBufferGeometryModule { }

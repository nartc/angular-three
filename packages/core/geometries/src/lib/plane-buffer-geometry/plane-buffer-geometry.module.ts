import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaneBufferGeometryDirective } from './plane-buffer-geometry.directive';



@NgModule({
  declarations: [
    PlaneBufferGeometryDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlaneBufferGeometryDirective
  ]
})
export class PlaneBufferGeometryModule { }

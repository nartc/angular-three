import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConeBufferGeometryDirective } from './cone-buffer-geometry.directive';



@NgModule({
  declarations: [
    ConeBufferGeometryDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ConeBufferGeometryDirective
  ]
})
export class ConeBufferGeometryModule { }

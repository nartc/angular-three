import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DodecahedronBufferGeometryDirective } from './dodecahedron-buffer-geometry.directive';



@NgModule({
  declarations: [
    DodecahedronBufferGeometryDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DodecahedronBufferGeometryDirective
  ]
})
export class DodecahedronBufferGeometryModule { }

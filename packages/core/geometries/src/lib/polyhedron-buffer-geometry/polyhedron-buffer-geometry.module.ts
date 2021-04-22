import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolyhedronBufferGeometryDirective } from './polyhedron-buffer-geometry.directive';



@NgModule({
  declarations: [
    PolyhedronBufferGeometryDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PolyhedronBufferGeometryDirective
  ]
})
export class PolyhedronBufferGeometryModule { }

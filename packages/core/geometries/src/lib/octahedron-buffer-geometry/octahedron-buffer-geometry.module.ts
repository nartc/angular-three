import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OctahedronBufferGeometryDirective } from './octahedron-buffer-geometry.directive';



@NgModule({
  declarations: [
    OctahedronBufferGeometryDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OctahedronBufferGeometryDirective
  ]
})
export class OctahedronBufferGeometryModule { }

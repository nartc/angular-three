import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IcosahedronGeometryDirective } from './icosahedron-geometry.directive';



@NgModule({
  declarations: [
    IcosahedronGeometryDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IcosahedronGeometryDirective
  ]
})
export class IcosahedronGeometryModule { }

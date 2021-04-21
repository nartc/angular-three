import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IcosahedronGeometryDirective } from './icosahedron-geometry.directive';

@NgModule({
  declarations: [IcosahedronGeometryDirective],
  imports: [CommonModule],
  exports: [IcosahedronGeometryDirective],
})
export class ThreeIcosahedronGeometryModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TetrahedronBufferGeometryDirective } from './tetrahedron-buffer-geometry.directive';

@NgModule({
  declarations: [TetrahedronBufferGeometryDirective],
  imports: [CommonModule],
  exports: [TetrahedronBufferGeometryDirective],
})
export class TetrahedronBufferGeometryModule {}

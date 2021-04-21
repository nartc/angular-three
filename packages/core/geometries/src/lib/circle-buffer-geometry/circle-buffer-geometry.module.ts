import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CircleBufferGeometryDirective } from './circle-buffer-geometry.directive';

@NgModule({
  declarations: [CircleBufferGeometryDirective],
  imports: [CommonModule],
  exports: [CircleBufferGeometryDirective],
})
export class ThreeCircleBufferGeometryModule {}

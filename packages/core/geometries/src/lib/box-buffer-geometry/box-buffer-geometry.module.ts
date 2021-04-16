import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoxBufferGeometryDirective } from './box-buffer-geometry.directive';

@NgModule({
  declarations: [BoxBufferGeometryDirective],
  imports: [CommonModule],
  exports: [BoxBufferGeometryDirective],
})
export class BoxBufferGeometryModule {}

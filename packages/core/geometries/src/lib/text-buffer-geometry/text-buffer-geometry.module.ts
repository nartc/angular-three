import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TextBufferGeometryDirective } from './text-buffer-geometry.directive';

@NgModule({
  declarations: [TextBufferGeometryDirective],
  imports: [CommonModule],
  exports: [TextBufferGeometryDirective],
})
export class TextBufferGeometryModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SphereBufferGeometryDirective } from './sphere-buffer-geometry.directive';

@NgModule({
  declarations: [SphereBufferGeometryDirective],
  imports: [CommonModule],
  exports: [SphereBufferGeometryDirective],
})
export class SphereBufferGeometryModule {}

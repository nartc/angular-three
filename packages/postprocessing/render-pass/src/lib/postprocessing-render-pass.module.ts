import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RenderPassDirective } from './render-pass.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [RenderPassDirective],
  exports: [RenderPassDirective],
})
export class ThreeRenderPassModule {}

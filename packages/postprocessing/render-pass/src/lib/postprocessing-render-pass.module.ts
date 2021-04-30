import { NgModule } from '@angular/core';
import { RenderPassDirective } from './render-pass.directive';

@NgModule({
  declarations: [RenderPassDirective],
  exports: [RenderPassDirective],
})
export class ThreeRenderPassModule {}

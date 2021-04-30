import { NgModule } from '@angular/core';
import { ShaderPassDirective } from './shader-pass.directive';

@NgModule({
  declarations: [ShaderPassDirective],
  exports: [ShaderPassDirective],
})
export class ThreeShaderPassModule {}

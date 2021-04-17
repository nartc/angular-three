import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShaderPassDirective } from './shader-pass.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ShaderPassDirective
  ],
  exports: [
    ShaderPassDirective
  ],
})
export class ThreeShaderPassModule {}

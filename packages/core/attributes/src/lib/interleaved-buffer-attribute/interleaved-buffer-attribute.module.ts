import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterleavedBufferAttributeDirective } from './interleaved-buffer-attribute.directive';



@NgModule({
  declarations: [
    InterleavedBufferAttributeDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InterleavedBufferAttributeDirective
  ]
})
export class InterleavedBufferAttributeModule { }

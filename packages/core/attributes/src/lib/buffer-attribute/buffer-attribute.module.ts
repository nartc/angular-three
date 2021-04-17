import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BufferAttributeDirective } from './buffer-attribute.directive';



@NgModule({
  declarations: [
    BufferAttributeDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BufferAttributeDirective
  ]
})
export class BufferAttributeModule { }

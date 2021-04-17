import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstancedBufferAttributeDirective } from './instanced-buffer-attribute.directive';



@NgModule({
  declarations: [
    InstancedBufferAttributeDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InstancedBufferAttributeDirective
  ]
})
export class InstancedBufferAttributeModule { }

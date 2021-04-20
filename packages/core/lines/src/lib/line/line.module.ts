import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineDirective } from './line.directive';



@NgModule({
  declarations: [
    LineDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LineDirective
  ]
})
export class LineModule { }

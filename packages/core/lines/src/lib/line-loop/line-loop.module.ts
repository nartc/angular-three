import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineLoopDirective } from './line-loop.directive';



@NgModule({
  declarations: [
    LineLoopDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LineLoopDirective
  ]
})
export class LineLoopModule { }

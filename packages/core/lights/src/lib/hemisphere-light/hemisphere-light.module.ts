import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HemisphereLightDirective } from './hemisphere-light.directive';



@NgModule({
  declarations: [
    HemisphereLightDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HemisphereLightDirective
  ]
})
export class HemisphereLightModule { }

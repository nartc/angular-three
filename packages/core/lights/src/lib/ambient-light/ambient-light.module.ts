import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmbientLightDirective } from './ambient-light.directive';



@NgModule({
  declarations: [
    AmbientLightDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AmbientLightDirective
  ]
})
export class AmbientLightModule { }

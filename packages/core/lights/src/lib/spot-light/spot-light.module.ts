import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotLightDirective } from './spot-light.directive';



@NgModule({
  declarations: [
    SpotLightDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SpotLightDirective
  ]
})
export class SpotLightModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectionalLightDirective } from './directional-light.directive';



@NgModule({
  declarations: [
    DirectionalLightDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DirectionalLightDirective
  ]
})
export class DirectionalLightModule { }

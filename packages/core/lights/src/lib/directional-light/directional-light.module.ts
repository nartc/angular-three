import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectionalLightDirective } from './directional-light.directive';

@NgModule({
  declarations: [DirectionalLightDirective],
  imports: [CommonModule],
  exports: [DirectionalLightDirective],
})
export class ThreeDirectionalLightModule {}

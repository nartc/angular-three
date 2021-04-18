import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpotLightDirective } from './spot-light.directive';

@NgModule({
  declarations: [SpotLightDirective],
  imports: [CommonModule],
  exports: [SpotLightDirective],
})
export class ThreeSpotLightModule {}

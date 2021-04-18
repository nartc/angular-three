import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrbitControlsDirective } from './orbit-controls.directive';

@NgModule({
  declarations: [OrbitControlsDirective],
  imports: [CommonModule],
  exports: [OrbitControlsDirective],
})
export class ThreeOrbitControlsModule {}

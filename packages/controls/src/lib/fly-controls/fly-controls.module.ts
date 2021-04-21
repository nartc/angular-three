import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlyControlsDirective } from './fly-controls.directive';

@NgModule({
  declarations: [FlyControlsDirective],
  imports: [CommonModule],
  exports: [FlyControlsDirective],
})
export class ThreeFlyControlsModule {}

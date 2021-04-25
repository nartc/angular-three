import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PopmotionDirective } from './popmotion.directive';

@NgModule({
  declarations: [PopmotionDirective],
  imports: [CommonModule],
  exports: [PopmotionDirective],
})
export class ThreePopmotionModule {}

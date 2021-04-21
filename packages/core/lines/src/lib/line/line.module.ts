import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LineDirective } from './line.directive';

@NgModule({
  declarations: [LineDirective],
  imports: [CommonModule],
  exports: [LineDirective],
})
export class ThreeLineModule {}

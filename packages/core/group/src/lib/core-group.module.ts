import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GroupDirective } from './group.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    GroupDirective
  ],
  exports: [
    GroupDirective
  ],
})
export class ThreeGroupModule {}

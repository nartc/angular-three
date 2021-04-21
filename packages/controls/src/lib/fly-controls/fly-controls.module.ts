import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyControlsDirective } from './fly-controls.directive';



@NgModule({
  declarations: [
    FlyControlsDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FlyControlsDirective
  ]
})
export class FlyControlsModule { }

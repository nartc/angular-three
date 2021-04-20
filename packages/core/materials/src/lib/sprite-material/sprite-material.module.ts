import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpriteMaterialDirective } from './sprite-material.directive';



@NgModule({
  declarations: [
    SpriteMaterialDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SpriteMaterialDirective
  ]
})
export class SpriteMaterialModule { }

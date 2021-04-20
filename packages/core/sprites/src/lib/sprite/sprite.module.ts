import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpriteDirective } from './sprite.directive';



@NgModule({
  declarations: [
    SpriteDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SpriteDirective
  ]
})
export class SpriteModule { }

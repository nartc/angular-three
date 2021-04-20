import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionalAudioDirective } from './positional-audio.directive';



@NgModule({
  declarations: [
    PositionalAudioDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PositionalAudioDirective
  ]
})
export class PositionalAudioModule { }

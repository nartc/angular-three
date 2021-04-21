import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PositionalAudioDirective } from './positional-audio.directive';

@NgModule({
  declarations: [PositionalAudioDirective],
  imports: [CommonModule],
  exports: [PositionalAudioDirective],
})
export class ThreePositionalAudioModule {}

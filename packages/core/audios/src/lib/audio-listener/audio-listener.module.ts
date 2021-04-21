import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AudioListenerDirective } from './audio-listener.directive';

@NgModule({
  declarations: [AudioListenerDirective],
  imports: [CommonModule],
  exports: [AudioListenerDirective],
})
export class ThreeAudioListenerModule {}

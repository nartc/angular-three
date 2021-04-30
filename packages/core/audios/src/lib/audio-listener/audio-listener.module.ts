import { NgModule } from '@angular/core';
import { AudioListenerDirective } from './audio-listener.directive';

@NgModule({
  declarations: [AudioListenerDirective],
  exports: [AudioListenerDirective],
})
export class ThreeAudioListenerModule {}

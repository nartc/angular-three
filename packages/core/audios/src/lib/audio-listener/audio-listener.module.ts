import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioListenerDirective } from './audio-listener.directive';



@NgModule({
  declarations: [
    AudioListenerDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AudioListenerDirective
  ]
})
export class AudioListenerModule { }

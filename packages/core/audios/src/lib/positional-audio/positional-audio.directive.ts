import { Directive } from '@angular/core';
import { PositionalAudio } from 'three';
import { ThreeAudio } from '../abstracts';

@Directive({
  selector: 'ngt-positionalAudio',
  exportAs: 'ngtPositionalAudio',
})
export class PositionalAudioDirective extends ThreeAudio<
  PannerNode,
  PositionalAudio
> {
  audioType = PositionalAudio;
}

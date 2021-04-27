import { Directive } from '@angular/core';
import { PositionalAudio } from 'three';
import { ThreeAudio } from '../abstracts';

@Directive({
  selector: 'ngt-positional-audio',
  exportAs: 'ngtPositionalAudio',
})
export class PositionalAudioDirective extends ThreeAudio<
  PannerNode,
  PositionalAudio
> {
  audioType = PositionalAudio;
}

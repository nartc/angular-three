// GENERATED
import { Directive, Input, NgModule } from '@angular/core';
import { Controller, createControllerProviderFactory } from './controller';

@Directive({
  selector: `
    ngt-audio,
    ngt-positional-audio,
    ngt-soba-positional-audio,
  `,
  exportAs: 'ngtAudioController',
})
export class NgtAudioController extends Controller {
  @Input() autoplay?: boolean;
  @Input() buffer: null | AudioBuffer = null;
  @Input() detune = 0;
  @Input() loop = false;
  @Input() loopStart = 0;
  @Input() loopEnd = 0;
  @Input() offset = 0;
  @Input() duration: number | undefined = undefined;
  @Input() playbackRate = 1;
  @Input() isPlaying = false;
  @Input() hasPlaybackControl = true;
  @Input() sourceType = 'empty';
  @Input() source: null | AudioBufferSourceNode = null;
  @Input() filters: AudioNode[] = [];

  @Input() audioController?: NgtAudioController;

  get props(): string[] {
    return [
      'autoplay',
      'buffer',
      'detune',
      'loop',
      'loopStart',
      'loopEnd',
      'offset',
      'duration',
      'playbackRate',
      'isPlaying',
      'hasPlaybackControl',
      'sourceType',
      'source',
      'filters',
    ];
  }

  get controller(): Controller | undefined {
    return this.audioController;
  }
}

@NgModule({
  declarations: [NgtAudioController],
  exports: [NgtAudioController],
})
export class NgtAudioControllerModule {}

export const [NGT_AUDIO_WATCHED_CONTROLLER, NGT_AUDIO_CONTROLLER_PROVIDER] =
  createControllerProviderFactory({
    watchedControllerTokenName: 'Watched AudioController',
    controller: NgtAudioController,
  });

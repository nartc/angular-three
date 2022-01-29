import {
  EnhancedRxState,
  NGT_AUDIO_CONTROLLER_PROVIDER,
  NGT_AUDIO_WATCHED_CONTROLLER,
  NgtAudioController,
  NgtAudioControllerModule,
  NgtLoaderService,
  NgtSobaExtender,
  NgtStore,
  UnknownRecord,
} from '@angular-three/core';
import { NgtPositionalAudioModule } from '@angular-three/core/audios';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs';
import * as THREE from 'three';

export interface NgtSobaPositionalAudioState {
  url: string;
  distance: number;
  loop: boolean;
  audio: THREE.PositionalAudio;
  listener: THREE.AudioListener;
  autoplay: boolean;
}

@Component({
  selector: 'ngt-soba-positional-audio',
  template: `
    <ngt-positional-audio
      *ngIf="listener$ | async as listener"
      (ready)="onPositionalAudioReady($event)"
      (animateReady)="animateReady.emit({ entity: object, state: $event })"
      [listener]="listener"
      [audioController]="audioController"
    ></ngt-positional-audio>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_AUDIO_CONTROLLER_PROVIDER,
    EnhancedRxState,
    { provide: NgtSobaExtender, useExisting: NgtSobaPositionalAudio },
  ],
})
export class NgtSobaPositionalAudio extends NgtSobaExtender<THREE.PositionalAudio> {
  @Input() set url(url: string) {
    this.state.set({ url });
  }

  @Input() set distance(distance: number) {
    this.state.set({ distance });
  }

  @Input() set loop(loop: boolean) {
    this.state.set({ loop });
  }

  readonly listener$ = this.state.select('listener');
  readonly buffer$ = this.state
    .select('url')
    .pipe(switchMap((url) => this.loaderService.use(THREE.AudioLoader, url)));
  readonly changes$ = combineLatest([
    this.buffer$,
    this.state.select(selectSlice(['distance', 'loop'])),
  ]).pipe(map(([buffer, { loop, distance }]) => ({ buffer, loop, distance })));

  constructor(
    @Inject(NGT_AUDIO_WATCHED_CONTROLLER)
    public audioController: NgtAudioController,
    private loaderService: NgtLoaderService,
    private store: NgtStore,
    private state: EnhancedRxState<NgtSobaPositionalAudioState>
  ) {
    super();
    state.set({ listener: new THREE.AudioListener(), distance: 1, loop: true });

    state.connect(
      'autoplay',
      audioController.change$.pipe(
        map(() => audioController.autoplay || false),
        startWith(audioController.autoplay || false),
        distinctUntilChanged()
      )
    );

    state.hold(this.changes$, ({ buffer, loop, distance }) => {
      const { autoplay, audio } = state.get();
      if (audio) {
        audio.setBuffer(buffer);
        audio.setRefDistance(distance);
        audio.setLoop(loop);
        if (autoplay && !audio.isPlaying) audio.play();
      }
    });

    state.holdEffect(state.select('autoplay'), () => {
      const { audio, listener } = state.get();
      const camera = this.store.get('camera');
      if (camera) {
        camera.add(listener);
      }

      return () => {
        if (camera) {
          camera.remove(listener);
        }
        if (audio) {
          if (audio.isPlaying) audio.stop();
          if (
            audio.source &&
            (audio.source as unknown as UnknownRecord)._connected
          ) {
            audio.disconnect();
          }
        }
      };
    });
  }

  onPositionalAudioReady(audio: THREE.PositionalAudio) {
    this.object = audio;
    this.state.set({ audio });
  }
}

@NgModule({
  declarations: [NgtSobaPositionalAudio],
  exports: [NgtSobaPositionalAudio, NgtAudioControllerModule],
  imports: [NgtPositionalAudioModule, CommonModule],
})
export class NgtSobaPositionalAudioModule {}

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
  Injectable,
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

@Injectable()
export class NgtSobaPositionalAudioStore extends EnhancedRxState<NgtSobaPositionalAudioState> {
  readonly buffer$ = this.select('url').pipe(
    switchMap((url) => this.loaderService.use(THREE.AudioLoader, url))
  );

  readonly changes$ = combineLatest([
    this.buffer$,
    this.select(selectSlice(['distance', 'loop'])),
  ]).pipe(map(([buffer, { loop, distance }]) => ({ buffer, loop, distance })));

  constructor(
    private loaderService: NgtLoaderService,
    private store: NgtStore
  ) {
    super();
    this.set({ listener: new THREE.AudioListener(), distance: 1, loop: true });
    this.hold(this.changes$, ({ buffer, loop, distance }) => {
      const { autoplay, audio } = this.get();
      if (audio) {
        audio.setBuffer(buffer);
        audio.setRefDistance(distance);
        audio.setLoop(loop);
        if (autoplay && !audio.isPlaying) audio.play();
      }
    });

    this.holdEffect(this.select('autoplay'), () => {
      const { audio, listener } = this.get();
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
}

@Component({
  selector: 'ngt-soba-positional-audio',
  template: `
    <ngt-positional-audio
      *ngIf="listener$ | async as listener"
      #ngtPositionalAudio="ngtPositionalAudio"
      (ready)="onPositionalAudioReady(ngtPositionalAudio.audio)"
      [listener]="listener"
      [audioController]="audioController"
    ></ngt-positional-audio>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_AUDIO_CONTROLLER_PROVIDER,
    NgtSobaPositionalAudioStore,
    { provide: NgtSobaExtender, useExisting: NgtSobaPositionalAudio },
  ],
})
export class NgtSobaPositionalAudio extends NgtSobaExtender<THREE.PositionalAudio> {
  @Input() set url(url: string) {
    this.sobaPositionalAudioStore.set({ url });
  }

  @Input() set distance(distance: number) {
    this.sobaPositionalAudioStore.set({ distance });
  }

  @Input() set loop(loop: boolean) {
    this.sobaPositionalAudioStore.set({ loop });
  }

  readonly listener$ = this.sobaPositionalAudioStore.select('listener');

  constructor(
    @Inject(NGT_AUDIO_WATCHED_CONTROLLER)
    public audioController: NgtAudioController,
    private sobaPositionalAudioStore: NgtSobaPositionalAudioStore
  ) {
    super();
    sobaPositionalAudioStore.connect(
      'autoplay',
      audioController.change$.pipe(
        map(() => audioController.autoplay || false),
        startWith(audioController.autoplay || false),
        distinctUntilChanged()
      )
    );
  }

  onPositionalAudioReady(audio: THREE.PositionalAudio) {
    this.object = audio;
    this.sobaPositionalAudioStore.set({ audio });
  }
}

@NgModule({
  declarations: [NgtSobaPositionalAudio],
  exports: [NgtSobaPositionalAudio, NgtAudioControllerModule],
  imports: [NgtPositionalAudioModule, CommonModule],
})
export class NgtSobaPositionalAudioModule {}

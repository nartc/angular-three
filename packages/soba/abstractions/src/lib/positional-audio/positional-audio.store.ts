import {
  CanvasStore,
  EnhancedComponentStore,
  LoaderService,
  NgtCamera,
  UnknownRecord,
} from '@angular-three/core';
import { Injectable, NgZone } from '@angular/core';
import { switchMap, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';

export interface SobaPositionalAudioState {
  url: string;
  distance: number;
  loop: boolean;
  listener: THREE.AudioListener;
  sound: THREE.PositionalAudio | null;
  autoplay: boolean;
}

export const initialSobaPositionalAudioState: SobaPositionalAudioState = {
  url: '',
  distance: 1,
  loop: true,
  listener: new THREE.AudioListener(),
  sound: null,
  autoplay: false,
};

@Injectable()
export class SobaPositionalAudioStore extends EnhancedComponentStore<SobaPositionalAudioState> {
  readonly buffer$ = this.selectors.url$.pipe(
    switchMap((url) => this.loaderService.use(THREE.AudioLoader, url))
  );

  readonly changes$ = this.select(
    this.buffer$,
    this.canvasStore.selectors.camera$,
    this.selectors.distance$,
    this.selectors.loop$,
    (buffer, camera, distance, loop) => ({ buffer, camera, distance, loop }),
    { debounce: true }
  );

  constructor(
    private loaderService: LoaderService,
    private canvasStore: CanvasStore,
    private ngZone: NgZone
  ) {
    super(initialSobaPositionalAudioState);
  }

  readonly changesEffect = this.effect<{
    buffer: AudioBuffer;
    camera: NgtCamera | undefined;
    distance: number;
    loop: boolean;
  }>((params$) =>
    params$.pipe(
      withLatestFrom(this.selectors.sound$, this.selectors.autoplay$),
      tap(([{ buffer, distance, loop }, sound, autoplay]) => {
        if (sound) {
          sound.setBuffer(buffer);
          sound.setRefDistance(distance);
          sound.setLoop(loop);
          if (autoplay && !sound.isPlaying) {
            sound.play();
          }
        }
      })
    )
  );

  readonly initEffect = this.effect<boolean>((autoplay$) =>
    autoplay$.pipe(
      withLatestFrom(
        this.canvasStore.selectors.camera$,
        this.selectors.listener$
      ),
      tap(([autoplay, camera, listener]) => {
        this.updaters.setAutoplay(autoplay);
        this.ngZone.runOutsideAngular(() => {
          if (camera) {
            camera.add(listener);
          }
        });
      })
    )
  );

  readonly destroyEffect = this.effect(($) =>
    $.pipe(
      withLatestFrom(
        this.canvasStore.selectors.camera$,
        this.selectors.listener$,
        this.selectors.sound$
      ),
      tap(([, camera, listener, sound]) => {
        this.ngZone.runOutsideAngular(() => {
          if (camera) {
            camera.remove(listener);
          }
          if (sound) {
            if (sound.isPlaying) {
              sound.stop();
            }

            if (
              sound.source &&
              (sound.source as unknown as UnknownRecord)._connected
            ) {
              sound.disconnect();
            }
          }
        });
      })
    )
  );
}

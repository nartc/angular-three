import {
  NGT_AUDIO_CONTROLLER_PROVIDER,
  NGT_AUDIO_WATCHED_CONTROLLER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtAudioController,
  NgtCoreModule,
  NgtObject3dController,
} from '@angular-three/core';
import { NgtPositionalAudioModule } from '@angular-three/core/audios';
import { NgtSobaExtender } from '@angular-three/soba';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as THREE from 'three';
import { SobaPositionalAudioStore } from './positional-audio.store';

@Component({
  selector: 'ngt-soba-positional-audio[url]',
  exportAs: 'ngtSobaPositionalAudio',
  template: `
    <ngt-positional-audio
      *ngIf="listener$ | async as listener"
      (ready)="onAudioReady($event)"
      (animateReady)="animateReady.emit($event)"
      [listener]="listener"
      [object3dController]="object3dController"
      [audioController]="audioController"
    >
      <ng-content></ng-content>
    </ngt-positional-audio>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_AUDIO_CONTROLLER_PROVIDER, SobaPositionalAudioStore],
})
export class NgtSobaPositionalAudio
  extends NgtSobaExtender<THREE.PositionalAudio>
  implements OnInit, OnDestroy
{
  @Input() set url(v: string) {
    this.sobaPositionalAudioStore.updaters.setUrl(v);
  }

  @Input() set distance(v: number) {
    this.sobaPositionalAudioStore.updaters.setDistance(v);
  }

  @Input() set loop(v: boolean) {
    this.sobaPositionalAudioStore.updaters.setLoop(v);
  }

  readonly listener$ = this.sobaPositionalAudioStore.selectors.listener$;

  constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController,
    @Inject(NGT_AUDIO_WATCHED_CONTROLLER)
    public audioController: NgtAudioController,
    private ngZone: NgZone,
    private sobaPositionalAudioStore: SobaPositionalAudioStore
  ) {
    super();
  }

  ngOnInit() {
    this.sobaPositionalAudioStore.initEffect(
      this.audioController.autoplay || false
    );
  }

  ngOnDestroy() {
    this.sobaPositionalAudioStore.destroyEffect();
  }

  onAudioReady(audio: THREE.PositionalAudio) {
    this.ngZone.runOutsideAngular(() => {
      this.sobaPositionalAudioStore.updaters.setSound(audio);
      this.ready.emit(audio);
    });
  }
}

@NgModule({
  declarations: [NgtSobaPositionalAudio],
  exports: [NgtSobaPositionalAudio],
  imports: [CommonModule, NgtCoreModule, NgtPositionalAudioModule],
})
export class NgtSobaPositionalAudioModule {}
